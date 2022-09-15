const httpStatus = require("http-status");
const { omit } = require("lodash");
const Message = require("../models/message");
const ChatGroup = require("../models/chatGroup");
const User = require("../models/user");
const APIError = require("../utils/APIError");
const multer = require("multer");
const uuidv4 = require("uuid/v4");
const { staticUrl } = require("../../config/vars");
const path = require("path");
const fs = require("fs");
const storagePhoto = require("../utils/storagePhoto");
const storageFile = require("../utils/storageFile");
const _ = require("lodash");

exports.load = async (req, res, next, id) => {
  try {
    const message = await Message.get(id);
    req.locals = { message: message.dataValues };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    let senderId = req.user.id;
    let receiverId = req.params.receiverId;
    let { offset, limit } = req.query;
    let receiverInfo = await User.findOne({ where: { id: receiverId } });
    let responsceList = [];
    let responeData = {};

    if (!receiverInfo) {
      receiverInfo = await ChatGroup.findOne({ where: { id: receiverId } });
      if (!receiverInfo || !receiverInfo.members.includes(req.user.id)) {
        throw new APIError({
          message: "Not found",
          status: httpStatus.BAD_REQUEST,
        });
      }

      const groupMessages = await Message.getGroup({
        groupId: receiverInfo.id,
        offset,
        limit,
      });

      let admin = await User.findOne({ where: { id: receiverInfo.admin } });

      let members = await User.find({
        _id: { $in: receiverInfo.members },
      });
      members = members.map((member) => {
        let tempMember = {
          id: member.id,
          firstname: member.firstname,
          lastname: member.lastname,
          picture: member.picture,
        };
        if (member.id === receiverInfo.admin) {
          tempMember.admin = true;
        }
        return tempMember;
      });

      responsceList = await groupMessages.map((message) => message);
      responeData.conversationType = "ChatGroup";
      responeData.receiver = {
        id: receiverInfo.id,
        picture: receiverInfo.picture,
        name: receiverInfo.name,
        members,
      };
    } else {
      // personal chat
      const personalMessages = await Message.getPersonal({
        senderId,
        receiverId,
        offset,
        limit,
      });
      responsceList = await personalMessages.map(
        (message) => message.dataValues
      );
      responeData.conversationType = "User";
      responeData.receiver = {
        picture: receiverInfo.picture,
        firstname: receiverInfo.firstname,
        lastname: receiverInfo.lastname,
        id: receiverInfo.id,
      };
    }

    responeData.messages = responsceList.reverse();
    res.json(responeData);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const sender = req.user.id;
    const { conversationType } = req.body;
    let conversationId = null;
    if (conversationType === "ChatGroup") {
      const group = await ChatGroup.findOne({
        where: { id: req.body.receiver },
      });

      // if (group && group.members.includes(req.user.id))
      conversationId = req.body.receiver;
    } else if (conversationType === "User") {
      const user = await User.findOne({ where: { id: req.body.receiver } });
      if (user) conversationId = [sender, req.body.receiver].sort().join(".");
    }

    if (!conversationId) {
      throw new APIError({
        message: "Something went wrong",
        status: httpStatus.BAD_REQUEST,
      });
    }
    let savedMessage = await Message.create({
      ...req.body,
      sender,
      conversationId,
    });

    res.status(httpStatus.CREATED);
    res.json({ ...savedMessage.dataValues });
  } catch (error) {
    next(error);
  }
};

exports.groupMessages = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const messages = await Message.findAll({
      where: {
        receiver: groupId,
        conversationType: "ChatGroup",
      },
      order: [["updatedAt", "ASC"]],
    });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    let sender = req.user.id;
    let personalMessages = await Message.listPersonal({
      userId: sender,
      offset: req.query.pskip,
    });

    // Lấy danh sách chat nhóm
    let groupMessages = await ChatGroup.list({
      userId: [sender.toString()],
      offset: req.query.gskip,
    });
    let groupMessagesPromise = groupMessages.map(async (item) => {
      let tempItem = {
        receiver: {
          _id: item.id,
          name: item.name,
          picture: item.picture,
        },
        message: "",
        sender: "",
        type: "",
        conversationType: "ChatGroup",
        updatedAt: item.updatedAt,
      };
      let lastMessage = await Message.find({ receiver: item.id })
        .populate("sender", "firstname lastname")
        .sort({ updatedAt: -1 })
        .limit(1);
      if (lastMessage.length && lastMessage.length > 0) {
        tempItem.message = lastMessage[0].message;
        tempItem.sender = lastMessage[0].sender;
        tempItem.type = lastMessage[0].type;
        tempItem.conversationType = lastMessage[0].conversationType;
        tempItem.updatedAt = lastMessage[0].updatedAt;
      }

      return tempItem;
    });

    let personalMessagesResponse = await Promise.all(groupMessagesPromise);
    let messages = personalMessages.concat(personalMessagesResponse);

    res.json(
      _.sortBy(messages, (item) => {
        return -item.updatedAt;
      })
    );
  } catch (error) {
    next(error);
  }
};

let photosUploadFile = multer(storagePhoto).single("photos");

exports.addPhotos = (req, res, next) => {
  photosUploadFile(req, res, async (err) => {
    try {
      if (!req.file) {
        console.log(err);
        throw new APIError({
          message: err,
          status: httpStatus.BAD_REQUEST,
        });
      }
      let outputFile = req.file.path + ".jpg";

      // await sharp(req.file.path).jpeg({ quality: 80 }).toFile(outputFile);

      // delete old file
      // fs.unlinkSync(req.file.path);

      let temp = {
        uid: uuidv4(),
        name: `${req.file.filename}.jpg`,
        path: `/images/message/${req.file.filename}.jpg`,
        status: "done",
        response: { status: "success" },
        linkProps: { download: "image" },
        thumbUrl: `${staticUrl}/images/message/${req.file.filename}.jpg`,
      };
      return res.json(temp);
    } catch (error) {
      next(error);
    }
  });
};

let filesUpload = multer(storageFile).single("files");

exports.addFiles = (req, res, next) => {
  filesUpload(req, res, async (err) => {
    try {
      if (!req.file) {
        console.log(err);
        throw new APIError({
          message: err,
          status: httpStatus.BAD_REQUEST,
        });
      }

      let temp = {
        uid: uuidv4(),
        name: req.file.filename,
        path: `/files/${req.file.filename}`,
        status: "done",
        response: { status: "success" },
        linkProps: { download: "file" },
      };
      return res.json(temp);
    } catch (error) {
      next(error);
    }
  });
};

exports.imagesList = async (req, res, next) => {
  try {
    let { id, offset, limit } = req.query;
    let isUser = await User.findOne({ where: { id } });
    let conversationId = null;
    if (isUser) {
      conversationId = [id, req.user._id].sort().join(".");
    } else {
      let isGroupChat = await ChatGroup.findOne({ where: { id } });
      if (isGroupChat) {
        conversationId = id;
      }
    }

    if (!conversationId) {
      throw new APIError({
        message: "Not found.",
        status: httpStatus.NOT_FOUND,
      });
    }

    let images = await Message.imagesList({ conversationId, limit, offset });
    images = images[0] ? images[0].list : [];
    return res.json({ images });
  } catch (error) {
    next(error);
  }
};

exports.filesList = async (req, res, next) => {
  try {
    let { id, offset, limit } = req.query;
    let isUser = await User.findOne({ where: { id } });
    let conversationId = null;
    if (isUser) {
      conversationId = [id, req.user._id].sort().join(".");
    } else {
      let isGroupChat = await ChatGroup.findOne({ where: { id } });
      if (isGroupChat) {
        conversationId = id;
      }
    }

    if (!conversationId) {
      throw new APIError({
        message: "Not found.",
        status: httpStatus.NOT_FOUND,
      });
    }

    let files = await Message.filesList({ conversationId, limit, offset });
    files = files[0] ? files[0].list : [];
    return res.json({ files });
  } catch (error) {
    next(error);
  }
};

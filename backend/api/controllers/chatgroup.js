const httpStatus = require("http-status");
const { omit } = require("lodash");
const ChatGroup = require("../models/chatgroup");
const Message = require("../models/message");
const MembersGroup = require("../models/members_group");
const User = require("../models/user");
const APIError = require("../utils/APIError");
const storageAvatar = require("../utils/storageAvatar");
const fsExtra = require("fs-extra");
const multer = require("multer");
const _ = require("lodash");
const { avatarDirectory } = require("../../config/vars");
/**
 * Load chatgroup and append to req.
 * @public
 */

exports.load = async (req, res, next, id) => {
  try {
    const chatgroup = await ChatGroup.get(id);
    req.locals = { chatgroup: chatgroup.dataValues };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get chatgroup
 * @public
 */
exports.get = (req, res) => res.json(req.locals.chatgroup);

/**
 * Get logged in chatgroup info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.chatgroup.dataValues);

/**
 * Create new chatgroup
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    let members = [...req.body.members, req.user.id];
    if (members.length < 3) {
      throw new APIError({
        message: "Must be at least 3 people",
        status: httpStatus.BAD_REQUEST,
      });
    }

    const chatgroup = {
      name: req.body.name,
      // ...req.body,
      // members,
      // admin: req.user.id,
    };

    let groupId;
    const users = await ChatGroup.create(chatgroup).then((group) => {
      groupId = group.id;
      members.map((id) => {
        let role = "user";
        if (Number(id) === Number(req.user.id)) {
          role = "admin";
        }
        if (id && group.id) {
          MembersGroup.create({
            role: role,
            userID: id,
            groupID: group.id,
          });
        }
      });
    });

    const d = await MembersGroup.membersGroup({ groupId });

    res.status(httpStatus.CREATED);
    res.json({
      ...chatgroup,
      admin: {
        id: req.user.id,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        picture: req.user.picture,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.replace = async (req, res, next) => {
  try {
    const { chatgroup } = req.locals;
    const newChatGroup = new ChatGroup(req.body);
    const ommitRole = chatgroup.role !== "admin" ? "role" : "";
    const newChatGroupObject = omit(newChatGroup.toObject(), "_id", ommitRole);

    await chatgroup.updateOne(newChatGroupObject, {
      override: true,
      upsert: true,
    });
    const savedChatGroup = await ChatGroup.findById(chatgroup._id);

    res.json(savedChatGroup.dataValues);
  } catch (error) {
    // next(ChatGroup.checkDuplicateEmail(error));
  }
};

exports.update = async (req, res, next) => {
  try {
    let { id, name } = req.body;
    const currentUser = req.user;
    const group = await ChatGroup.findById(id);
    if (!group) {
      throw new APIError({
        message: "ChatGroup does not exist",
        status: httpStatus.BAD_REQUEST,
      });
    }
    if (group.members.includes(currentUser.id)) {
      group.name = name;
      await group.save();
      return res.status(httpStatus.OK).json(group.dataValues);
    }
    throw new APIError({
      message: "Something went wrong",
      status: httpStatus.BAD_REQUEST,
    });
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    // let currentUserId = req.user.id;
    const chatGroups = await ChatGroup.findAll();

    // get list users
    // let responseList = [];
    // chatGroups.forEach((item) => {
    //   if (item.userId.id == currentUserId) {
    //     responseList.push(item.chatGroupId.dataValues);
    //   } else if (item.chatGroupId.id == currentUserId) {
    //     responseList.push(item.userId.dataValues);
    //   }
    // });
    res.json(chatGroups);
  } catch (error) {
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    let groupId = req.query.group;
    let userId = req.query.user;
    let currentUser = req.user;
    const group = await ChatGroup.findById(groupId);

    if (!group) {
      throw new APIError({
        message: "ChatGroup does not exist",
        status: httpStatus.BAD_REQUEST,
      });
    }
    if (group.admin === currentUser.id || currentUser.id === userId) {
      group.members.remove(userId);
      await group.save();
      return res.status(httpStatus.OK).end();
    }
    throw new APIError({
      message: "Something went wrong",
      status: httpStatus.BAD_REQUEST,
    });
  } catch (error) {
    next(error);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    let { members, groupId } = req.body;
    let currentUser = req.user;
    const group = await ChatGroup.findById(groupId);
    if (!group) {
      throw new APIError({
        message: "ChatGroup does not exist",
        status: httpStatus.BAD_REQUEST,
      });
    }

    if (group.members.includes(currentUser.id)) {
      await ChatGroup.findOneAndUpdate(
        { _id: groupId },
        {
          $addToSet: { members },
        }
      );
      return res.status(httpStatus.OK).end();
    }
    throw new APIError({
      message: "Something went wrong",
      status: httpStatus.BAD_REQUEST,
    });
  } catch (error) {
    next(error);
  }
};

let avatarUploadFile = multer(storageAvatar).single("avatar");

exports.updateAvatar = (req, res, next) => {
  avatarUploadFile(req, res, async (err) => {
    try {
      if (!req.file) {
        throw new APIError({
          message: "Please select a file.",
          status: httpStatus.BAD_REQUEST,
        });
      }

      // update user
      let chatGroupUpdate = await ChatGroup.findOneAndUpdate(
        { _id: req.params.chatGroupId },
        { picture: req.file.filename }
      );
      // Delete old user picture
      if (chatGroupUpdate.picture) {
        await fsExtra.remove(`${avatarDirectory}/${chatGroupUpdate.picture}`); // return old item after updated
      }

      let result = {
        message: "success",
        picture: `${req.file.filename}`,
      };
      return res.send(result);
    } catch (error) {
      next(error);
    }
  });
};

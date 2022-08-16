const httpStatus = require("http-status");
const { omit } = require("lodash");
const User = require("../models/user");
// const Contact = require("../models/contact");
const _ = require("lodash");
const uuidv4 = require("uuid/v4");
const multer = require("multer");
const fsExtra = require("fs-extra");
const APIError = require("../utils/APIError");
const storageAvatar = require("../utils/storageAvatar");
const ICETurnServer = require("../../config/ICETurnServer");
const {
  avatarDirectory,
  avatarTypes,
  avatarLimitSize,
} = require("../../config/vars");

exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user: user.dataValues };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = (req, res) => {
  return res.json(req.locals.user);
};

exports.getCurrentUser = async (req, res) => {
  const user = await User.findOne({ where: { id: req.user.id } });
  return res.json(user.dataValues);
};

exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  // .findAll({
  //   attributes: ["id"],
  // });
  // const userArr = users.map((item) => item.dataValues.id);
  // console.log(userArr, "userArr");
  return res.json(users);
};

exports.loggedIn = (req, res) => res.json(req.user.dataValues);

exports.update = async (req, res, next) => {
  let user = await User.get(req.user.id);
  // const ommitRole = user.role !== "admin" ? "role" : "";
  // const ommitPassword = req.body.password !== "admin" ? "role" : "";

  const updatedUser = omit(req.body, ["role", "password"]);
  user = Object.assign(user.dataValues, updatedUser);

  User.update(user, {
    where: {
      id: req.user.id,
    },
  })
    .then(() => res.send({ id: Number(req.user.id), ...user }))
    .catch((e) => next(e));
};

exports.list = async (req, res, next) => {
  try {
    const userme = await User.findAll().map((el) => el.get({ plain: true }));
    // search user to add contact
    let currentUserId = req.user.id;
    let users = await User.list({ ...req.query });
    // get userids list
    let usersId = [];
    users.forEach((item) => {
      usersId.push(item.id);
    });
    // let contacts = await Contact.find({
    //   $or: [
    //     {
    //       $and: [{ userId: { $in: usersId } }, { contactId: currentUserId }],
    //     },
    //     {
    //       $and: [{ userId: currentUserId }, { contactId: { $in: usersId } }],
    //     },
    //   ],
    // });
    let responseUsers = [];
    // users = users.map((user) => user.publicInfoTransform());

    users.forEach((userItem) => {
      let tempItem = { ...userItem, type: "notContact" };
      if (userItem.id == currentUserId) {
        tempItem.type = "you";
      } else {
        // contacts.forEach((contactItem) => {
        //   if (userItem.id.toString() == contactItem.userId.toString()) {
        //     // request sent
        //     if (!!contactItem.status) {
        //       // accepted
        //       tempItem.type = "contact";
        //       return;
        //     } else {
        //       tempItem.type = "request";
        //       return;
        //     }
        //   } else if (
        //     userItem.id.toString() == contactItem.contactId.toString()
        //   ) {
        //     // request
        //     if (!!contactItem.status) {
        //       // accepted
        //       tempItem.type = "contact";
        //       return;
        //     } else {
        //       tempItem.type = "requestSent";
        //       return;
        //     }
        //   }
        // });
      }
      responseUsers.push(tempItem);
    });

    // const transformedUsers = users.map(user => user.transform());
    res.json(responseUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;
  User.destroy({
    where: {
      id: user.id,
    },
  })
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};

// let avatarUploadFile = multer({
//   storage: storageAvatar,
//   limits: { fileSize: avatarLimitSize },
// }).single("avatar");

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

      let updateUserItem = {
        picture: req.file.filename,
        updatedAt: Date.now(),
      };

      // update user

      let userUpdate = awaitUser.update(updateUserItem, {
        where: {
          id: req.user.id,
        },
      });

      // Delete old user picture
      if (userUpdate.picture) {
        await fsExtra.remove(`${avatarDirectory}/${userUpdate.picture}`); // return old item after updated
      }

      let result = {
        message: "success",
        picture: `${updateUserItem.picture}`,
      };
      return res.send(result);
    } catch (error) {
      next(error);
    }
  });
};

exports.iceServerList = async (req, res, next) => {
  ICETurnServer()
    .then((iceServer) => res.json({ ice: iceServer }))
    .catch((err) => next(err));
};

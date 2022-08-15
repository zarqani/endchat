const httpStatus = require("http-status");
const User = require("../models/user");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/vars");
const { omit } = require("lodash");
const APIError = require("../utils/APIError");

function generateTokenResponse(user) {
  const token = jwt.sign(user, jwtSecret);
  return token;
}

exports.register = async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    const userData = omit(req.body, "role");
    const newUser = await User.create(userData);
    const data = newUser.dataValues;
    const token = generateTokenResponse(data);
    res.status(httpStatus.CREATED);
    return res.json({ token, user: data });
  } else {
    throw new APIError({
      message: "User already exists",
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user } = await User.findUser(req.body);
    const data = user.dataValues;
    const token = generateTokenResponse(data);
    return res.json({ token, user: data });
  } catch (error) {
    return next(error);
  }
};

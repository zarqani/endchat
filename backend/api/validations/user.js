const { Joi } = require("express-validation");
const User = require("../models/user");

module.exports = {
  // GET /v1/users
  listUsers: {
    query: Joi.object({
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
    }),
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: Joi.object({
      email: Joi.string().email(),
      firstname: Joi.string().max(128),
      lastname: Joi.string().max(128),
    }),
  },

  // PATCH /v1/users/:userId
  // updatePassword: {
  //   body: Joi.object({
  //     oldPassword: Joi.string().min(6).max(128).required(),
  //     newPassword: Joi.string().min(6).max(128).required(),
  //   }),
  // },
};

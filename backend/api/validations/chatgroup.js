const { Joi } = require("express-validation");
const ChatGroup = require("../models/chatgroup");

module.exports = {
  // GET /v1/chatGroups
  listChatGroup: {
    query: Joi.object({
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
    }),
  },

  // POST /v1/chatGroups
  createChatGroup: {
    body: Joi.object({
      members: Joi.array().min(2).max(50).items(
        Joi.number().min(1)
        // Joi.string()
        //   .regex(/^[a-fA-F0-9]{24}$/)
        //   .required()
      ),
      name: Joi.string().min(1).max(50).required(),
    }),
  },

  // PATCH /v1/chatGroups/:chatGroupId
  updateChatGroup: {
    body: Joi.object({
      id: Joi.number().min(1),
      name: Joi.string().min(1).max(50).required(),
    }),
  },
  deleteChatGroup: {
    query: Joi.object({
      chatGroupId: Joi.number().min(1),

      // Joi.string()
      //   .regex(/^[a-fA-F0-9]{24}$/)
      //   .required(),
    }),
  },

  removeMember: {
    query: Joi.object({
      group: Joi.number().min(1),
      user: Joi.number().min(1),
    }),
  },

  addMember: {
    body: Joi.object({
      members: Joi.array().items(Joi.number().min(1)).min(1).max(50),
      groupId: Joi.number().min(1),
    }),
  },
};

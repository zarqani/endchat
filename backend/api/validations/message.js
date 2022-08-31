const { Joi } = require("express-validation");
const Message = require("../models/message");
module.exports = {
  createMessage: {
    body: Joi.object({
      // text: Joi.string(),
      receiver: Joi.number().min(1),
      // Joi.string()
      // .regex(/^[a-fA-F0-9]{24}$/)
      // .required(),
      conversationType: Joi.string()
        .valid(...Message.conversationTypes)
        .required(),
      type: Joi.string().valid(...Message.messageTypes),
      message: Joi.string(),
      // images: Joi.array().max(50),
      // files: Joi.array().max(50),
    }),
  },
  getConversation: {
    params: Joi.object({
      receiverId: Joi.number().min(1),
      // Joi.string()
      //   .regex(/^[a-fA-F0-9]{24}$/)
      //   .required(),
    }),
    query: Joi.object({
      limit: Joi.number().min(1).max(50),
    }),
  },
  getGroupMessages: {
    params: Joi.object({
      groupId: Joi.number().min(1),
    }),
  },
  imagesList: {
    query: Joi.object({
      skip: Joi.number().min(0),
      limit: Joi.number().min(1).max(50),
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }),
  },
  filesList: {
    query: Joi.object({
      skip: Joi.number().min(0),
      limit: Joi.number().min(1).max(50),
      id: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }),
  },
};

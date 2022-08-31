const { Sequelize, DataTypes, Op } = require("sequelize");
const db = require("../../config/database");

const messageTypes = ["text", "image", "file", "notification"];
const conversationTypes = ["User", "ChatGroup"];

const model = db.sequelize.define(
  "message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    sender: {
      type: DataTypes.INTEGER,
    },
    receiver: {
      type: DataTypes.INTEGER,
      // refPath: "conversationType",
    },
    conversationType: {
      type: DataTypes.STRING,
      defaultValue: "User",
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "text",
    },
    message: {
      type: DataTypes.STRING,
    },
    // images: {
    //   type: DataTypes.ARRAY(DataTypes.STRING),
    // },
    // files: [
    //   {
    //     name: String,
    //     path: String,
    //   },
    // ],
    conversationId: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
  }
);

model.messageTypes = messageTypes;
model.conversationTypes = conversationTypes;

model.get = async (id) => {
  try {
    let message;

    if (id && Number(id)) {
      message = await model.findOne({ where: { id } });
    }
    if (message) return message;

    throw new APIError({
      message: "User does not exist",
      status: httpStatus.NOT_FOUND,
    });
  } catch (error) {
    throw error;
  }
};

model.getPersonal = ({ senderId, receiverId, offset = 0, limit = 20 }) => {
  return model.findAll({
    where: {
      [Op.or]: [
        {
          [Op.and]: [{ sender: senderId }, { receiver: receiverId }],
        },
        {
          [Op.and]: [{ sender: receiverId }, { receiver: senderId }],
        },
      ],
    },
    order: [["createdAt", "DESC"]],
    limit: limit,
    offset: offset,
  });
  // .populate("sender", "id picture lastname firstname")
  // .populate("receiver", "id picture lastname firstname")
};

model.getGroup = ({ groupId, offset = 0, limit = 20 }) => {
  return model.findAll({
    where: {
      receiver: groupId,
    },
    order: [["createdAt", "DESC"]],
    limit: limit,
    offset: offset,
  });
  // .populate("sender", "id picture lastname firstname")
};

module.exports = model;

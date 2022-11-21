const { Sequelize, DataTypes } = require("sequelize");
const db = require("../../config/database");
const ChatGroup = require("../models/chatgroup");
const User = require("../models/user");
const roles = ["user", "admin"];

const model = db.sequelize.define(
  "members_group",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
    userID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    groupID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
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
    timestamps: false,
  }
);

// model.hasMany(MembersGroup, {foreignKey: 'groupID'})

model.belongsTo(ChatGroup, { foreignKey: "groupID" });
// ChatGroup.hasMany(model, { foreignKey: "groupID" });

model.belongsTo(User, { foreignKey: "userID" });
// User.hasMany(model, { foreignKey: "userID" });

model.membersGroup = ({ offset = 0, groupId, limit = 12 }) => {
  return model.findAll({
    where: {
      groupID: groupId,
    },
    include: [User],
    // include: {
    //   model: User,
    // },
    // order: [["createdAt", "DESC"]],
    // limit: limit,
    // offset: offset,
  });
};

model.roles = roles;

module.exports = model;

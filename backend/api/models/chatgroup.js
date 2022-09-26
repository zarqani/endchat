const { Sequelize, DataTypes } = require("sequelize");
const db = require("../../config/database");
const MembersGroup = require("../models/members_group");
const User = require("../models/user");

const model = db.sequelize.define(
  "chatgroup",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    messageAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    name: {
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
    timestamps: false,
  }
);

// model.hasMany(MembersGroup, { foreignKey: "groupID" });
// MembersGroup.belongsTo(model, {foreignKey: 'groupID'})

// Post.find({ where: { ...}, include: [User]})

model.get = async (id) => {
  try {
    let chatgroup;

    if (id && Number(id)) {
      chatgroup = await model.findOne({ where: { id } });
    }
    if (chatgroup) return chatgroup;

    throw new APIError({
      message: "User does not exist",
      status: httpStatus.NOT_FOUND,
    });
  } catch (error) {
    throw error;
  }
};

// async list({ skip = 0, userId, limit = 12 }) {
//   return this.find({
//     members: {
//       $in: userId,
//     },
//   })
//     .skip(+skip)
//     .limit(limit)
//     .sort({ updatedAt: -1 })
//     .exec();
// },

// MembersGroup.findOne({ where: { id: 1 } });

// MembersGroup.belongsTo(model, { foreignKey: "groupID" });
// model.hasMany(MembersGroup, { foreignKey: "groupID" });

model.members = ({ offset = 0, groupId, limit = 12 }) => {
  return MembersGroup.findAll({
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

User.belongsToMany(model, { through: "MembersGroup" });

module.exports = model;

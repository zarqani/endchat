const { Sequelize, DataTypes } = require("sequelize");
const db = require("../../config/database");
const bcrypt = require("bcrypt");
const httpStatus = require("http-status");
const APIError = require("../utils/APIError");

/**
 * User Roles
 */
const roles = ["user", "admin"];

const model = db.sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    picture: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
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

model.roles = roles;

model.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.dataValues.password, 10);
  user.dataValues.password = hashedPassword;
});

model.beforeUpdate(async (user) => {
  if (user.dataValues.password) {
    const hashedPassword = await bcrypt.hash(user.dataValues.password, 10);
    user.dataValues.password = hashedPassword;
  }
});

model.get = async (id) => {
  try {
    let user;

    if (id && Number(id)) {
      user = await model.findOne({ where: { id } });
    }
    if (user) return user;

    throw new APIError({
      message: "User does not exist",
      status: httpStatus.NOT_FOUND,
    });
  } catch (error) {
    throw error;
  }
};

model.findUser = async (options) => {
  const { email, password } = options;
  if (!email)
    throw new APIError({
      message: "An email is required to generate a token",
    });

  const user = await model.findOne({ where: { email } });
  const err = {
    status: httpStatus.BAD_REQUEST,
    isPublic: true,
  };
  if (password) {
    if (user && bcrypt.compareSync(password, user.password)) {
      return { user };
    }
    err.message = "Incorrect email or password";
  }

  throw new APIError(err);
};

module.exports = model;

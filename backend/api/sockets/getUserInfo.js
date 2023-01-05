const User = require("../models/user");

const getUserInfo = async (id) => {
  try {
    const user = await User.findOne({ where: { id: id } });

    if (user) return user.dataValues;
    return null;
  } catch (error) {
    throw error;
  }
};

module.exports = getUserInfo;

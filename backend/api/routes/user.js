const express = require("express");
const { validate } = require("express-validation");
const controller = require("../controllers/user");
const { authorize, LOGGED_USER } = require("../middlewares/auth");
const {
  listUsers,
  updateUser,
  updatePassword,
} = require("../validations/user");

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param("userId", controller.load);

router.route("/iceserver").get(controller.iceServerList);
router.route("/avatar").post(authorize(LOGGED_USER), controller.updateAvatar);

router.route("/current").get(authorize(LOGGED_USER), controller.getCurrentUser);

router
  .route("/all")
  .get(authorize(LOGGED_USER), validate(listUsers), controller.getUsers);
router
  .route("/")
  .get(validate(listUsers), controller.list)
  .patch(authorize(LOGGED_USER), validate(updateUser), controller.update);

router.route("/profile").get(authorize(), controller.loggedIn);

router
  .route("/:userId")
  .get(authorize(LOGGED_USER), controller.get)
  .delete(authorize(LOGGED_USER), controller.remove);

module.exports = router;

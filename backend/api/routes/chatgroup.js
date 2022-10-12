const express = require("express");
const { validate } = require("express-validation");
const controller = require("../controllers/chatgroup");
const { authorize, ADMIN, LOGGED_USER } = require("../middlewares/auth");
const {
  createChatGroup,
  deleteChatGroup,
  updateChatGroup,
  listChatGroup,
  removeMember,
  addMember,
} = require("../validations/chatgroup");
const router = express.Router();
/** * Load chatgroup when API with chatGroupId route parameter is hit */
router.param("chatGroupId", controller.load);

router
  .route("/avatar/:chatGroupId")
  .post(authorize(LOGGED_USER), controller.updateAvatar);

router
  .route("/")
  .get(authorize(LOGGED_USER), validate(listChatGroup), controller.list)
  .post(authorize(LOGGED_USER), validate(createChatGroup), controller.create)
  // .delete(authorize(LOGGED_USER), validate(deleteChatGroup), controller.remove)
  .patch(authorize(LOGGED_USER), validate(updateChatGroup), controller.update);

router.route("/:chatGroupId").get(authorize(LOGGED_USER), controller.get);

router
  .route("/member")
  .patch(authorize(LOGGED_USER), validate(addMember), controller.addMember)
  .delete(
    authorize(LOGGED_USER),
    validate(removeMember),
    controller.removeMember
  );

module.exports = router;

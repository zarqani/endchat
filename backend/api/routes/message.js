const express = require("express");
const { validate } = require("express-validation");
const controller = require("../controllers/message");
const { authorize, ADMIN, LOGGED_USER } = require("../middlewares/auth");
const {
  imagesList,
  filesList,
  getConversation,
  getGroupMessages,
  createMessage,
} = require("../validations/message");

const router = express.Router();

/**
 * Load contact when API with contactId route parameter is hit
 */
router.param("contactId", controller.load);

router
  .route("/images")
  .get(authorize(LOGGED_USER), validate(imagesList), controller.imagesList);

router
  .route("/files")
  .get(authorize(LOGGED_USER), validate(filesList), controller.filesList);

router
  .route("/")
  .get(authorize(LOGGED_USER), /*validate(list),*/ controller.list)
  .post(authorize(LOGGED_USER), validate(createMessage), controller.create);

router.route("/photos").post(authorize(LOGGED_USER), controller.addPhotos);
router.route("/files").post(authorize(LOGGED_USER), controller.addFiles);

router
  .route("/:receiverId")
  .get(authorize(LOGGED_USER), validate(getConversation), controller.get);

router
  .route("/group/:groupId")
  .get(
    authorize(LOGGED_USER),
    validate(getGroupMessages),
    controller.groupMessages
  );

module.exports = router;

const express = require("express");
const userRoutes = require("./user");
const authRoutes = require("./auth");
// const contactRoutes = require("./contact");
const messageRoutes = require("./message");
const chatGroupRoutes = require("./chatGroup");

const router = express.Router();

router.get("/", (req, res) => res.send("OK"));
router.use("/user", userRoutes);
router.use("/auth", authRoutes);
// router.use("/contact", contactRoutes);
router.use("/message", messageRoutes);
router.use("/chatgroup", chatGroupRoutes);

module.exports = router;

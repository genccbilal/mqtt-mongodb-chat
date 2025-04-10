const express = require("express");
const router = express.Router();
const {
  saveMessage,
  getMessageHistory,
} = require("../controllers/messageController");

router.post("/", saveMessage);
router.get("/:userId/:partnerId", getMessageHistory);

module.exports = router;

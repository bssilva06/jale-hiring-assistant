const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getChatHistory,
} = require("../controllers/chatController");

// POST /api/chat - Send a message and get AI response
router.post("/", sendMessage);

// GET /api/chat/:job_id/:candidate_id - Get chat history
router.get("/:job_id/:candidate_id", getChatHistory);

module.exports = router;

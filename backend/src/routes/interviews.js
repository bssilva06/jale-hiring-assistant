const express = require("express");
const router = express.Router();
const {
  scheduleInterview,
  getAllInterviews,
  getInterviewById,
  getCandidateInterviews,
  updateInterview,
  cancelInterview,
} = require("../controllers/interviewController");

// POST /api/interviews - Schedule a new interview
router.post("/", scheduleInterview);

// GET /api/interviews - Get all interviews
router.get("/", getAllInterviews);

// GET /api/interviews/:id - Get a specific interview
router.get("/:id", getInterviewById);

// GET /api/interviews/candidate/:candidate_id - Get all interviews for a candidate
router.get("/candidate/:candidate_id", getCandidateInterviews);

// PUT /api/interviews/:id - Update an interview
router.put("/:id", updateInterview);

// POST /api/interviews/:id/cancel - Cancel an interview
router.post("/:id/cancel", cancelInterview);

module.exports = router;

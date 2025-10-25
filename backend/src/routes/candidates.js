const express = require("express");
const router = express.Router();
const {
  createCandidateApplication,
  getAllCandidates,
  getCandidateById,
  getCandidateMatch,
} = require("../controllers/candidateController");

// POST /api/candidates - Create a new candidate application
router.post("/", createCandidateApplication);

// GET /api/candidates - Get all candidates
router.get("/", getAllCandidates);

// GET /api/candidates/:id - Get a specific candidate
router.get("/:id", getCandidateById);

// GET /api/candidates/:candidate_id/match/:job_id - Get match score for candidate and job
router.get("/:candidate_id/match/:job_id", getCandidateMatch);

module.exports = router;

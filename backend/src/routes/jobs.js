const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobApplications,
} = require("../controllers/jobController");

// POST /api/jobs - Create a new job posting
router.post("/", createJob);

// GET /api/jobs - Get all jobs
router.get("/", getAllJobs);

// GET /api/jobs/:id - Get a specific job
router.get("/:id", getJobById);

// PUT /api/jobs/:id - Update a job
router.put("/:id", updateJob);

// DELETE /api/jobs/:id - Delete (close) a job
router.delete("/:id", deleteJob);

// GET /api/jobs/:id/applications - Get all applications for a job
router.get("/:id/applications", getJobApplications);

module.exports = router;

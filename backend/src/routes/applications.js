const express = require("express");
const router = express.Router();
const {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/applicationController");

// GET /api/applications - Get all applications (optionally filtered by job_id)
router.get("/", getAllApplications);

// GET /api/applications/:id - Get a specific application
router.get("/:id", getApplicationById);

// PATCH /api/applications/:id/status - Update application status
router.patch("/:id/status", updateApplicationStatus);

// DELETE /api/applications/:id - Delete an application
router.delete("/:id", deleteApplication);

module.exports = router;

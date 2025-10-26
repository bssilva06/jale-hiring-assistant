const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createCandidateApplication,
  getAllCandidates,
  getCandidateById,
  getCandidateMatch,
  parseResumeText,
  parseResumeFile,
} = require("../controllers/candidateController");

// Configure multer for file uploads (in-memory storage)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
});

// POST /api/candidates/parse-resume-file - Parse resume file with AI
router.post("/parse-resume-file", upload.single('resume'), parseResumeFile);

// POST /api/candidates/parse-resume - Parse resume text with AI
router.post("/parse-resume", parseResumeText);

// POST /api/candidates - Create a new candidate application
router.post("/", createCandidateApplication);

// GET /api/candidates - Get all candidates
router.get("/", getAllCandidates);

// GET /api/candidates/:id - Get a specific candidate
router.get("/:id", getCandidateById);

// GET /api/candidates/:candidate_id/match/:job_id - Get match score for candidate and job
router.get("/:candidate_id/match/:job_id", getCandidateMatch);

module.exports = router;

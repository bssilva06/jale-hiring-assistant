require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const {
  initializeInterviewReminderCron,
} = require("./services/schedulingService");

const { sendInterviewNotification } = require("./services/notificationService");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Jale Backend Running" });
});

// Test email endpoint
app.post("/api/test-email", async (req, res) => {
  try {
    const { email } = req.body;
    
    const result = await sendInterviewNotification(
      email || "test@example.com",
      "Test User",
      "Test Job Position",
      {
        scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        meeting_link: "https://meet.jit.si/test-room-123",
        interview_type: "video",
      }
    );

    res.json({ 
      success: result.success,
      message: result.success ? "Email sent successfully!" : "Email configuration not set",
      details: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Routes
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/candidates", require("./routes/candidates"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/interviews", require("./routes/interviews"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/translate", require("./routes/translate"));

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`💼 Jobs API: http://localhost:${PORT}/api/jobs`);
  console.log(`👤 Candidates API: http://localhost:${PORT}/api/candidates`);
  console.log(`📝 Applications API: http://localhost:${PORT}/api/applications`);
  console.log(`📅 Interviews API: http://localhost:${PORT}/api/interviews`);
  console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`🌐 Translate API: http://localhost:${PORT}/api/translate`);

  // Initialize scheduled tasks
  initializeInterviewReminderCron();
});

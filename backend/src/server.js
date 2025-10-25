require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const {
  initializeInterviewReminderCron,
} = require("./services/schedulingService");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Jale Backend Running" });
});

// API Routes
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/candidates", require("./routes/candidates"));
app.use("/api/interviews", require("./routes/interviews"));
app.use("/api/chat", require("./routes/chat"));

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`💼 Jobs API: http://localhost:${PORT}/api/jobs`);
  console.log(`👤 Candidates API: http://localhost:${PORT}/api/candidates`);
  console.log(`📅 Interviews API: http://localhost:${PORT}/api/interviews`);
  console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);

  // Initialize scheduled tasks
  initializeInterviewReminderCron();
});

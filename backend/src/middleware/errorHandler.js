// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Supabase errors
  if (err.code) {
    switch (err.code) {
      case "23505": // Unique violation
        return res.status(409).json({
          error: "Duplicate entry",
          message: err.message,
        });
      case "23503": // Foreign key violation
        return res.status(400).json({
          error: "Invalid reference",
          message: err.message,
        });
      case "PGRST116": // Not found
        return res.status(404).json({
          error: "Resource not found",
          message: err.message,
        });
      default:
        return res.status(500).json({
          error: "Database error",
          message: err.message,
        });
    }
  }

  // Anthropic API errors
  if (err.type === "api_error" || err.type === "invalid_request_error") {
    return res.status(503).json({
      error: "AI service unavailable",
      message: "Unable to process AI request. Please try again later.",
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 404 handler
const notFound = (req, res, next) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.originalUrl} not found`,
  });
};

module.exports = {
  errorHandler,
  notFound,
};

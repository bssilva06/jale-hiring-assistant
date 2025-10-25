/**
 * Authentication middleware (placeholder for future implementation)
 *
 * TODO: Implement JWT or session-based authentication
 *
 * Example JWT implementation:
 * 1. npm install jsonwebtoken
 * 2. Generate token on login/signup
 * 3. Verify token in this middleware
 * 4. Add to protected routes
 */

const jwt = require("jsonwebtoken");

/**
 * Verify JWT token middleware
 * Usage: Add to routes that require authentication
 * Example: router.get('/protected', authenticate, controller)
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // TODO: Set JWT_SECRET in environment variables
    if (!process.env.JWT_SECRET) {
      console.warn("⚠️  JWT_SECRET not set. Authentication disabled.");
      return next(); // Skip authentication in development
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    return res.status(500).json({ error: "Authentication error" });
  }
};

/**
 * Check if user is an admin/hiring manager
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== "admin" && req.user.role !== "hiring_manager") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};

/**
 * Optional authentication - doesn't block if no token
 * Useful for routes that work both authenticated and unauthenticated
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      if (process.env.JWT_SECRET) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
      }
    }
  } catch (error) {
    // Silently fail - optional auth doesn't block request
    console.log("Optional auth failed:", error.message);
  }

  next();
};

/**
 * Generate JWT token
 * Call this after successful login/signup
 */
const generateToken = (userId, email, role = "candidate") => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not configured");
  }

  return jwt.sign(
    {
      id: userId,
      email,
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Token expires in 7 days
  );
};

module.exports = {
  authenticate,
  requireAdmin,
  optionalAuth,
  generateToken,
};

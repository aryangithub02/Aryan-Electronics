/**
 * 404 Not Found Middleware for API routes
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Endpoint not found: [${req.method}] ${req.originalUrl}`,
      status: 404
    }
  });
};

module.exports = notFoundHandler;

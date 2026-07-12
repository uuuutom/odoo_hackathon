const errorHandler = (err, req, res, next) => {
  // If the status code is still 200 but an error was thrown, default to 500 (Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);

  // Send a structured error response back to your React frontend
  res.json({
    message: err.message,
    // Only show the detailed stack trace if you are developing locally, not in production
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;

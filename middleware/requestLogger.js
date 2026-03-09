/**
 * Request logging middleware
 * Logs incoming requests for debugging and monitoring
 */

const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const { method, originalUrl, ip } = req;

  // Capture the response status when res.end is called
  const originalEnd = res.end;
  
  res.end = function (...args) {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    // Color codes for console output
    const statusColor = statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for errors, Green for success
    const reset = '\x1b[0m';

    console.log(
      `${statusColor}[${new Date().toISOString()}]${reset} ${method} ${originalUrl} - Status: ${statusColor}${statusCode}${reset} (${duration}ms) - IP: ${ip}`
    );

    originalEnd.apply(res, args);
  };

  next();
};

module.exports = requestLogger;

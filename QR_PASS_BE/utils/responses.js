function errorResponse(res, status, message, details = null) {
  return res.status(status).json({
    success: false,
    error: message,
    ...(details && { details })
  });
}

module.exports = { errorResponse };
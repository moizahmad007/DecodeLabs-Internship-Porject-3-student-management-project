export function notFound(req, res, _next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "field";
    return res.status(409).json({ message: `A student with this ${field} already exists` });
  }
  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).map(item => item.message);
    return res.status(400).json({ message: "Validation failed", details });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid value supplied" });
  }
  res.status(500).json({
    message: process.env.NODE_ENV === "production" ? "Internal server error" : error.message
  });
}

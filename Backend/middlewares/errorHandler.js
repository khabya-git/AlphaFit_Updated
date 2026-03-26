module.exports = (err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);            //updated on 9/3/26 err->err.stack

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
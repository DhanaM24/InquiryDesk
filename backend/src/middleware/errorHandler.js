module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    error: status === 500 ? 'Something went wrong' : err.message,
    ...(err.details && { details: err.details }),
  });
};

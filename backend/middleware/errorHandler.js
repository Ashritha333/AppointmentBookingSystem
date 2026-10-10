// Express needs all four arguments to treat this as an error handler.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}

module.exports = errorHandler;

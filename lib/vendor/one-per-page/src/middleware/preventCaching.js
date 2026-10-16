const preventCaching = (req, res, next) => {
  // Prevents caching of responses, to ensure a revalidate of the users answers
  res.set('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
};

module.exports = preventCaching;

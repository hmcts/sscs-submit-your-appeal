const createSession = (req, res, next) => {
  req.session.generate();
  next();
};

module.exports = createSession;

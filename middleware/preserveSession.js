// preserve session to render done page
const preserveSession = (req, res, next) => {
  req.sess = req.session;
  next();
};

module.exports = preserveSession;
const defaultNoSessionHandler = (req, res) => {
  res.redirect('/');
};

const requireSession = (req, res, next) => {
  if (req.session.active()) {
    next();
  } else if (req.journey && req.journey.noSessionHandler) {
    req.journey.noSessionHandler(req, res, next);
  } else {
    defaultNoSessionHandler(req, res, next);
  }
};

module.exports = requireSession;

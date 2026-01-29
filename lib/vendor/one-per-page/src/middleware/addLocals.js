const addLocals = (req, res, next) => {
  res.locals = res.locals || {};
  res.locals.url = req.currentStep.url;
  res.locals.content = req.currentStep.content;

  next();
};

module.exports = addLocals;

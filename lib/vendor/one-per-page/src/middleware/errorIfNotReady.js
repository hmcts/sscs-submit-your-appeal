const errorIfNotReady = step => (req, res, next) => {
  step.ready().then(
    () => next(),
    error => next(`${step.name} not ready because ${error}`)
  );
};

module.exports = errorIfNotReady;

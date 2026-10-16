const loadStepContent = require('../i18n/loadStepContent');
const { i18NextInstance } = require('../i18n/i18Next');

const loadContent = step =>
  (req, res, next) => {
    loadStepContent
      .loadStepContent(step, i18NextInstance)
      .then(() => {
        next();
      })
      .catch(error => {
        next(`Unable to load content ${error}`);
      });
  };

module.exports = loadContent;

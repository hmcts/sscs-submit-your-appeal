'use strict';

const FeatureToggle = require('core/utils/featureToggle');

const checkWelshToggle = (req, res, next) => {
  if (!res.locals.featureToggle) {
    res.locals.featureToggle = new FeatureToggle();
  }
  res.locals.launchDarkly = {};

  return res.locals.featureToggle.callCheckToggle(req, res, next, res.locals.launchDarkly, 'ft_welsh', res.locals.featureToggle.toggleFeature);
};

module.exports = checkWelshToggle;

'use strict';

const logger = require('logger');
const LaunchDarkly = require('core/components/launch-darkly');
const config = require('config');

class FeatureToggle {
  constructor() {
    this.launchDarkly = new LaunchDarkly().getInstance();
  }

  callCheckToggle(ftKey) {
    const featureToggleKey = config.featureToggles[ftKey];
    const ldUser = config.featureToggles.launchDarklyUser;

    try {
      return this.launchDarkly.variation(featureToggleKey, ldUser, false, (error, showFeature) => {
        if (error) {
          return false;
        }

        logger.trace(`Checking feature toggle: ${ftKey}, isEnabled: ${showFeature}`);
        return showFeature;
      });
    } catch (error) {
      return false;
    }
  }
}

module.exports = FeatureToggle;

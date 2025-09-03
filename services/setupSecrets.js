const config = require('@hmcts/properties-volume').addTo(require('config'));
const { get, set } = require('lodash');

const setSecret = (secretPath, configPath) => {
  // Only overwrite the value if the secretPath is defined
  if (config.has(secretPath)) {
    set(config, configPath, get(config, secretPath));
  }
};

const setupSecrets = () => {
  if (config.has('secrets.sscs')) {
    setSecret('secrets.sscs.sscs-redis-connection-string', 'redis.url');
    setSecret('secrets.sscs.sscs-redis-access-key', 'redis.secret');
    setSecret('secrets.sscs.idam-sscs-oauth2-client-secret', 'services.idam.secret');
    setSecret('secrets.sscs.postcode-lookup-token', 'postcodeLookup.token');
    setSecret('secrets.sscs.app-insights-connection-string', 'appInsights.connectionString');
    setSecret('secrets.sscs.pcq-token-key', 'services.pcq.tokenKey');
    setSecret('secrets.sscs.webchat-kerv-deployment-en', 'services.kerv.deploymentId.en');
    setSecret('secrets.sscs.webchat-kerv-deployment-cy', 'services.kerv.deploymentId.cy');
    setSecret('secrets.sscs.webchat-kerv-genesys-base-url', 'services.kerv.genesysBaseUrl');
    setSecret('secrets.sscs.webchat-kerv-environment', 'services.kerv.environment');
    setSecret('secrets.sscs.webchat-kerv-kerv-base-url', 'services.kerv.kervBaseUrl');
    setSecret('secrets.sscs.webchat-kerv-api-key', 'services.kerv.apiKey');
  }
};

module.exports = setupSecrets;

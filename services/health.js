const healthCheck = require('@hmcts/nodejs-healthcheck');

const health = { checks: {} };

module.exports = healthCheck.configure(health);

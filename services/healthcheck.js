const healthcheck = require('@hmcts/nodejs-healthcheck');
const os = require('os');
const redis = require('redis');

const config = require('config');

const outputs = require('@hmcts/nodejs-healthcheck/healthcheck/outputs');

const { OK } = require('http-status-codes');
const logger = require('logger');

const rClient = redis.createClient({
  url: config.redis.url,
  socket: {
    tls: new URL(config.redis.url).protocol === 'rediss:'
  }
});

rClient.on('error', error => {
  console.error(error);
});

const redisReady = rClient.connect();

// prettier-ignore
const healthOptions = message => {
  return {
    callback: (error, res) => { // eslint-disable-line id-blacklist
      if (error) {
        logger.trace(`health_check_error: ${message} and error: ${error}`);
      }
      return !error && res.status === OK ? outputs.up() : outputs.down(error);
    },
    timeout: config.health.timeout,
    deadline: config.health.deadline
  };
};

const setup = app => {
  healthcheck.addTo(app, {
    checks: {
      'submit-your-appeal-api': healthcheck.web(
        `${config.api.url}/health`,
        healthOptions('Health check failed on submit-your-appeal-api:')
      )
    },
    readinessChecks: {
      redis: healthcheck.raw(async() => {
        try {
          await redisReady;
          await rClient.ping();
          return healthcheck.up();
        } catch (error) {
          return healthcheck.down(error);
        }
      }),
      'submit-your-appeal-api': healthcheck.web(
        `${config.api.url}/health/readiness`,
        healthOptions('Readiness check failed on submit-your-appeal-api:')
      )
    },
    buildInfo: {
      name: 'Submit Your Appeal',
      host: os.hostname(),
      uptime: process.uptime()
    }
  });
};

module.exports = { setup };
const healthcheck = require('@hmcts/nodejs-healthcheck');
const os = require('os');
const ioRedis = require('ioredis');
const config = require('config');

const outputs = require('@hmcts/nodejs-healthcheck/healthcheck/outputs');

const { OK } = require('http-status-codes');
const logger = require('logger');


const client = ioRedis.createClient(
  config.redis.url,
  { enableOfflineQueue: false }
);

client.on('error', error => {
  logger.trace(`Health check failed on redis: ${error}`, 'health_check_error');
});

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
      redis: healthcheck.raw(() => client.ping().then(_ => healthcheck.status(_ === 'PONG'))
        .catch(error => {
          logger.trace(`Health check failed on redis: ${error}`, 'health_check_error');
          return outputs.down(error);
        })),
      'submit-your-appeal-api': healthcheck.web(`${config.api.url}/health`,
        healthOptions('Health check failed on submit-your-appeal-api:')
      ),
      'Ordinance survey': healthcheck.raw(() => healthcheck.web(`${config.postcodeLookup.url}/health`).call()
        .then(_ => healthcheck.status((_ === OK) ? outputs.up() : outputs.up('status: DOWN')))
        .catch(error => {
          logger.trace(`Health check failed on Ordinance survey: ${error}`, 'health_check_error');
          return outputs.up(error);
        }))
    },
    readinessChecks: {
      redis: healthcheck.raw(() => client.ping().then(_ => healthcheck.status(_ === 'PONG'))
        .catch(error => {
          logger.trace(`Readiness check failed on redis: ${error}`, 'Readiness_check_error');
          return outputs.down(error);
        })),
      'submit-your-appeal-api': healthcheck.web(`${config.api.url}/health/readiness`,
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

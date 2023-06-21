const healthcheck = require('@hmcts/nodejs-healthcheck');
const os = require('os');
const ioRedis = require('redis');
const config = require('config');

const outputs = require('@hmcts/nodejs-healthcheck/healthcheck/outputs');

const { OK } = require('http-status-codes');
const logger = require('logger');


const ioRedisClient = ioRedis.createClient(
  {
    url: config.redis.url,
    socket: {
      tls: true
    }
  }
  // { enableOfflineQueue: false }
);
ioRedisClient.connect();

ioRedisClient.on('connect', () => {
  logger.trace('Redis is connected : ', 'health_check_error');
});

ioRedisClient.on('ready', () => {
  logger.trace('Redis is ready:', 'health_check_error');
});

ioRedisClient.on('reconnecting', () => {
  logger.trace('Redis is reconnecting: ', 'health_check_error');
});

ioRedisClient.on('error', error => {
  logger.trace(`Health check failed on redis: ${error}`, 'health_check_error');
});

ioRedisClient.on('end', () => {
  logger.trace('Redis connection is ended :', 'health_check_error');
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
      redis: healthcheck.raw(() => ioRedisClient.ping().then(_ => healthcheck.status(_ === 'PONG'))
        .catch(error => {
          logger.trace(`Health check failed on redis: ${error}`, 'health_check_error');
          return outputs.down(error);
        })),
      'submit-your-appeal-api': healthcheck.web(`${config.api.url}/health`,
        healthOptions('Health check failed on submit-your-appeal-api:')
      )
    },
    readinessChecks: {
      redis: healthcheck.raw(() => ioRedisClient.ping().then(_ => healthcheck.status(_ === 'PONG'))
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

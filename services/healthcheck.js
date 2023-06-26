const healthcheck = require('@hmcts/nodejs-healthcheck');
const os = require('os');
// const ioRedis = require('ioredis');
// if using node-redis package
const { createClient } = require('redis');

const config = require('config');

const outputs = require('@hmcts/nodejs-healthcheck/healthcheck/outputs');

const { OK } = require('http-status-codes');
const logger = require('logger');

const redis = createClient({
  url: config.redis.url,
  socket: {
    tls: true,
    servername: 'sscs-redis-demo'
  }
});


(async() => {
  await redis.connect(); // if using node-redis client.

  const pingCommandResult = await redis.ping();
  console.log('Ping command result: ', pingCommandResult);

  const getCountResult = await redis.get('count');
  console.log('Get count result: ', getCountResult);

  const incrCountResult = await redis.incr('count');
  console.log('Increase count result: ', incrCountResult);

  const newGetCountResult = await redis.get('count');
  console.log('New get count result: ', newGetCountResult);

  await redis.set(
    'object',
    JSON.stringify({
      name: 'Redis',
      lastname: 'Client'
    })
  );

  const getStringResult = await redis.get('object');
  console.log('Get string result: ', JSON.parse(getStringResult));
})();

// const ioRedisClient = ioRedis.createClient(
//   config.redis.url,
//   { enableOfflineQueue: false }
// );

// ioRedisClient.on('connect', () => {
//   logger.trace('Redis is connected :', 'health_check_error');
// });
//
// ioRedisClient.on('ready', () => {
//   logger.trace('Redis is ready:', 'health_check_error');
// });
//
// ioRedisClient.on('reconnecting', () => {
//   logger.trace('Redis is reconnecting: ', 'health_check_error');
// });
//
// ioRedisClient.on('error', error => {
//   logger.trace(`Health check failed on redis: ${error}`, 'health_check_error');
// });
//
// ioRedisClient.on('end', () => {
//   logger.trace('Redis connection is ended :', 'health_check_error');
// });

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
      // redis: healthcheck.raw(() => ioRedisClient.ping().then(_ => healthcheck.status(_ === 'PONG'))
      //   .catch(error => {
      //     logger.trace(`Health check failed on redis: ${error}`, 'health_check_error');
      //     return outputs.down(error);
      //   })),
      'submit-your-appeal-api': healthcheck.web(`${config.api.url}/health`,
        healthOptions('Health check failed on submit-your-appeal-api:')
      )
    },
    readinessChecks: {
      // redis: healthcheck.raw(() => ioRedisClient.ping().then(_ => healthcheck.status(_ === 'PONG'))
      //   .catch(error => {
      //     logger.trace(`Readiness check failed on redis: ${error}`, 'Readiness_check_error');
      //     return outputs.down(error);
      //   })),
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

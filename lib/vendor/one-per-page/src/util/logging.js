const colors = require('colors/safe');
const debug = require('debug');
const option = require('option');

// eslint-disable-next-line no-console
const log = (prefix, ...args) => console.log(prefix, ':', ...args);
const app = 'one-per-page';

const getLoggingLib = () => {
  try {
    // eslint-disable-next-line global-require
    const { Logger } = require('@hmcts/nodejs-logging');

    debug(`${app}.logging`)('Using @hmcts/nodejs-logging for logging');
    return option.some(Logger);
  } catch (moduleMissing) {
    debug(`${app}.logging`)('@hmcts/nodejs-loging not found');
    debug(`${app}.logging`)('Using console.log for logging');
    return option.none;
  }
};
const maybeLoggingLib = getLoggingLib();
const toSecs = ([secs, nanos]) => {
  const nanosPerS = 10000000;
  return secs + (nanos / nanosPerS);
};

module.exports = prefix => {
  const scope = `${app}.${prefix}`;
  if (maybeLoggingLib.isSome()) {
    const logger = maybeLoggingLib.value().getLogger(scope);
    return {
      info(...args) {
        return logger.info(...args);
      },
      warn(...args) {
        return logger.warn(...args);
      },
      error(...args) {
        return logger.error(...args);
      },
      debug: debug(scope),
      time(message, block) {
        const start = process.hrtime();
        const result = block();
        const elapsed = process.hrtime(start);
        logger.info(`${message} in ${toSecs(elapsed)}s`);
        return result;
      }
    };
  }
  return {
    info(...args) {
      return log(colors.green(scope), ...args);
    },
    warn(...args) {
      return log(colors.yellow(scope), ...args);
    },
    error(...args) {
      return log(colors.red(scope), ...args);
    },
    debug: debug(scope),
    time(message, block) {
      const start = process.hrtime();
      const result = block();
      const elapsed = process.hrtime(start);
      log(colors.green(scope), `${message} in ${toSecs(elapsed)}s`);
      return result;
    }
  };
};

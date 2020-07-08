/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */

const applicationInsights = require('applicationinsights');
const config = require('config');
const chalk = require('chalk');

let iKey = config.get('appInsights.instrumentationKey');

module.exports = class Logger {
  static setIkey(iKeyVal) {
    iKey = iKeyVal;
  }

  static startAppInsights() {
    if (iKey !== '') {
      applicationInsights.setup(iKey)
        .setAutoCollectConsole(true, true)
        .setDistributedTracingMode(applicationInsights.DistributedTracingModes.AI_AND_W3C)
        .setSendLiveMetrics(true);
      const client = applicationInsights.defaultClient;
      client.context.tags[client.context.keys.cloudRole] = config.appInsights.roleName;
      applicationInsights.start();
    }
  }

  static exception(error, label, postToAppInsights = true) {
    try {
      let errorObj = null;
      if (error instanceof Error) {
        errorObj = error;
      } else {
        const msg = this.msgBuilder(error, label);
        errorObj = new Error(msg);
      }
      // Pass it to appinsights
      if (iKey !== '' && postToAppInsights) {
        applicationInsights.defaultClient.trackException({ exception: errorObj });
      }
      // Write Error to Console
      this.console(errorObj, 3);
    } catch (catchError) {
      console.log('Exception Catch Error', catchError);
    }
  }

  static trace(messageInfo, label, severity = 1, properties = {}, postToAppInsights = true) {
    try {
      const msg = this.msgBuilder(messageInfo, label);
      // Pass it to appinsights
      if (iKey !== '' && postToAppInsights) {
        applicationInsights.defaultClient.trackTrace({
          message: msg,
          severity,
          properties
        });
      }
      if (this.isObject(properties) && Object.keys(properties) > 0) {
        this.console(msg, severity, properties);
      } else {
        this.console(msg, severity);
      }
    } catch (catchError) {
      console.log('Trace Catch Error', catchError);
    }
  }

  static event(eventName, postToAppInsights = true) {
    try {
      if (iKey !== '' && postToAppInsights) {
        applicationInsights.defaultClient.trackEvent({ name: eventName });
      }
    } catch (cactchError) {
      console.log('Event Catch Error', cactchError);
    }
  }

  static msgBuilder(messageInfo, label) {
    let msg = '';
    let msgText = '';

    if (Array.isArray(messageInfo)) {
      msgText = messageInfo.join(' ');
    } else {
      msgText = messageInfo;
    }

    if (label) {
      msg = `[${label}] - ${msgText}`;
    } else {
      msg = msgText;
    }
    return msg;
  }

  static console(msg, severity, properties = '') {
    // Verbose = 0,
    // Information = 1,
    // Warning = 2,
    // Error = 3,
    // Critical = 4,

    // Write to Console
    switch (severity) {
    case 0:
      console.log(chalk.white(msg), properties);
      break;
    case 1:
      console.log(chalk.green(msg), properties);
      break;
    case 2:
      console.log(chalk.yellow(msg), properties);
      break;
    case 3:
      console.log(chalk.red(msg), properties);
      break;
    case 4:
      console.log(chalk.bgRed(msg), properties);
      break;
    default:
      console.log(msg, properties);
      break;
    }
  }

  static isObject(value) {
    return value !== null && value && typeof value === 'object' && value.constructor === Object;
  }
};

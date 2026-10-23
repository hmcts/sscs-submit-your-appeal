/* eslint-disable no-magic-numbers */

const config = require('config');
const chalk = require('chalk');

if (config.has('appInsights.roleName')) {
  process.env.APPLICATIONINSIGHTS_ROLE_NAME = config.get('appInsights.roleName');
}
const applicationInsights = require('applicationinsights');

let connectionString = config.get('appInsights.connectionString');

module.exports = class Logger {
  static monitoringMiddleware(appInsightsConfig = {}) {
    const { serviceName, connectionString: connStr, enabled = true } = appInsightsConfig;
    const activeConnStr = connStr || connectionString;
    connectionString = activeConnStr;

    if (applicationInsights.defaultClient) {
      return (req, res, next) => next();
    }

    const isRealKey = String(activeConnStr).includes('IngestionEndpoint=');

    if (enabled && isRealKey) {
      const roleName = serviceName || config.get('appInsights.roleName');
      const isTestEnv = process.env.NODE_ENV === 'testing' || String(activeConnStr).includes('test-key');
      applicationInsights.setup(activeConnStr)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(!isTestEnv)
        .setAutoCollectConsole(true, true)
        .setUseDiskRetryCaching(true)
        .setSendLiveMetrics(true)
        .setDistributedTracingMode(applicationInsights.DistributedTracingModes.AI_AND_W3C);

      applicationInsights.defaultClient.context.tags[applicationInsights.defaultClient.context.keys.cloudRole] = roleName;
      applicationInsights.start();

      this.console(`Application Insights enabled with role name: ${roleName}`, 1);
      try {
        applicationInsights.defaultClient.trackTrace({ message: `SYA App Insights forced startup trace for ${roleName}` });
        applicationInsights.defaultClient.flush();
      } catch (error) {
        this.console(`Forced trace skipped (running in test context) due to error: ${error}`, 1);
      }
    } else {
      this.console('Application Insights is disabled: Connection string is invalid or empty', 2);
    }

    return (req, res, next) => next();
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

      if (connectionString !== '' && postToAppInsights && applicationInsights.defaultClient) {
        applicationInsights.defaultClient.trackException({ exception: errorObj });
      }

      this.console(errorObj, 3);
    } catch (catchError) {
      console.log('Exception Catch Error', catchError);
    }
  }

  static trace(messageInfo, label, severity = 1, properties = {}, postToAppInsights = true) {
    try {
      const msg = this.msgBuilder(messageInfo, label);

      if (connectionString !== '' && postToAppInsights && applicationInsights.defaultClient) {
        applicationInsights.defaultClient.trackTrace({
          message: msg,
          severity,
          properties
        });
      }

      if (this.isObject(properties) && Object.keys(properties).length > 0) {
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
      if (connectionString !== '' && postToAppInsights && applicationInsights.defaultClient) {
        applicationInsights.defaultClient.trackEvent({ name: eventName });
      }
    } catch (catchError) {
      console.log('Event Catch Error', catchError);
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
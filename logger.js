
const applicationInsights = require('applicationinsights');
const config = require('config');
const chalk = require('chalk');

const iKey = config.get('appInsights.instrumentationKey');

module.exports = class Logger {
  static startAppInsights() {
    if (iKey !== '') {
      applicationInsights.setup(iKey).setAutoCollectConsole(true, true);
      applicationInsights
        .defaultClient
        .context
        // eslint-disable-next-line max-len
        .tags[applicationInsights.defaultClient.context.keys.cloudRole] = config.appInsights.roleName;
      applicationInsights.start();
    }
  }

  static exception(error, pageName) {
    let errorObj = null;

    if (error instanceof Error) {
      errorObj = error;
    } else {
      const msg = this.msgBuilder(error, pageName);
      errorObj = new Error(msg);
    }

    if (iKey !== '') {
      applicationInsights.defaultClient.trackException({ exception: errorObj });
    }
    // eslint-disable-next-line no-console
    console.log(chalk.red(errorObj));
  }

  static info(messageInfo, pageName) {
    const msg = this.msgBuilder(messageInfo, pageName);
    if (iKey !== '') {
      applicationInsights.defaultClient.trackTrace({ message: msg, severity: 1 });
    }

    // eslint-disable-next-line no-console
    console.log(chalk.yellow(msg));
  }

  static msgBuilder(messageInfo, pageName) {
    let msg = '';

    if (pageName) {
      msg = `[${pageName}] - ${messageInfo}`;
    } else {
      msg = messageInfo;
    }
    return msg;
  }
};

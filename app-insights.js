const applicationInsights = require('applicationinsights');
const config = require('config');
const chalk = require('chalk');

const iKey = config.get('appInsights.instrumentationKey');

const enable = () => {
  applicationInsights.setup(iKey).setAutoCollectConsole(true, true);
  applicationInsights
    .defaultClient
    .context
    .tags[applicationInsights.defaultClient.context.keys.cloudRole] = config.appInsights.roleName;
  applicationInsights.start();
};

const trackException = (messageInfo, pageName) => {
  let msg = '';

  if (pageName) {
    msg = `[${pageName}] - ${messageInfo}`;
  } else {
    msg = messageInfo;
  }

  if (iKey !== 'iKey') {
    applicationInsights.defaultClient.trackException({ msg });
  }
  // eslint-disable-next-line no-console
  console.log(chalk.red(msg));
};

const trackTrace = (messageInfo, pageName) => {
  let msg = '';

  if (pageName) {
    msg = `[${pageName}] - ${messageInfo}`;
  } else {
    msg = messageInfo;
  }

  if (!applicationInsights.defaultClient) {
    enable();
  }

  if (iKey !== 'iKey') {
    applicationInsights.defaultClient.trackTrace({ message: msg, severity: 1 });
  }


  // eslint-disable-next-line no-console
  console.log(chalk.yellow(msg));
};

module.exports = {
  enable,
  trackException,
  trackTrace
};

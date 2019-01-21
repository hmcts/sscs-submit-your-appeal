const applicationInsights = require('applicationinsights');
const config = require('config');

const enable = () => {
  const iKey = config.get('appInsights.instrumentationKey');
  applicationInsights.setup(iKey).setAutoCollectConsole(true, true);
  applicationInsights
    .defaultClient
    .context
    .tags[applicationInsights.defaultClient.context.keys.cloudRole] = config.appInsights.roleName;
  applicationInsights.start();
};

const trackException = exception => {
  applicationInsights.defaultClient.trackException({ exception });
};

const trackTrace = messageInfo => {
  applicationInsights.defaultClient.trackTrace({ message: messageInfo, severity: 1 });
};

module.exports = {
  enable,
  trackException,
  trackTrace
};

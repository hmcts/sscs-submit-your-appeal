const applicationInsights = require('applicationinsights');
const config = require('config');

const appInsights = () => {
    const iKey = config.get('appInsights.instrumentationKey');
    applicationInsights.setup(iKey).start();
};

module.exports = appInsights;

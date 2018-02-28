const config = require('config');
const appInsights = require("applicationinsights");

appInsights.setup(config.node.insights)

// Default settings.
.setAutoDependencyCorrelation(true)
.setAutoCollectRequests(true)
.setAutoCollectPerformance(true)
.setAutoCollectExceptions(true)
.setAutoCollectDependencies(true)
.setAutoCollectConsole(true, true)
.setUseDiskRetryCaching(true)
.start();

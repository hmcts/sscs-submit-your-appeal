const appInsights = require("applicationinsights");

appInsights.setup()

// Default settings.
.setAutoDependencyCorrelation(true)
.setAutoCollectRequests(true)
.setAutoCollectPerformance(true)
.setAutoCollectExceptions(true)
.setAutoCollectDependencies(true)
.setAutoCollectConsole(true)
.setUseDiskRetryCaching(true)
.start();

const appInsights = require('app-insights');
const app = require('app.js');
const config = require('config');

app.listen(config.node.port);
appInsights.trackTrace(`SYA server listening on port: ${config.node.port}`);

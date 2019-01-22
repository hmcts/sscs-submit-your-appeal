const appInsights = require('app-insights');
const app = require('app.js');
const config = require('config');

app.listen(config.node.port);

const logPath = 'server.js';

appInsights.trackTrace(`SYA server listening on port: ${config.node.port}`, logPath);

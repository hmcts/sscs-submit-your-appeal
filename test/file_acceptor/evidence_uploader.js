const appInsights = require('app-insights');
const { bootstrap } = require('../../test/file_acceptor');

bootstrap(() => appInsights.trackTrace('Started file acceptor'));
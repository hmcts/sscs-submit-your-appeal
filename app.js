require('logger').startAppInsights();

const config = require('config');
const express = require('express');
const events = require('events');
const commonContent = require('commonContent.json');
const url = require('url');
const healthcheck = require('services/healthcheck');
const { Logger } = require('@hmcts/nodejs-logging');

const {
  configureNunjucks,
  configureMiddleWares,
  configureViews,
  configureHelmet,
  configureJourney,
  configureAppRoutes
} = require('./appConfigurations');

const app = express();

const port = config.get('node.port');

// Tests
const PORT_RANGE = 50;
app.set('portFrom', port);
app.set('portTo', port + PORT_RANGE);
app.set('assetPath', url.resolve('/', 'assets/'));
app.set('trust proxy', true);
app.locals.asset_path = url.resolve('/', 'assets/');
events.EventEmitter.defaultMaxListeners = 500000;


const logger = Logger.getLogger('app.js'); // app.js is just an example, can be anything that's meaningful to you

logger.log({
  level: 'silly',
  message: 'What time is the testing at?'
});
// Configure App health.
healthcheck.setup(app);

// Configure App routes.
configureAppRoutes(app);

// Configure App Middlewares
configureMiddleWares(app, express);

// Configure Helmet Security Policies.
configureHelmet(app);

// Configure View Locations
configureViews(app);

// Configure Nunjucks Settings
configureNunjucks(app, commonContent);

// Configure One Per page settings.
configureJourney(app, commonContent);


module.exports = app;

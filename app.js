require('logger').startAppInsights();

const config = require('config');
const express = require('express');
const events = require('events');
const commonContent = require('commonContent.json');
const url = require('url');
const healthcheck = require('services/healthcheck');

const {
  configureNunjucks,
  configureMiddleWares,
  configureViews,
  configureHelmet,
  configureJourney,
  configureAppRoutes,
  configureGlobalVariables
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
const njk = configureNunjucks(app, commonContent);

// Configure App Middleware Global Variable setting
configureGlobalVariables(app, njk);

// Configure One Per page settings.
configureJourney(app, commonContent);


module.exports = app;

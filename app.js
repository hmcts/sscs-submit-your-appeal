require('logger').startAppInsights();

const config = require('config');
const express = require('express');
const events = require('events');
const content = require('content.en.json');

const url = require('url');

const { configureNunjucks,
  configureMiddleWares,
  configureViews,
  configureHelmet,
  configureJourney,
  configureAppRoutes } = require('./appConfigurations');

const app = express();

const port = config.get('node.port');

// Tests
const PORT_RANGE = 50;
app.set('portFrom', port);
app.set('portTo', port + PORT_RANGE);
app.set('assetPath', url.resolve('/', 'assets/'));
app.set('trust proxy', 1);
app.locals.asset_path = url.resolve('/', 'assets/');
events.EventEmitter.defaultMaxListeners = 100;
// Configure App routes.
configureAppRoutes(app);

// Configure App Middlewares
configureMiddleWares(app, express);

// Configure Helmet Security Policies.
configureHelmet(app);

// Configure View Locations
configureViews(app);

// Configure Nunjucks Settings
configureNunjucks(app, content);

// Configure One Per page settings.
configureJourney(app, content);

module.exports = app;

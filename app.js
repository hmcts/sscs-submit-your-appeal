require('logger').startAppInsights();

const config = require('config');
const express = require('express');
const events = require('events');
const commonContent = require('commonContent.json');
const url = require('url');
const healthcheck = require('services/healthcheck');
const cookieParser = require('cookie-parser');

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
app.set('trust proxy', 1);
app.locals.asset_path = url.resolve('/', 'assets/');
events.EventEmitter.defaultMaxListeners = 100;
app.use(cookieParser());

app.set('session', { secure: true, sameSite: 'none' });
app.set('connect.sid', { secure: true, sameSite: 'none' });

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

/* eslint-disable no-process-env */
const { journey } = require('@hmcts/one-per-page');
const config = require('config');
const express = require('express');
const steps = require('steps');
const content = require('content.en.json');
const { configureNunjucks,
  configureMiddleWares,
  configureViews,
  configureAppRoutes } = require('../../appConfigurations');

const app = express();
const url = require('url');

const port = config.get('node.port');

// Tests
const PORT_RANGE = 50;
app.set('portFrom', port);
app.set('portTo', port + PORT_RANGE);
app.set('assetPath', url.resolve('/', 'assets/'));
app.set('trust proxy', 1);
app.locals.asset_path = url.resolve('/', 'assets/');

const startStep = require('steps/entry/Entry');

const noSessionHandler = (req, res, next) => {
  if (req.url === '/check-your-appeal' || req.url === '/done') {
    if (req.session) {
      req.session.entryPoint = {};
      req.session.entryPoint = startStep;
    }
  }

  next();
};
journey(app, {
  steps,
  session: {
    redis: {
      url: config.redis.url,
      connect_timeout: 15000
    },
    cookie: {
      secure: config.redis.useSSL === 'true'
    },
    secret: config.redis.secret
  },
  noSessionHandler,
  errorPages: {
    notFound: {
      template: 'errors/Error404.html',
      title: content.errors.notFound.title,
      message: content.errors.notFound.message,
      nextSteps: content.errors.notFound.nextSteps
    },
    serverError: {
      template: 'errors/500/Error500.html',
      title: content.errors.serverError.title,
      message: content.errors.serverError.message
    }
  },
  timeoutDelay: 2000,
  apiUrl: `${config.api.url}/appeals`,
  useCsrfToken: false
});

// Configure App routes.
configureAppRoutes(app);

// Configure App Middlewares
configureMiddleWares(app, express);

// Configure View Locations
configureViews(app);

// Configure Nunjucks Settings
configureNunjucks(app, content);

module.exports = app;


// Normalize the global i18next language early so dynamic requires that use
// `i18next.language` will resolve to files like `content.en.json` instead of
// trying to load `content.en-GB` which doesn't exist in the repo.
const _i18next = (() => {
  try {
    const i18next = require('i18next');

    // Store any existing value
    i18next._language = i18next.language || 'en';

    // Define an accessor so reads always get the primary subtag and writes
    // record the raw value on _language. This prevents later code from setting
    // 'en-GB' and breaking dynamic requires.
    Object.defineProperty(i18next, 'language', {
      configurable: true,
      enumerable: true,
      get() {
        const raw = this._language || 'en';
        return (typeof raw === 'string' && raw.length > 0) ? raw.split('-')[0] : 'en';
      },
      set(val) {
        this._language = val;
      }
    });

    // Make changeLanguage normalize values too and update _language
    const origChange = i18next.changeLanguage;
    i18next.changeLanguage = function(lng, cb) {
      const normalized = (typeof lng === 'string' && lng.length > 0) ? lng.split('-')[0] : 'en';
      this._language = typeof lng === 'string' ? lng : this._language || 'en';
      if (typeof origChange === 'function') {
        return origChange.call(i18next, normalized, cb);
      }
      if (typeof cb === 'function') cb();
      return Promise.resolve();
    };

    return i18next;
  } catch (e) {
    // If i18next isn't available for any reason, ignore — vendored code will
    // continue to use its own instance.
    return null;
  }
})();

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

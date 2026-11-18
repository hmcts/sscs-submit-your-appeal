// Normalize the global i18next language early so dynamic requires that use
// `i18next.language` will resolve to files like `content.en.json` instead of
// trying to load `content.en-GB` which doesn't exist in the repo.
/* eslint-disable func-names */
(() => {
  try {
    const i18next = require('i18next');

    const ALLOWED_LANGUAGES = ['en', 'cy'];
    const DEFAULT_LANG = 'en';

    const sanitizeLanguage = lng => {
      if (typeof lng !== 'string' || !lng) return DEFAULT_LANG;
      const primary = lng.split('-')[0].toLowerCase();
      return ALLOWED_LANGUAGES.includes(primary) ? primary : DEFAULT_LANG;
    };

    // Store any existing value
    i18next._language = sanitizeLanguage(i18next.language);

    // Define an accessor so reads always get the primary subtag and writes
    // record the raw value on _language. This prevents later code from setting
    // 'en-GB' and breaking dynamic requires.
    Object.defineProperty(i18next, 'language', {
      configurable: true,
      enumerable: true,
      get() {
        const raw = this._language || DEFAULT_LANG;
        return sanitizeLanguage(raw);
      },
      set(val) {
        this._language = sanitizeLanguage(val);
      }
    });

    // Make changeLanguage normalize values too and update _language
    const origChange = i18next.changeLanguage;

    i18next.changeLanguage = function(lng, normalizeLanguage) {
      const normalized = sanitizeLanguage(lng);
      this._language = normalized;
      if (typeof origChange === 'function') {
        return origChange.call(i18next, normalized, normalizeLanguage);
      }
      if (typeof normalizeLanguage === 'function') normalizeLanguage();
      return Promise.resolve();
    };

    return i18next;
  } catch {
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

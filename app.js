require('logger').startAppInsights();
const { journey } = require('@hmcts/one-per-page');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const os = require('os');
const path = require('path');
const steps = require('steps');
const paths = require('paths');
const policyPages = require('policy-pages/routes');
const content = require('content.en.json');
const urls = require('urls');
const HttpStatus = require('http-status-codes');
const cookieParser = require('cookie-parser');
/* eslint-disable max-len */
const fileTypeWhitelist = require('steps/reasons-for-appealing/evidence-upload/fileTypeWhitelist.js');
const url = require('url');
const nunjucks = require('nunjucks');
const expressNunjucks = require('express-nunjucks');
const expressStaticGzip = require('express-static-gzip');

/* eslint-enable max-len */
const idam = require('middleware/idam');

const app = express();
const isDev = () => process.env.NODE_ENV === 'development';

const allowSaveAndReturn = config.get('features.allowSaveAndReturn.enabled') === 'true';
const protocol = config.get('node.protocol');
const port = config.get('node.port');

if (allowSaveAndReturn) {
  // eslint-disable-next-line
  require('mocks/ccd/server')(app);
}

// Tests
const PORT_RANGE = 50;
app.set('portFrom', port);
app.set('portTo', port + PORT_RANGE);
app.set('assetPath', url.resolve('/', 'assets/'));
app.get('/appeal');

app.use('/assets', expressStaticGzip(path.resolve('dist')));

// Parsing cookies for the stored encrypted session key
app.use(cookieParser());

// Get user details from idam, sets req.idam.userDetails
app.use(idam.userDetails());

// Protect against some well known web vulnerabilities
// by setting HTTP headers appropriately.
app.use(helmet());

// Helmet content security policy (CSP) to allow only assets from same domain.
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ['\'self\''],
    fontSrc: ['\'self\' data:'],
    styleSrc: ['\'self\'', '\'unsafe-inline\''],
    scriptSrc: [
      '\'self\'',
      '\'unsafe-inline\'',
      'www.google-analytics.com',
      'www.googletagmanager.com'
    ],
    connectSrc: ['\'self\'', 'www.gov.uk'],
    mediaSrc: ['\'self\''],
    frameSrc: ['\'none\''],
    imgSrc: [
      '\'self\'',
      'www.google-analytics.com',
      'www.googletagmanager.com'
    ]
  }
}));

const maxAge = config.get('ssl.hpkp.maxAge');
const sha256s = [
  config.get('ssl.hpkp.sha256s'),
  config.get('ssl.hpkp.sha256sBackup')
];

// Helmet HTTP public key pinning
app.use(helmet.hpkp({ maxAge, sha256s }));

// Helmet referrer policy
app.use(helmet.referrerPolicy({ policy: 'origin' }));

// Disallow search index indexing
app.use((req, res, next) => {
  // Setting headers stops pages being indexed even if indexed pages link to them
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('X-Served-By', os.hostname());
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /');
});

app.use('/sessions', (req, res) => {
  res.sendStatus(HttpStatus.NOT_FOUND);
});
// because of a bug with iphone, we need to remove the mime types from accept
const filteredWhitelist = fileTypeWhitelist.filter(item => item.indexOf('/') === -1);

app.set('views', [
  path.resolve(__dirname, 'steps'),
  path.resolve(__dirname, 'policy-pages'),
  path.resolve(__dirname, 'error-pages'),
  path.resolve(__dirname, 'node_modules/govuk-frontend'),
  path.resolve(__dirname, 'node_modules/govuk-frontend/components'),
  path.resolve(__dirname, 'views'),
  path.resolve(__dirname, 'components')
]);
const truthies = ['true', 'True', 'TRUE', '1', 'yes', 'Yes', 'YES', 'y', 'Y'];
const falsies = ['false', 'False', 'FALSE', '0', 'no', 'No', 'NO', 'n', 'N'];
app.locals.asset_path = url.resolve('/', 'assets/');

expressNunjucks(app, {
  watch: isDev(),
  noCache: isDev(),
  throwOnUndefined: false,
  // see https://git.io/fh9yw
  loader: nunjucks.FileSystemLoader,
  globals: {
    isArray(value) {
      return Array.isArray(value);
    },
    parseBool(value) {
      if (truthies.includes(value)) {
        return true;
      }
      if (falsies.includes(value)) {
        return false;
      }
      return value;
    },
    isBoolean(value) {
      return typeof value === 'boolean';
    },
    safeId(...strings) {
      return strings
        .map(str => str.toString())
        .join('-')
        .toLowerCase()
        // replace foo[1] to foo-1
        .replace(/\[(\d{1,})\]/, '-$1')
        // replace 'foo bar' to 'foo-bar'
        .replace(/\s/g, '-');
    },
    phase: 'BETA',
    feedbackLink: urls.phaseBanner,
    environment: process.env.NODE_ENV,
    inactivityTimeout: {
      title: content.inactivityTimeout.title,
      expiringIn: content.inactivityTimeout.expiringIn,
      text: content.inactivityTimeout.text,
      yes: content.inactivityTimeout.yes,
      no: content.inactivityTimeout.no
    },
    // because of a bug with iphone, we need to remove the mime types from accept
    accept: filteredWhitelist,
    timeOut: config.get('redis.timeout'),
    timeOutMessage: content.timeout.message,
    relatedContent: content.relatedContent,
    paths,
    urls
  }
});

app.set('trust proxy', 1);

journey(app, {
  steps,
  session: {
    redis: {
      url: config.redis.url,
      connect_timeout: 15000
    },
    cookie: {
      secure: protocol === 'https'
    },
    secret: config.redis.secret
  },
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
  apiDraftUrl: `${config.api.url}/drafts`,
  draftUrl: config.api.draftUrl,
  useCsrfToken: false
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(paths.health, healthcheck.configure({
  checks: {}
}));

app.use(paths.monitoring, healthcheck.configure({
  checks: {
    'submit-your-appeal-api': healthcheck.web(`${config.api.url}/health`)
  }
}));

app.use('/', policyPages);
app.get('/', (req, res) => {
  res.redirect('/entry');
});

app.get('/start-an-appeal', (req, res) => {
  res.redirect('/entry');
});

module.exports = app;

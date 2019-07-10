const expressNunjucks = require('express-nunjucks');
const nunjucks = require('nunjucks');
const urls = require('urls');
const config = require('config');
const helmet = require('helmet');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const bodyParser = require('body-parser');
const os = require('os');
const path = require('path');
const { journey } = require('@hmcts/one-per-page');
const steps = require('steps');
const idam = require('middleware/idam');
const paths = require('paths');
const policyPages = require('policy-pages/routes');
const HttpStatus = require('http-status-codes');
const cookieParser = require('cookie-parser');
/* eslint-disable max-len */
const fileTypeWhitelist = require('steps/reasons-for-appealing/evidence-upload/fileTypeWhitelist.js');

const filteredWhitelist = fileTypeWhitelist.filter(item => item.indexOf('/') === -1);
const truthies = ['true', 'True', 'TRUE', '1', 'yes', 'Yes', 'YES', 'y', 'Y'];
const falsies = ['false', 'False', 'FALSE', '0', 'no', 'No', 'NO', 'n', 'N'];
const isDev = () => process.env.NODE_ENV === 'development';

const configureNunjucks = (app, content) => {
// because of a bug with iphone, we need to remove the mime types from accept
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
      contactUs: content.contactUs,
      allowContactUs: config.get('features.allowContactUs.enabled') === 'true',
      contactUsWebFormEnabled: config.get('features.allowContactUs.webFormEnabled') === 'true',
      contactUsTelephoneEnabled: config.get('features.allowContactUs.telephoneEnabled') === 'true',
      webFormUrl: config.get('services.webForm.url'),
      webChatEnabled: config.get('features.allowContactUs.webChatEnabled') === 'true',
      webChat: config.get('services.webChat'),
      paths,
      urls
    }
  });
};

const configureViews = app => {
  app.set('views', [
    path.resolve(__dirname, 'steps'),
    path.resolve(__dirname, 'policy-pages'),
    path.resolve(__dirname, 'error-pages'),
    path.resolve(__dirname, 'node_modules/govuk-frontend'),
    path.resolve(__dirname, 'node_modules/govuk-frontend/components'),
    path.resolve(__dirname, 'views'),
    path.resolve(__dirname, 'components')
  ]);
};

const configureHelmet = app => {
  const maxAge = config.get('ssl.hpkp.maxAge');
  const sha256s = [
    config.get('ssl.hpkp.sha256s'),
    config.get('ssl.hpkp.sha256sBackup')
  ];

  // Helmet HTTP public key pinning
  app.use(helmet.hpkp({ maxAge, sha256s }));
  // Helmet referrer policy
  app.use(helmet.referrerPolicy({ policy: 'origin' }));


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
        'www.googletagmanager.com',
        'chatbuilder.netlify.com',
        'vcc-eu4.8x8.com'
      ],
      connectSrc: ['\'self\'', 'www.gov.uk'],
      mediaSrc: ['\'self\''],
      frameSrc: ['vcc-eu4.8x8.com'],
      imgSrc: [
        '\'self\'',
        'www.google-analytics.com',
        'www.googletagmanager.com',
        'vcc-eu4.8x8.com'
      ]
    }
  }));
};

const configureJourney = (app, content) => {
  journey(app, {
    steps,
    session: {
      redis: {
        url: config.redis.url,
        connect_timeout: 15000
      },
      cookie: {
        secure: config.get('node.protocol') === 'https'
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
};

const configureMiddleWares = (app, express) => {
  app.use('/assets', express.static(path.resolve('dist')));

  // Parsing cookies for the stored encrypted session key
  app.use(cookieParser());

  // Get user details from idam, sets req.idam.userDetails
  app.use(idam.userDetails());

  // Disallow search index indexing
  app.use((req, res, next) => {
    // Setting headers stops pages being indexed even if indexed pages link to them
    res.setHeader('X-Robots-Tag', 'noindex');
    res.setHeader('X-Served-By', os.hostname());
    res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
    next();
  });
  // Get Base url
  app.use((req, res, next) => {
    app.locals.baseUrl = `${req.protocol}://${req.headers.host}`;
    next();
  });

  app.use('/sessions', (req, res) => {
    res.sendStatus(HttpStatus.NOT_FOUND);
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
};

const configureAppRoutes = app => {
  app.get('/appeal');

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
  });

  app.get('/', (req, res) => {
    res.redirect('/entry');
  });

  app.get('/start-an-appeal', (req, res) => {
    res.redirect('/entry');
  });
};

module.exports = { configureNunjucks,
  configureViews,
  configureHelmet,
  configureJourney,
  configureMiddleWares,
  configureAppRoutes };
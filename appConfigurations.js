const { expressNunjucks } = require('express-nunjucks');
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
const HttpStatus = require('http-status-codes');
const cookieParser = require('cookie-parser');
/* eslint-disable max-len */
const fileTypeWhitelist = require('steps/reasons-for-appealing/evidence-upload/fileTypeWhitelist.js');

const filteredWhitelist = fileTypeWhitelist.filter(item => item.indexOf('/') === -1);
const truthies = ['true', 'True', 'TRUE', '1', 'yes', 'Yes', 'YES', 'y', 'Y'];
const falsies = ['false', 'False', 'FALSE', '0', 'no', 'No', 'NO', 'n', 'N'];
const isDev = () => process.env.NODE_ENV === 'development';
let webChatBaseUrl = process.env.WEBCHAT_URL;
if (!webChatBaseUrl) {
  webChatBaseUrl = 'webchat.ctsc.hmcts.net';
}
let webChatClientBaseUrl = process.env.WEBCHAT_CLIENT_URL;
if (!webChatClientBaseUrl) {
  webChatClientBaseUrl = 'webchat-client.ctsc.hmcts.net';
}

const configureNunjucks = (app, commonContent) => {
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
      commonContent,
      // because of a bug with iphone, we need to remove the mime types from accept
      accept: filteredWhitelist,
      timeOut: config.get('redis.timeout'),
      allowContactUs: config.get('features.allowContactUs.enabled') === 'true',
      contactUsWebFormEnabled: config.get('features.allowContactUs.webFormEnabled') === 'true',
      contactUsTelephoneEnabled: config.get('features.allowContactUs.telephoneEnabled') === 'true',
      mediaFilesAllowed: config.get('features.evidenceUpload.mediaFilesAllowed.enabled') === 'true',
      webFormUrl: config.get('services.webForm.url'),
      webChatEnabled: config.get('features.allowContactUs.webChatEnabled') === 'true',
      webChatClientUrl: webChatClientBaseUrl,
      webChatUrl: webChatBaseUrl,
      paths,
      urls,
      featureToggles: {
        welsh: () => process.env.FT_WELSH || config.features.welsh.enabled,
        cookieBanner: () => process.env.ALLOW_COOKIE_BANNER_ENABLED || config.features.cookieBanner.enabled,
        jQueryVersionToggle: () => process.env.JQUERY_VERSION_FLAG || config.features.jQueryVersionToggle.enabled}
    }
  });
};

const configureViews = app => {
  app.set('views', [
    path.resolve(__dirname, 'steps'),
    path.resolve(__dirname, 'cookie-banner/'),
    path.resolve(__dirname, 'policy-pages'),
    path.resolve(__dirname, 'error-pages'),
    path.resolve(__dirname, 'node_modules/govuk-frontend/govuk/'),
    path.resolve(__dirname, 'node_modules/govuk-frontend/govuk/components/'),
    path.resolve(__dirname, 'views'),
    path.resolve(__dirname, 'components')
  ]);
};

const configureHelmet = app => {
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
      formAction: [`'self' ${config.get('services.idam.loginUrl')} ${config.get('services.pcq.url')}`],
      styleSrc: [
        '\'self\'',
        'https://webchat-client.pp.ctsc.hmcts.net/chat-client/',
        'https://webchat-client.ctsc.hmcts.net/chat-client/',
        '\'unsafe-inline\''
      ],
      scriptSrc: [
        '\'self\'',
        '\'unsafe-inline\'',
        '*.google-analytics.com',
        '*.googletagmanager.com',
        'www.code.jquery.com',
        'http://maxcdn.bootstrapcdn.com',
        'www.maxcdn.bootstrapcdn.com',
        'code.jquery.com',
        'chatbuilder.netlify.com',
        'vcc-eu4.8x8.com',
        'vcc-eu4b.8x8.com',
        'https://webchat-client.pp.ctsc.hmcts.net/chat-client/',
        'https://webchat-client.ctsc.hmcts.net/chat-client/'
      ],
      connectSrc: [
        '\'self\'',
        'www.gov.uk',
        '*.google-analytics.com',
        '*.googletagmanager.com',
        'www.code.jquery.com',
        'http://maxcdn.bootstrapcdn.com',
        'www.maxcdn.bootstrapcdn.com',
        'code.jquery.com',
        'wss://webchat.pp.ctsc.hmcts.net',
        'wss://webchat.ctsc.hmcts.net',
        'https://webchat.pp.ctsc.hmcts.net',
        'https://webchat.ctsc.hmcts.net'
      ],
      mediaSrc: ['\'self\''],
      frameSrc: [
        'vcc-eu4.8x8.com',
        'vcc-eu4b.8x8.com',
        '*.googletagmanager.com'
      ],
      imgSrc: [
        '\'self\'',
        '*.g.doubleclick.net',
        'www.google.com',
        'www.google.co.uk',
        'www.code.jquery.com',
        'http://maxcdn.bootstrapcdn.com',
        'www.maxcdn.bootstrapcdn.com',
        'code.jquery.com',
        '*.google-analytics.com',
        '*.googletagmanager.com',
        'vcc-eu4.8x8.com',
        'vcc-eu4b.8x8.com',
        'https://webchat-client.pp.ctsc.hmcts.net/chat-client/',
        'https://webchat-client.ctsc.hmcts.net/chat-client/'
      ]
    }
  }));
};
/*eslint-disable */
const configureJourney = (app, commonContent) => {
  journey(app, {
    steps,
    session: {
      redis: {
        url: config.redis.url,
        retry_strategy(options) {
          const { error, total_retry_time, attempt } = options;
          if (error) {
            console.log(`Redis connection failed with ${error.code}`);
          }
          if (options.error && options.error.code === "ECONNREFUSED"){
            return new Error("redis server refused connection");
          }
          if(total_retry_time > 1000 * 60 * 60){
            return new Error("Retry time exhausted");
          }
          if (options.attempt > 10 ) {
            return undefined;
          }
          console.log(`Redis retrying connection attempt ${attempt} total retry time ${total_retry_time} ms`);
          const minRetryFactor = 500;
          const retryTime = attempt * minRetryFactor;
          const maxRetryWait = 36000;
          return Math.min(retryTime, maxRetryWait);
        }
      },
      cookie: {
        secure: config.get('node.protocol') === 'https',
        sameSite: config.features.sameSiteCookieFlag ? 'lax' : false},
      secret: config.redis.secret
    },
    errorPages: {
      notFound: {
        template: 'errors/Error404.html',
        title: commonContent.en.errors.notFound.title,
        message: commonContent.en.errors.notFound.message,
        nextSteps: commonContent.en.errors.notFound.nextSteps
      },
      serverError: {
        template: 'errors/500/Error500.html',
        title: commonContent.en.errors.serverError.title,
        message: commonContent.en.errors.serverError.message
      }
    },
    timeoutDelay: 2000,
    apiUrl: `${config.api.url}/appeals`,
    apiDraftUrl: `${config.api.url}/drafts`,
    apiDraftUrlCreate: `${config.api.url}/drafts?forceCreate=true`,
    apiAllDraftUrl: `${config.api.url}/drafts/all`,
    draftUrl: config.api.draftUrl,
    useCsrfToken: false
  });
};
/* eslint-enable */
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
  // Get url path
  app.use((req, res, next) => {
    app.locals.urlPath = req.url.replace('/', '');
    next();
  });

  app.use('/sessions', (req, res) => {
    res.sendStatus(HttpStatus.NOT_FOUND);
  });

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(paths.monitoring, healthcheck.configure({
    checks: {
      'submit-your-appeal-api': healthcheck.web(`${config.api.url}/health`)
    }
  }));
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

module.exports = {
  configureNunjucks,
  configureViews,
  configureHelmet,
  configureJourney,
  configureMiddleWares,
  configureAppRoutes
};
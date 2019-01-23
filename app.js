require('logger').startAppInsights();
const { journey } = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
/* eslint-disable max-len */
const fileTypeWhitelist = require('steps/reasons-for-appealing/evidence-upload/fileTypeWhitelist.js');
/* eslint-enable max-len */

const app = express();

const protocol = config.get('node.protocol');
const port = config.get('node.port');

// Tests
const PORT_RANGE = 50;
app.set('portFrom', port);
app.set('portTo', port + PORT_RANGE);

// Protect against some well known web vulnerabilities
// by setting HTTP headers appropriately.
app.use(helmet());

// Helmet content security policy (CSP) to allow only assets from same domain.
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ['\'self\''],
    fontSrc: ['\'self\' data:'],
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

lookAndFeel.configure(app, {
  baseUrl: '/',
  express: {
    views: [
      path.resolve(__dirname, 'steps'),
      path.resolve(__dirname, 'views/compliance'),
      path.resolve(__dirname, 'policy-pages'),
      path.resolve(__dirname, 'error-pages')
    ]
  },
  webpack: {
    entry: [
      path.resolve(__dirname, 'assets/scss/main.scss'),
      path.resolve(__dirname, 'assets/js/main.js')
    ],
    module: {
      rules: [
        {
          test: /\.(png|jpg)$/i,
          loaders: ['file-loader']
        },
        {
          test: /\.(njk|nunjucks)$/,
          loader: 'nunjucks-loader',
          query: {
            root: path.resolve(__dirname, '/dist/nunjucks')
          }
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin(
        [
          {
            from: path.resolve(__dirname, 'assets/images'),
            to: 'images'
          },
          {
            from: path.resolve(__dirname,
              'node_modules/@hmcts/look-and-feel/templates/look-and-feel/components/fields.njk'),
            to: 'nunjucks/look-and-feel/components/fields.njk'
          },
          {
            from: path.resolve(__dirname, 'views/components/formElements.html'),
            to: 'nunjucks/formElements.njk'
          }
        ])
    ]
  },
  nunjucks: {
    globals: {
      phase: 'BETA',
      environment: process.env.NODE_ENV,
      banner: `${content.phaseBanner.newService}
        <a href="${urls.phaseBanner}" target="_blank">
            ${content.phaseBanner.reportProblem}
        </a>${content.phaseBanner.improve}`,
      isArray(value) {
        return Array.isArray(value);
      },
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
  },
  development: {
    useWebpackDevMiddleware: true
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
  useCsrfToken: true
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
app.use('/', (req, res) => res.redirect('/entry'));

module.exports = app;

/* eslint-disable no-process-env */
const { journey } = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const steps = require('steps');
const paths = require('paths');
const landingPages = require('landing-pages/routes');
const policyPages = require('policy-pages/routes');
const content = require('content.en.json');
const urls = require('urls');

const app = express();

const protocol = config.get('node.protocol');
const hostname = config.get('node.hostname');
const port = config.get('node.port');
const startStep = require('steps/entry/Entry');

let baseUrl = `${protocol}://${hostname}`;
if (process.env.NODE_ENV === 'mocha') {
  baseUrl = `${baseUrl}:${port}`;
}

lookAndFeel.configure(app, {
  baseUrl,
  express: {
    views: [
      path.resolve(__dirname, '../../steps'),
      path.resolve(__dirname, 'landing-pages'),
      path.resolve(__dirname, 'views/compliance'),
      path.resolve(__dirname, 'policy-pages'),
      path.resolve(__dirname, 'error-pages')
    ]
  },
  webpack: {
    entry: [
      path.resolve(__dirname, '../../assets/scss/main.scss'),
      path.resolve(__dirname, '../../assets/js/main.js')
    ],
    module: {
      rules: [
        {
          test: /\.(png|jpg)$/i,
          loaders: ['file-loader']
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin(
        [
          {
            from: path.resolve(__dirname, '../../assets/images'),
            to: 'images'
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
  baseUrl,
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
  apiUrl: `${config.api.url}/appeals`
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', landingPages, policyPages);

module.exports = app;

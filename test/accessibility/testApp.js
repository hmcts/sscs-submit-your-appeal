/* eslint-disable no-process-env */
const { journey } = require('@hmcts/one-per-page');
const config = require('config');
const express = require('express');
const steps = require('steps');
const content = require('commonContent.json');
const url = require('url');
const startStep = require('steps/entry/Entry');
const {
  configureNunjucks,
  configureMiddleWares,
  configureViews,
  configureAppRoutes
} = require('../../appConfigurations');

const app = express();
const port = config.get('node.port');

// Tests
const PORT_RANGE = 50;
app.set('portFrom', port);
app.set('portTo', port + PORT_RANGE);
app.set('assetPath', url.resolve('/', 'assets/'));
app.set('trust proxy', 1);
app.locals.asset_path = url.resolve('/', 'assets/');

const listOfUrls = [
  '/done',
  '/check-your-appeal',
  '/benefit-type?lng=en',
  '/postcode-check?lng=en',
  '/benefit-type',
  '/cookie-policy?lng=cy',
  '/check-your-appeal?lng=cy',
  '/check-your-appeal?lng=en',
  '/equality-and-diversity?lng=en',
  '/enter-appointee-dob?lng=en',
  '/appointee-same-address?lng=en',
  '/no-mrn?lng=cy',
  '/are-you-an-appointee?lng=en',
  '/enter-appointee-name?lng=en',
  '/appellant-text-reminders?lng=en',
  '/send-to-number?lng=en',
  '/appointee-same-address?lng=en',
  '/enter-mobile?lng=en',
  '/representative?lng=en',
  '/no-representative-details?lng=en',
  '/sms-confirmation?lng=en',
  '/hearing-availability?lng=en',
  '/hearing-support?lng=en',
  '/hearing-arrangements?lng=en',
  '/dates-cant-attend?lng=en',
  '/evidence-provide?lng=en',
  '/reason-for-appealing?lng=en',
  '/the-hearing?lng=en',
  '/other-reason-for-appealing?lng=en',
  '/evidence-upload?lng=en',
  '/evidence-description?lng=en',
  '/not-attending-hearing?lng=en',
  '/new-appeal?lng=en',
  '/benefit-type?lng=cy',
  '/postcode-check?lng=cy',
  '/independence?lng=cy',
  '/language-preference?lng=cy',
  '/have-you-got-an-mrn?lng=cy',
  '/have-contacted-dwp?lng=cy',
  '/dwp-issuing-office?lng=cy',
  '/accessibility?lng=en',
  '/check-mrn-date?lng=cy',
  '/mrn-over-month-late?lng=cy',
  '/mrn-over-thirteen-months-late?lng=cy',
  '/enter-appellant-dob?lng=cy',
  '/enter-appellant-nino?lng=cy',
  '/enter-appellant-name?lng=cy',
  '/are-you-an-appointee?lng=cy',
  '/enter-appointee-name?lng=cy',
  '/enter-appointee-dob?lng=cy',
  '/appointee-same-address?lng=cy',
  '/have-contacted-dwp?lng=en',
  '/appellant-text-reminders?lng=cy',
  '/send-to-number?lng=cy',
  '/enter-mobile?lng=cy',
  '/sms-confirmation?lng=cy',
  '/representative-details?lng=cy',
  '/representative-details?lng=en',
  '/representative?lng=cy',
  '/reason-for-appealing?lng=cy',
  '/reason-for-appealing',
  '/reason-for-appealing',
  '/no-representative-details?lng=cy',
  '/new-appeal?lng=cy',
  '/equality-and-diversity?lng=cy',
  '/hearing-options?lng=cy',
  '/hearing-options?lng=en',
  '/the-hearing?lng=cy',
  '/not-attending-hearing?lng=cy',
  '/dates-cant-attend?lng=cy',
  '/hearing-arrangements?lng=cy',
  '/hearing-support?lng=cy',
  '/hearing-availability?lng=cy',
  '/evidence-description?lng=cy',
  '/evidence-upload?lng=cy',
  '/evidence-provide?lng=cy',
  '/other-reason-for-appealing?lng=cy',
  '/create-account?lng=en',
  '/create-account?lng=cy',
  '/language-preference?lng=en',
  '/check-mrn-date?lng=en',
  '/dwp-issuing-office?lng=en',
  '/equality-and-diversity?lng=cy',
  '/new-appeal?lng=en',
  '/enter-appellant-nino?lng=en',
  '/enter-appellant-name?lng=en',
  '/enter-appellant-dob?lng=en',
  '/mrn-over-thirteen-months-late?lng=en',
  '/mrn-over-month-late?lng=en',
  '/no-mrn?lng=en',
  '/mrn-date?lng=en',
  '/mrn-date?lng=cy',
  '/accessibility?lng=cy',
  '/have-you-got-an-mrn?lng=en'
];

const benefitTypeUrls = [
  '/independence?lng=en',
  '/independence?lng=cy',
  '/representative-details?lng=en',
  '/representative-details?lng=cy',
  '/no-representative-details?lng=en',
  '/no-representative-details?lng=cy',
  '/have-you-got-an-mrn?lng=en',
  '/have-you-got-an-mrn?lng=cy',
  '/have-contacted-dwp?lng=en',
  '/have-contacted-dwp?lng=cy',
  '/check-mrn-date?lng=en',
  '/check-mrn-date?lng=cy',
  '/mrn-date?lng=en',
  '/mrn-date?lng=cy',
  '/reason-for-appealing?lng=en',
  '/reason-for-appealing?lng=cy',
  '/check-mrn-date?lng=en',
  '/check-mrn-date?lng=cy',
  '/hearing-options?lng=en',
  '/hearing-options?lng=cy'

];

const noSessionHandler = (req, res, next) => {
  const isUrl = listOfUrls.some(stepUrl => stepUrl === req.url);
  if (isUrl) {
    if (req.session) {
      req.session.entryPoint = {};
      req.session.entryPoint = startStep;
    }
  }

  const isBenefitUrl = benefitTypeUrls.some(stepUrl => stepUrl === req.url);
  if (isBenefitUrl) {
    if (req.session) {
      req.session.BenefitType = {};
      req.session.BenefitType.benefitType = 'Bereavement Benefit';
      req.session.active = () => console.log('');
      req.session.hydrate = () => console.log('');
      req.session.dehydrate = () => console.log('');
      req.session.generate = () => console.log('');
    }
  }


  next();
};

journey(app, {
  steps,
  session: {
    redis: {
      url: config.redis.url,
      connect_timeout: 30000
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
      title: content.en.errors.notFound.title,
      message: content.en.errors.notFound.message,
      nextSteps: content.en.errors.notFound.nextSteps
    },
    serverError: {
      template: 'errors/500/Error500.html',
      title: content.en.errors.serverError.title,
      message: content.en.errors.serverError.message
    }
  },
  timeoutDelay: 5000,
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

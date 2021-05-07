const {
  section
} = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStoreCYA } = require('middleware/draftAppealStoreMiddleware');
const { removeRevertInvalidSteps } = require('middleware/draftAppealStoreMiddleware');
const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo, action, redirectTo } = require('@hmcts/one-per-page/flow');
const { lastName } = require('utils/regex');
const { get } = require('lodash');
const sections = require('steps/check-your-appeal/sections');
const logger = require('logger');
const { Spinner } = require('spin');

const logPath = 'CheckYourAppeal.js';
const HttpStatus = require('http-status-codes');
const request = require('superagent');

require('superagent-csrf')(request);
require('superagent-retry-delay')(request);

const paths = require('paths');
const Joi = require('joi');
const csurf = require('csurf');

const csrfProtection = csurf({ cookie: false });
const config = require('config');

const allowSaveAndReturn = config.get('features.allowSaveAndReturn.enabled') === 'true';

const httpRetries = 3;
const retryDelay = 10000;

const spinnerOptions = {
  lines: 13, // The number of lines to draw
  length: 38, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#ffffff', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};


class CheckYourAppeal extends SaveToDraftStoreCYA {
  constructor(...args) {
    super(...args);
    this.sendToAPI = this.sendToAPI.bind(this);
  }

  handler(req, res, next) {
    if (allowSaveAndReturn) {
      removeRevertInvalidSteps(this.journey, () => {
        super.handler(req, res, next);
      });
    } else {
      super.handler(req, res, next);
    }
  }

  static get path() {
    return paths.checkYourAppeal;
  }

  get middleware() {
    const mw = [ ...super.middleware ];
    if (this.journey.settings.useCsrfToken) {
      mw.push(csrfProtection);
    }
    return mw;
  }

  get csurfCsrfToken() {
    return this.req.csrfToken && this.req.csrfToken();
  }

  get termsAndConditionPath() {
    return paths.policy.termsAndConditions;
  }

  tokenHeader(req) {
    const header = {};
    const authTokenString = '__auth-token';

    if (req.cookies && req.cookies[authTokenString]) {
      header.Authorization = `Bearer ${req.cookies[authTokenString]}`;
    }
    return header;
  }

  validateJourneyValues() {
    if (typeof this.journey.values.hearing === 'undefined' ||
      !this.journey.values.hearing) {
      logger.exception(new Error(`Missing hearing values from Check Your Appeal for' +
        'SessionId ${this.journey.req.session.id} and nino ${this.journey.values.appellant.nino}`));
      logger.event('SYA-Missing-Answers-At-CheckYourAppeal');
    }
  }

  sendToAPI() {
    this.validateJourneyValues();
    const headers = this.tokenHeader(this.req);

    const values = this.journey.values;

    if (this.journey.req && this.journey.req.session) {
      values.ccdCaseId = this.journey.req.session.ccdCaseId;
    }

    logger.trace([
      'About to send to api the application with session id ',
      get(this, 'journey.req.session.id'),
      'the NINO is ',
      get(this, 'journey.values.appellant.nino'),
      'the benefit code is',
      get(this, 'journey.values.benefitType.code'),
      'the draft case id is',
      get(values, 'ccdCaseId')
    ], logPath);

    const spinner = new Spinner(spinnerOptions).spin(this);

    return request.post(this.journey.settings.apiUrl)
      .retry(httpRetries, retryDelay)
      .set(headers)
      .send(values)
      .then(result => {
        logger.trace([
          'Successfully submitted application for session id',
          get(this, 'journey.req.session.id'),
          'and nino',
          get(this, 'journey.values.appellant.nino'),
          'the benefit code is',
          get(this, 'journey.values.benefitType.code'),
          'the status is ',
          result.status
        ], logPath);
        logger.trace(
          `POST api:${this.journey.settings.apiUrl} status:${result.status}`, logPath);
        logger.event('SYA-SendToApi-Success');
        spinner.stop();
      }).catch(error => {
        const errMsg =
          `${error.message} status:${error.status || HttpStatus.INTERNAL_SERVER_ERROR}`;

        logger.exception([
          'Error on submission:',
          get(this, 'journey.req.session.id'),
          errMsg,
          'the NINO is',
          get(this, 'journey.values.appellant.nino'),
          'the benefit code is ',
          get(this, 'journey.values.benefitType.code')
        ], logPath);

        const metricEvent = (error.status === HttpStatus.CONFLICT) ? 'SYA-SendToApi-Duplicate' : 'SYA-SendToApi-Failed';
        logger.event(metricEvent);
        spinner.stop();
        return Promise.reject(error);
      });
  }

  sections() {
    return [
      section(sections.benefitType, { title: this.content.benefitType }),
      section(sections.mrnDate, { title: this.content.compliance.mrnDate }),
      section(sections.noMRN, { title: this.content.compliance.noMRN }),
      section(sections.appellantDetails, { title: this.content.appellantDetails }),
      section(sections.appointeeDetails, { title: this.content.appointeeDetails }),
      section(sections.textMsgReminders, { title: this.content.smsNotify.textMsgReminders }),
      section(sections.representative, { title: this.content.representative }),
      section(sections.reasonsForAppealing, { title: this.content.reasonsForAppealing }),
      section(sections.theHearing, { title: this.content.hearing.theHearing }),
      section(sections.hearingArrangements, { title: this.content.hearing.arrangements })
    ];
  }

  get form() {
    return form({

      signer: text.joi(
        this.content.fields.signer.error.required,
        Joi.string().regex(lastName).trim().required()
      )
    });
  }

  values() {
    let saveAndReturnFlag = 'No';
    if (this.req.idam) {
      saveAndReturnFlag = 'Yes';
    }
    return {
      signAndSubmit: {
        signer: this.fields.signer.value
      },
      isSaveAndReturn: saveAndReturnFlag
    };
  }

  next() {
    return action(this.sendToAPI)
      .then(goTo(this.journey.steps.Confirmation))
      .onFailure((error, req, res, next) => {
        logger.exception(error, logPath);
        if (error.status === HttpStatus.CONFLICT) {
          redirectTo(this.journey.steps.DuplicateError).redirect(req, res, next);
        } else {
          redirectTo(this.journey.steps.Error500).redirect(req, res, next);
        }
      });
  }
}

module.exports = CheckYourAppeal;

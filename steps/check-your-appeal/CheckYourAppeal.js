const {
  CheckYourAnswers: CYA,
  section
} = require('@hmcts/one-per-page/checkYourAnswers');

const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo, action, redirectTo } = require('@hmcts/one-per-page/flow');
const { lastName } = require('utils/regex');
const { get } = require('lodash');
const sections = require('steps/check-your-appeal/sections');
const logger = require('logger');

const logPath = 'CheckYourAppeal.js';
const HttpStatus = require('http-status-codes');
const request = require('superagent');
const paths = require('paths');
const Joi = require('joi');
const csurf = require('csurf');

const csrfProtection = csurf({ cookie: false });

class CheckYourAppeal extends CYA {
  constructor(...args) {
    super(...args);
    this.sendToAPI = this.sendToAPI.bind(this);
  }

  static get path() {
    return paths.checkYourAppeal;
  }

  get middleware() {
    const mw = [...super.middleware];
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

  sendToAPI() {
    logger.trace([
      'About to send to api the application with session id ',
      get(this, 'journey.req.session.id'),
      'the NINO is ',
      get(this, 'journey.values.appellant.nino'),
      'the benefit code is',
      get(this, 'journey.values.benefitType.code')
    ], logPath);
    return request.post(this.journey.settings.apiUrl).send(this.journey.values)
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
    return {
      signAndSubmit: {
        signer: this.fields.signer.value
      }
    };
  }

  next() {
    return action(this.sendToAPI)
      .then(goTo(this.journey.steps.Confirmation))
      .onFailure(redirectTo(this.journey.steps.Error500));
  }
}

module.exports = CheckYourAppeal;

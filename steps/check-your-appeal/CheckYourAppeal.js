const {
  CheckYourAnswers: CYA,
  section
} = require('@hmcts/one-per-page/checkYourAnswers');

const { form, text } = require('@hmcts/one-per-page/forms');
const { goTo, action } = require('@hmcts/one-per-page/flow');
const { Logger } = require('@hmcts/nodejs-logging');
const { lastName } = require('utils/regex');
const sections = require('steps/check-your-appeal/sections');
const appInsights = require('app-insights');
const HttpStatus = require('http-status-codes');
const request = require('superagent');
const paths = require('paths');
const Joi = require('joi');

class CheckYourAppeal extends CYA {
  constructor(...args) {
    super(...args);
    this.logger = Logger.getLogger('CheckYourAppeal.js');
    this.sendToAPI = this.sendToAPI.bind(this);
  }

  static get path() {
    return paths.checkYourAppeal;
  }

  get termsAndConditionPath() {
    return paths.policy.termsAndConditions;
  }

  sendToAPI() {
    return request.post(this.journey.settings.apiUrl).send(this.journey.values).then(result => {
      this.logger.info(`POST api:${this.journey.settings.apiUrl} status:${result.status}`);
    }).catch(error => {
      const errMsg = `${error.message} status:${error.status || HttpStatus.INTERNAL_SERVER_ERROR}`;
      appInsights.trackException(errMsg);
      this.logger.error(errMsg);
      return Promise.reject(error);
    });
  }

  sections() {
    return [
      section(sections.benefitType, { title: this.content.benefitType }),
      section(sections.mrnDate, { title: this.content.compliance.mrnDate }),
      section(sections.noMRN, { title: this.content.compliance.noMRN }),
      section(sections.appellantDetails, { title: this.content.appellantDetails }),
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
      .onFailure(goTo(this.journey.steps.Error500));
  }
}

module.exports = CheckYourAppeal;

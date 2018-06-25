const { Question, branch, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { postCode } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');
const request = require('request');
const config = require('config');
const { Logger } = require('@hmcts/nodejs-logging');

const postcodeCountryLookupUrl = config.get('postcodeChecker.url');
const postcodeCountryLookupToken = config.get('postcodeChecker.token');
const postcodeCountryLookupAllowedCountries = config.get('postcodeChecker.allowedCountries');

const logger = Logger.getLogger('PostcodeChecker.js');

class BranchForEnglandOrWales {
  constructor(postcode, englandOrWalesStep, otherStep, errorStep) {
    this.postcode = postcode;
    this.englandOrWalesStep = englandOrWalesStep;
    this.otherStep = otherStep;
    this.errorStep = errorStep;
  }

  isEnglandOrWalesPostcode() {
    const postcode = this.postcode;
    return new Promise((resolve, reject) => {
      request.get({
        headers: {
          Authorization: `Token ${postcodeCountryLookupToken}`
        },
        url: `${postcodeCountryLookupUrl}/${postcode}`
      }, (error, resp, body) => {
        if (error) {
          return reject(error);
        }
        const postcodeLook = JSON.parse(body);

        const country = postcodeLook.country.name.toLocaleLowerCase();
        return resolve(
          postcodeCountryLookupAllowedCountries.includes(country)
        );
      });
    });
  }

  redirect(req, res) {
    this.isEnglandOrWalesPostcode().then(isEnglandOrWalesPostcode => {
      branch(
        goTo(this.englandOrWalesStep).if(isEnglandOrWalesPostcode),
        goTo(this.otherStep)
      ).redirect(req, res);
    }).catch(error => {
      logger.error(error);
      goTo(this.errorStep).redirect(req, res);
    });
  }
}

class PostcodeChecker extends Question {
  static get path() {
    return paths.start.postcodeCheck;
  }

  get form() {
    return form({
      postcode: text
        .joi(this.content.fields.postcode.error.emptyField, Joi.string().required())
        .joi(this.content.fields.postcode.error.invalid, Joi.string().trim().regex(postCode))
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {
      postCodeCheck: this.fields.postcode.value
    };
  }

  next() {
    return new BranchForEnglandOrWales(
      this.fields.postcode.value,
      this.journey.steps.Appointee,
      this.journey.steps.InvalidPostcode,
      this.journey.steps.Error500
    );
  }
}

module.exports = PostcodeChecker;

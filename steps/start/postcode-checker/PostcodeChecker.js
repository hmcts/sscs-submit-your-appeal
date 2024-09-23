const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { branch, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { postCode, inwardPostcode } = require('utils/regex');
const postcodeList = require('steps/start/postcode-checker/validPostcodeList');
const Joi = require('joi');
const paths = require('paths');
const config = require('config');
const BranchForEnglandOrWales = require('steps/start/postcode-checker/BranchForEnglandOrWales');

const usePostcodeChecker = config.get('postcodeChecker.enabled');
const allowedRpcs = config.get('postcodeChecker.allowedRpcs');
const { includes } = require('lodash');
const benefitTypeUtils = require('utils/benefitTypeUtils');

class PostcodeChecker extends SaveToDraftStore {
  static get path() {
    return paths.start.postcodeCheck;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && benefitTypeUtils.isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }

  get form() {
    return form({
      postcode: text
        .joi(this.content.fields.postcode.error.emptyField, Joi.string().required())
        .joi(this.content.fields.postcode.error.invalid, Joi.string().trim().regex(postCode))
    });
  }

  get isGlasgowIncluded() {
    return includes(allowedRpcs, 'glasgow');
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
    if (usePostcodeChecker) {
      return new BranchForEnglandOrWales(
        this.fields.postcode.value,
        this.journey.steps.Independence,
        this.journey.steps.InvalidPostcode,
        this.journey.steps.Error500
      );
    }

    const postcode = this.fields.postcode.value;
    const outcode = postcode.trim().replace(inwardPostcode, '').replace(/\s+/, '');
    const isPostcodeOnList = () => postcodeList.includes(outcode.toUpperCase());

    return branch(
      goTo(this.journey.steps.Independence).if(isPostcodeOnList),
      goTo(this.journey.steps.InvalidPostcode)
    );
  }
}

module.exports = PostcodeChecker;

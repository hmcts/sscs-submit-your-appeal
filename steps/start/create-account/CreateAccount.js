const { redirectTo } = require('@hmcts/one-per-page/flow');
const { goTo, branch } = require('@hmcts/one-per-page');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const { get } = require('lodash');
const benefitTypes = require('../benefit-type/types');

class CreateAccount extends SaveToDraftStore {
  static get path() {
    return paths.start.createAccount;
  }

  get form() {
    return form({
      createAccount: text.joi(
        this.content.fields.createAccount.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {};
  }

  get isTypeIba() {
    const benefitType = get(this, 'journey.req.session.BenefitType.benefitType');
    return benefitType === benefitTypes.infectedBloodAppeal;
  }

  next() {
    const createAccount = this.fields.createAccount.value === 'yes';

    return branch(
      redirectTo(this.journey.steps.IdamRedirect).if(createAccount),
      goTo(this.journey.steps.HaveAMRN)
    );
  }
}

module.exports = CreateAccount;

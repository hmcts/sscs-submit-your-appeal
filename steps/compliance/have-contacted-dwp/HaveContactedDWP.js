const { Question } = require('@hmcts/one-per-page/steps');
const { redirectTo, goTo, branch } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

const requestHandler = require('middleware/services/parseRequest');

const {
  restoreFromDraftStore,
  saveSessionToDraftStore,
  saveSessionToDraftStoreAndClose,
  saveSessionToDraftStoreAndReply
} = require('middleware/draftPetitionStoreMiddleware');


class HaveContactedDWP extends Question {
  static get path() {
    return paths.compliance.haveContactedDWP;
  }

  get form() {
    return form({

      haveContactedDWP: text.joi(
        this.content.fields.haveContactedDWP.error.required,
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


  next() {
    const hasContactDWP = this.fields.haveContactedDWP.value === userAnswer.YES;
    return branch(
      redirectTo(this.journey.steps.NoMRN).if(hasContactDWP),
      goTo(this.journey.steps.ContactDWP)
    );
  }

  parseRequest(req) {
    return requestHandler.parse(this, req);
  }

  get middleware() {
    return [
      ...super.middleware,
      restoreFromDraftStore,
      saveSessionToDraftStoreAndClose
    ];
  }

  get postMiddleware() {
    return [
      ...super.middleware,
      saveSessionToDraftStore,
      saveSessionToDraftStoreAndReply
    ];
  }
}

module.exports = HaveContactedDWP;

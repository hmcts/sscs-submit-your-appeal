const { branch } = require('@hmcts/one-per-page');
const { goTo, redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { titleise } = require('utils/stringUtils');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const sections = require('steps/check-your-appeal/sections');
const i18next = require('i18next');

class TheHearing extends SaveToDraftStore {
  static get path() {
    return paths.hearing.theHearing;
  }

  get form() {
    return form({
      attendHearing: text.joi(
        this.content.fields.attendHearing.error.required,
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    const content = require(`./content.${i18next.language}`);

    return [
      answer(this, {
        question: this.content.cya.attendHearing.question,
        section: sections.theHearing,
        answer: titleise(content.cya.attendHearing[this.fields.attendHearing.value])
      })
    ];
  }

  values() {
    return {
      hearing: {
        wantsToAttend: this.getWantsToAttendValue(this.fields.attendHearing.value)
      }
    };
  }

  getWantsToAttendValue(attendHearingValue) {
    if (attendHearingValue === userAnswer.YES) return true;
    if (attendHearingValue === userAnswer.NO) return false;
    return null;
  }

  next() {
    const isAttendingHearing = () => this.fields.attendHearing.value === userAnswer.YES;
    return branch(
      goTo(this.journey.steps.HearingOptions).if(isAttendingHearing()),
      goTo(this.journey.steps.HearingSupport).if(isAttendingHearing()),
      redirectTo(this.journey.steps.NotAttendingHearing)
    );
  }
}

module.exports = TheHearing;

const { goTo } = require('@hmcts/one-per-page');
const { form, date, convert } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const DateUtils = require('utils/DateUtils');

class AppointeeDOB extends SaveToDraftStore {
  static get path() {
    return paths.appointee.enterAppointeeDOB;
  }

  get form() {
    const fields = this.content.fields;
    return form({
      date: convert(
        d => DateUtils.createMoment(d.day, DateUtils.getMonthValue(d), d.year),
        date.required({
          allRequired: fields.date.error.allRequired,
          dayRequired: fields.date.error.dayRequired,
          monthRequired: fields.date.error.monthRequired,
          yearRequired: fields.date.error.yearRequired
        })
      ).check(
        fields.date.error.invalid,
        value => DateUtils.isDateValid(value)
      ).check(
        fields.date.error.future,
        value => DateUtils.isDateInPast(value)
      )
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.dob.question,
        section: sections.appointeeDetails,
        answer: this.fields.date.value.format('DD MMMM YYYY')
      })
    ];
  }

  values() {
    if (!this.valid) return {};

    return {
      appointee: {
        dob: this.fields.date.value.format('DD-MM-YYYY')
      }
    };
  }

  next() {
    return goTo(this.journey.steps.AppointeeContactDetails);
  }
}

module.exports = AppointeeDOB;

const { goTo } = require('lib/vendor/one-per-page');
const { form, date, convert } = require('lib/vendor/one-per-page/forms');
const { answer } = require('lib/vendor/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const DateUtils = require('utils/DateUtils');
const i18next = require('i18next');
const { isIba } = require('utils/benefitTypeUtils');

class AppointeeDOB extends SaveToDraftStore {
  static get path() {
    return paths.appointee.enterAppointeeDOB;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }

  get form() {
    const fields = this.content.fields;
    return form({
      date: convert(
        d =>
          DateUtils.createMoment(
            d.day,
            DateUtils.getMonthValue(d, i18next.language),
            d.year,
            i18next.language
          ),
        date.required({
          allRequired: fields.date.error.allRequired,
          dayRequired: fields.date.error.dayRequired,
          monthRequired: fields.date.error.monthRequired,
          yearRequired: fields.date.error.yearRequired
        })
      )
        .check(fields.date.error.invalid, value =>
          DateUtils.isDateValid(value)
        )
        .check(fields.date.error.future, value =>
          DateUtils.isDateInPast(value)
        )
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.dob.question,
        section: sections.appointeeDetails,
        answer: DateUtils.formatDate(this.fields.date.value, 'DD MMMM YYYY')
      })
    ];
  }

  values() {
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

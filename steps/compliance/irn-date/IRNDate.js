const { goTo, branch, redirectTo } = require('@hmcts/one-per-page/flow');
const { form, date, convert } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const i18next = require('i18next');
const { isIba } = require('utils/benefitTypeUtils');

class IRNDate extends SaveToDraftStore {
  static get path() {
    return paths.compliance.irnDate;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && !isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }

  get form() {
    const fields = this.content.fields;

    return form({
      irnDate: convert(
        d => DateUtils.createMoment(d.day, DateUtils.getMonthValue(d, i18next.language), d.year, i18next.language),
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
      ).check(
        fields.date.error.dateSameAsImage,
        value => !DateUtils.mrnDateSameAsImage(value)
      )
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.irnDate.question,
        section: sections.irnDate,
        answer: DateUtils.formatDate(this.fields.irnDate.value, 'DD MMMM YYYY')
      })
    ];
  }

  values() {
    return {
      irn: {
        date: this.fields.irnDate.value.format('DD-MM-YYYY'),
        dateAppealSubmitted: DateUtils.getCurrentDate()
      }
    };
  }

  next() {
    const irnDate = this.fields.irnDate.value;
    const isLessThanOrEqualToAMonth = DateUtils.isLessThanOrEqualToAMonth(irnDate);

    return branch(
      goTo(this.journey.steps.AppellantName).if(isLessThanOrEqualToAMonth),
      redirectTo(this.journey.steps.CheckIRN)
    );
  }
}

module.exports = IRNDate;

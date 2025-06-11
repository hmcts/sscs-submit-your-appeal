const { goTo } = require('@hmcts/one-per-page');
const { form, date, convert } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { get } = require('lodash');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const DateUtils = require('utils/DateUtils');
const i18next = require('i18next');
const { branch } = require('@hmcts/one-per-page/flow');
const { isIba } = require('utils/benefitTypeUtils');

class AppellantDOB extends SaveToDraftStore {
  static get path() {
    return paths.identity.enterAppellantDOB;
  }

  isAppointee() {
    return (
      String(get(this, 'journey.req.session.Appointee.isAppointee')) === 'yes'
    );
  }

  contentPrefix() {
    return this.isAppointee() ? 'withAppointee' : 'withoutAppointee';
  }

  get title() {
    return this.content.title[this.contentPrefix()];
  }

  get form() {
    const fields = this.content.fields;
    const error = fields.date.error[this.contentPrefix()];
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
          allRequired: error.allRequired,
          dayRequired: error.dayRequired,
          monthRequired: error.monthRequired,
          yearRequired: error.yearRequired
        })
      )
        .check(error.invalid, value => DateUtils.isDateValid(value))
        .check(error.future, value => DateUtils.isDateInPast(value))
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.dob.question,
        section: sections.appellantDetails,
        answer: DateUtils.formatDate(this.fields.date.value, 'DD MMMM YYYY')
      })
    ];
  }

  values() {
    return {
      appellant: {
        dob: this.fields.date.value.format('DD-MM-YYYY')
      }
    };
  }

  next() {
    const isIbaCase = () => isIba(this.req);
    return branch(
      goTo(this.journey.steps.AppellantInMainlandUk).if(isIbaCase),
      goTo(this.journey.steps.AppellantNINO)
    );
  }
}

module.exports = AppellantDOB;

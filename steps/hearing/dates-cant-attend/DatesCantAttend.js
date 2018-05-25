/* eslint-disable no-undefined */

const { AddAnother } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page');
const { date, convert } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const UKBankHolidays = require('@hmcts/uk-bank-holidays');
const sections = require('steps/check-your-appeal/sections');
const DateUtils = require('utils/DateUtils');
const content = require('steps/hearing/dates-cant-attend/content.en');

const paths = require('paths');

class DatesCantAttend extends AddAnother {
  constructor(...args) {
    super(...args);
    this.loadBankHolidayDates();
  }

  loadBankHolidayDates() {
    this.ukBankHolidays = new UKBankHolidays(['england-and-wales']);
    this.ukBankHolidays.load();
  }

  static get path() {
    return paths.hearing.datesCantAttend;
  }

  get addAnotherLinkContent() {
    if (this.fields.items !== undefined) {
      return this.fields.items.value.length > 0 ? content.links.addAnother : content.links.add;
    }
    return false;
  }

  get field() {
    const fields = this.content.fields;
    return convert(
      d => DateUtils.createMoment(d.day, DateUtils.getMonthValue(d), d.year),
      date.required({
        allRequired: fields.cantAttendDate.error.allRequired,
        dayRequired: fields.cantAttendDate.error.dayRequired,
        monthRequired: fields.cantAttendDate.error.monthRequired,
        yearRequired: fields.cantAttendDate.error.yearRequired
      })
    ).check(
      fields.cantAttendDate.error.invalid,
      value => DateUtils.isDateValid(value)
    ).check(
      fields.cantAttendDate.error.underFourWeeks,
      value => DateUtils.isGreaterThanOrEqualToFourWeeks(value)
    ).check(
      fields.cantAttendDate.error.overTwentyTwoWeeks,
      value => DateUtils.isLessThanOrEqualToTwentyTwoWeeks(value)
    ).check(
      fields.cantAttendDate.error.weekend,
      value => !DateUtils.isDateOnTheWeekend(value)
    ).check(
      fields.cantAttendDate.error.bankHoliday,
      value => !this.ukBankHolidays.isDateABankHoliday(value)
    );
  }

  validateList(list) {
    return list.check(content.listError, arr => arr.length > 0);
  }

  answers() {
    const orderedItems = DateUtils.sortDates(this.fields.items.value);
    return [
      answer(this, {
        question: this.content.cya.dateYouCantAttend.question,
        section: sections.theHearing,
        answer: orderedItems.map(d => d.format('DD MMMM YYYY')),
        url: paths.hearing.hearingAvailability
      })
    ];
  }

  values() {
    const datesCantAttend = this.fields.items.value.map(d => d.format('DD-MM-YYYY'));
    if (datesCantAttend.length === 0) {
      return {};
    }
    return {
      hearing: {
        datesCantAttend
      }
    };
  }

  next() {
    return goTo(this.journey.steps.CheckYourAppeal);
  }
}

module.exports = DatesCantAttend;

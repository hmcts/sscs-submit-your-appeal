/* eslint-disable no-magic-numbers */

const { long, short } = require('utils/months');
const { includes } = require('lodash');
const moment = require('moment');
const crypto = require('crypto');

const mrnDateImage = require('steps/compliance/mrn-date/mrnDateOnImage');

class DateUtils {
  static isLessThanOrEqualToAMonth(mDate) {
    return moment().subtract(1, 'month').isSameOrBefore(mDate, 'day');
  }

  static isLessThanOrEqualToThirteenMonths(mDate) {
    return moment().subtract(13, 'month').isSameOrBefore(mDate, 'day');
  }

  static createMoment(day, month, year, language = 'en') {
    if (language !== 'en') {
      require(`moment/locale/${language}`);
    }
    moment.locale(language);

    return moment(`${day}-${month}-${year}`, 'D-M-YYYY', true);
  }

  static oneDayShortOfAMonthAgo() {
    return moment().subtract(1, 'month').add(1, 'day');
  }

  static oneMonthAgo(language) {
    moment.locale(language);

    return moment().subtract(1, 'month');
  }

  static getRandomDateInLast30Days(language) {
    moment.locale(language);
    return moment().subtract(DateUtils.getRandomInt(1, 30), 'days');
  }

  static oneMonthAndOneDayAgo(language) {
    moment.locale(language);

    return moment().subtract(1, 'month').subtract(1, 'day');
  }

  static oneDayShortOfThirteenMonthsAgo() {
    return moment().subtract(13, 'month').add(1, 'day');
  }

  static thirteenMonthsAgo() {
    return moment().subtract(13, 'month');
  }

  static thirteenMonthsAndOneDayAgo(language) {
    moment.locale(language);

    return moment().subtract(13, 'month').subtract(1, 'day');
  }

  static isDateValid(date) {
    return date.isValid();
  }

  static isDateInPast(date) {
    return moment().isSameOrAfter(date, 'day');
  }

  static mrnDateSameAsImage(date, isIbaDate) {
    const dateObject = isIbaDate ? mrnDateImage.rdnDate : mrnDateImage.mrnDate;
    const imageDate = this.createMoment(
      dateObject.day,
      dateObject.month,
      dateObject.year
    );
    return imageDate.isSame(date);
  }

  static isGreaterThanOrEqualToFourWeeks(date) {
    const dateFourWeeksLater = moment().add(4, 'weeks');
    return date.isSameOrAfter(dateFourWeeksLater, 'day');
  }

  static isLessThanOrEqualToTwentyTwoWeeks(date) {
    const dateTwentyTwoWeeksLater = moment().add(22, 'weeks');
    return date.isSameOrBefore(dateTwentyTwoWeeksLater, 'day');
  }

  static isDateOnTheWeekend(date, language) {
    if (language === 'cy') {
      return date.weekday() === 5 || date.weekday() === 6;
    }

    return date.weekday() === 0 || date.weekday() === 6;
  }

  static getRandomWeekDayFromDate(date) {
    return date.clone().weekday(DateUtils.getRandomInt(3, 4));
  }

  static getRandomInt(min, max) {
    return (
      Math.floor(
        (crypto.randomBytes(4).readUInt32LE() / 0x100000000) * (max - min + 1)
      ) + min
    );
  }

  static getMonthValue(date, language) {
    moment.locale(language);
    const months = long[language].concat(short[language]);
    let monthValue = null;

    if (isNaN(date.month)) {
      const month = date.month.toLowerCase();

      if (includes(months, month)) {
        monthValue =
          moment(`${date.day} ${month} ${date.year}`, 'DD MMMM YY').month() + 1;
      } else {
        monthValue = false;
      }
    } else {
      monthValue = date.month;
    }
    return monthValue;
  }

  static getDateInMilliseconds(mDate) {
    return mDate.valueOf();
  }

  static sortDates(dates) {
    return dates.sort((date1, date2) => {
      if (date1 > date2) return 1;
      if (date1 < date2) return -1;
      return 0;
    });
  }

  static getCurrentDate(language) {
    moment.locale(language);
    return moment().format('DD-MM-YYYY');
  }

  static formatDate(date, format) {
    return date.format(format);
  }
}

module.exports = DateUtils;

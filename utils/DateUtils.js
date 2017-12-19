const moment = require('moment');

class DateUtils {

    static isLessThanOrEqualToAMonth(mDate) {
        return moment().subtract(1, 'month').isSameOrBefore(mDate, 'day');
    }

    static isLessThanOrEqualToThirteenMonths(mDate) {
        return moment().subtract(13, 'month').isSameOrBefore(mDate, 'day');
    }

    static createMoment(day, month, year) {
        return moment(`${day}-${month}-${year}`, 'D-M-YYYY', true);
    }

    static oneDayShortOfAMonthAgo() {
        return moment().subtract(1, 'month').add(1, 'day');
    }

    static oneMonthAgo() {
        return moment().subtract(1, 'month');
    }

    static oneMonthAndOneDayAgo() {
        return moment().subtract(1, 'month').subtract(1, 'day');
    }

    static oneDayShortOfThirteenMonthsAgo() {
        return moment().subtract(13, 'month').add(1, 'day');
    }

    static thirteenMonthsAgo() {
        return moment().subtract(13, 'month');
    }

    static thirteenMonthsAndOneDayAgo() {
        return moment().subtract(13, 'month').subtract(1, 'day');
    }

    static isDateValid(date) {
        return this.createMoment(date.day, date.month, date.year).isValid();
    }

    static isDateInPast(date) {
        const today = moment();
        const mDate = this.createMoment(date.day, date.month, date.year);
        return today.diff(mDate, 'days') > 0;
    }

}

module.exports = DateUtils;

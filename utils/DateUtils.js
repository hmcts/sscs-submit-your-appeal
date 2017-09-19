const moment = require('moment');

class DateUtils {

    static isLessThanOrEqualToAMonth(mDate) {
        return moment().subtract(1, 'month').isSameOrBefore(mDate, 'day');
    }

    static isLessThanOrEqualToThirteenMonths(mDate) {
        return moment().subtract(13, 'month').isSameOrBefore(mDate, 'day');
    }

    static createMoment(day, month, year) {
        return moment(`${day}-${month}-${year}`, 'DD-MM-YYYY');
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

}

module.exports = DateUtils;

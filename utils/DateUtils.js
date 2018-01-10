const moment = require('moment');
const mrnDateImage = require('steps/compliance/mrn-date/mrnDateOnImage');

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
        return date.isValid();
    }

    static isDateInPast(date) {
        const today = moment().startOf('day');
        return today.isAfter(date);
    }

    static mrnDateDifferentToImage(date) {
        const imageDate = this.createMoment(mrnDateImage.day, mrnDateImage.month, mrnDateImage.year);
        return !imageDate.isSame(date);
    }

}

module.exports = DateUtils;

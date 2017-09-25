const {expect} = require('test/chai-sinon');
const DateUtils = require('utils/DateUtils');

describe('DateUtils.js', () => {

    describe('MRN date that is <= a calendar month', () => {

        it('should return true when the MRN date is one day short of a month', () => {
            expect(DateUtils.isLessThanOrEqualToAMonth(DateUtils.oneDayShortOfAMonthAgo())).to.be.true;
        });

        it('should return true when the MRN date is exactly one month', () => {
            expect(DateUtils.isLessThanOrEqualToAMonth(DateUtils.oneMonthAgo())).to.be.true;
        });

        it('should return false when the MRN date is 1 month and 1 day', () => {
            expect(DateUtils.isLessThanOrEqualToAMonth(DateUtils.oneMonthAndOneDayAgo())).to.be.false;
        });

    });

    describe('MRN date that is <= 13 calendar months', () => {

        it('should return true when the MRN date is one day short of 13 months', () => {
            expect(DateUtils.isLessThanOrEqualToThirteenMonths(DateUtils.oneDayShortOfThirteenMonthsAgo())).to.be.true;
        });

        it('should return true when the MRN date is exactly 13 months', () => {
            expect(DateUtils.isLessThanOrEqualToThirteenMonths(DateUtils.thirteenMonthsAgo())).to.be.true;
        });

        it('should return false when the MRN date is 13 months and 1 day', () => {
            expect(DateUtils.isLessThanOrEqualToThirteenMonths(DateUtils.thirteenMonthsAndOneDayAgo())).to.be.false;
        });

    });

});

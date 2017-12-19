const { expect } = require('test/util/chai');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');

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

    describe('isDateValid', () => {

        let date;

        before(() => {
            date = {};
        });

        it('should return true when date is a leap year', () => {
            date.day = '29';
            date.month = '2';
            date.year = '2000';
            expect(DateUtils.isDateValid(date)).to.be.true;
        });

        describe('day', () => {

            before(() => {
                date.month = '3';
                date.year = '2000';
            });

            it('should return true when day is a single digit', () => {
                date.day = '1';
                expect(DateUtils.isDateValid(date)).to.be.true;
            });

            it('should return true when day is double digits', () => {
                date.day = '12';
                expect(DateUtils.isDateValid(date)).to.be.true;
            });

            it('should return false when invalid day is added', () => {
                date.day = '35';
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

            it('should return false when day is a non-numeric character', () => {
                date.day = 'a';
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

        });

        describe('month', () => {

            before(() => {
                date.day = '15';
                date.year = '2000';
            });

            it('should return true when month is a single digit', () => {
                date.month = '1';
                expect(DateUtils.isDateValid(date)).to.be.true;
            });

            it('should return true when month is double digits', () => {
                date.month = '12';
                expect(DateUtils.isDateValid(date)).to.be.true;
            });

            it('should return false when invalid month is added', () => {
                date.month = '35';
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

            it('should return false when month is a non-numeric character', () => {
                date.month = 'a';
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

        });

        describe('year', () => {

            before(() => {
                date.day = '15';
                date.month = '12';
            });

            it('should return false when year is a single digit', () => {
                date.year = '1';
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

            it('should return false when month is double digits', () => {
                date.year = '12';
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

            it('should return false when month is triple digits', () => {
                date.year = '121';
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

            it('should return true when month is quadruple digits', () => {
                date.year = '1999';
                expect(DateUtils.isDateValid(date)).to.be.true;
            });

            it('should return false when year is a non-numeric character', () => {
                date.year = 'a';
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

        });

    });

    describe('isDateInPast', () => {

        let date;

        before(() => {
            date = {};
            date.day = '29';
            date.month = '3';
        });

        it('should return false if date is in the future', () => {
            date.year = '3700';
            expect(DateUtils.isDateInPast(date)).to.be.false;
        });

        it('should return true if date is in the past', () => {
            date.year = '1999';
            expect(DateUtils.isDateInPast(date)).to.be.true;
        });

        it('should return false if date is in the present', () => {
            const today = moment();
            date.day =  today.date();
            date.month =  today.month() + 1;
            date.year =  today.year();
            expect(DateUtils.isDateInPast(date)).to.be.false;
        });

    });


});

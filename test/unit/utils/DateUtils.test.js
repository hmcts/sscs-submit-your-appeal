const { expect } = require('test/util/chai');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const mrnDateImage = require('steps/compliance/mrn-date/mrnDateOnImage');

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
        let day;
        let month;
        let year;

        before(() => {
           day = '29';
           month = '2';
           year = '2000';
        });

        it('should return true when date is a leap year', () => {
            date = DateUtils.createMoment(day, month, year);
            expect(DateUtils.isDateValid(date)).to.be.true;
        });

        describe('day', () => {

            it('should return true when day is a single digit', () => {
                day = '1';
                date = DateUtils.createMoment(day, month, year);
                expect(DateUtils.isDateValid(date)).to.be.true;
            });

            it('should return true when day is double digits', () => {
                day = '12';
                date = DateUtils.createMoment(day, month, year);
                expect(DateUtils.isDateValid(date)).to.be.true;
            });

            it('should return false when invalid day is added', () => {
                day = '35';
                date = DateUtils.createMoment(day, month, year);
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

            it('should return false when day is a non-numeric character', () => {
                day = 'a';
                date = DateUtils.createMoment(day, month, year);
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

        });

        describe('month', () => {

            before(() => {
                day = '15';
                year = '2000';
            });

            it('should return true when month is a single digit', () => {
                month = '1';
                date = DateUtils.createMoment(day, month, year);
                expect(DateUtils.isDateValid(date)).to.be.true;
            });

            it('should return true when month is double digits', () => {
                month = '10';
                date = DateUtils.createMoment(day, month, year);
                expect(DateUtils.isDateValid(date)).to.be.true;
            });

            it('should return false when invalid month is added', () => {
                month = '35';
                date = DateUtils.createMoment(day, month, year);
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

            it('should return false when month is a non-numeric character', () => {
                month = 'a';
                date = DateUtils.createMoment(day, month, year);
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

        });

        describe('year', () => {

            before(() => {
                day = '15';
                month = '10';
            });

            it('should return false when year is a single digit', () => {
                year = '1';
                date = DateUtils.createMoment(day, month, year);
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

            it('should return false when month is double digits', () => {
                year = '12';
                date = DateUtils.createMoment(day, month, year);
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

            it('should return false when month is triple digits', () => {
                year = '121';
                date = DateUtils.createMoment(day, month, year);
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

            it('should return true when month is quadruple digits', () => {
                year = '1999';
                date = DateUtils.createMoment(day, month, year);
                expect(DateUtils.isDateValid(date)).to.be.true;
            });

            it('should return false when year is a non-numeric character', () => {
                year = 'a';
                date = DateUtils.createMoment(day, month, year);
                expect(DateUtils.isDateValid(date)).to.be.false;
            });

        });

    });

    describe('isDateInPast', () => {

        let date;
        let day;
        let month;
        let year;

        before(() => {
            day = '29';
            month = '3';
        });

        it('should return false if date is in the future', () => {
            year = '3700';
            date = DateUtils.createMoment(day, month, year);
            expect(DateUtils.isDateInPast(date)).to.be.false;
        });

        it('should return true if date is in the past', () => {
            year = '1999';
            date = DateUtils.createMoment(day, month, year);
            expect(DateUtils.isDateInPast(date)).to.be.true;
        });

        it('should return false if date is in the present', () => {
            const today = moment();
            day =  today.date();
            month =  today.month() + 1;
            year =  today.year();
            date = DateUtils.createMoment(day, month, year);
            expect(DateUtils.isDateInPast(date)).to.be.false;
        });

    });

    describe('mrnDateSameAsImage', () => {

        let date;

        it('should return true if date is the same as the image', () => {
            date = DateUtils.createMoment(mrnDateImage.day, mrnDateImage.month, mrnDateImage.year);
            expect(DateUtils.mrnDateSameAsImage(date)).to.be.true;
        });

        it('should return false if date is the different to the image', () => {
            date = moment();
            expect(DateUtils.mrnDateSameAsImage(date)).to.be.false;
        });

    });


    describe('isGreaterThanOrEqualToFourWeeks', () => {

        let date;

        it('should return false if date is under four weeks', () => {
            date = moment().add(4, 'weeks').subtract(1, 'day');
            expect(DateUtils.isGreaterThanOrEqualToFourWeeks(date)).to.be.false;
        });

        it('should return true if date is exactly four weeks', () => {
            date = moment().add(4, 'weeks');
            expect(DateUtils.isGreaterThanOrEqualToFourWeeks(date)).to.be.true;
        });

        it('should return true if date is over four weeks', () => {
            date = moment().add(4, 'weeks').add(1, 'day');
            expect(DateUtils.isGreaterThanOrEqualToFourWeeks(date)).to.be.true;
        });

    });

    describe('isLessThanOrEqualToThirtyWeeks', () => {

        let date;

        it('should return false if date is over thirty weeks', () => {
            date = moment().add(31, 'weeks');
            expect(DateUtils.isLessThanOrEqualToThirtyWeeks(date)).to.be.false;
        });

        it('should return true if date is under thirty weeks', () => {
            date = moment();
            expect(DateUtils.isLessThanOrEqualToThirtyWeeks(date)).to.be.true;
        });

        it('should return true if date is exactly thirty weeks', () => {
            date = moment().add(30, 'weeks');
            expect(DateUtils.isLessThanOrEqualToThirtyWeeks(date)).to.be.true;
        });

    });

    describe('isDateOnTheWeekend', () => {

        let date;

        it('should return true when date is on the weekend', () => {
            date = moment('20-05-2018', 'DD-MM-YYYY');
            expect(DateUtils.isDateOnTheWeekend(date)).to.be.true;
        });

        it('should return true when date is on the weekend', () => {
            date = moment('19-05-2018', 'DD-MM-YYYY');
            expect(DateUtils.isDateOnTheWeekend(date)).to.be.true;
        });

        it('should return false when date is not on the weekend', () => {
            date = moment('18-05-2018', 'DD-MM-YYYY');
            expect(DateUtils.isDateOnTheWeekend(date)).to.be.false;
        });

    });

});

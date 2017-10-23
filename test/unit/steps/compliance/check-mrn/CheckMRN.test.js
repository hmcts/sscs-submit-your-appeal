'use strict';

const { expect } = require('test/util/chai');
const CheckMRN = require('steps/compliance/check-mrn/CheckMRN');
const DateUtils = require('utils/DateUtils');
const { Reference } = require('@hmcts/one-per-page/forms');
const urls = require('urls');
const answer = require('utils/answer');

describe('CheckMRN.js', () => {

    let checkMRNClass;

    beforeEach(() => {
        checkMRNClass = new CheckMRN();
        checkMRNClass.fields = { day: {}, month: {}, year: {}, checkedMRN: {} };
        checkMRNClass.journey = {};
    });

    describe('get url()', () => {

        it('returns url /check-mrn-date', () => {
            expect(checkMRNClass.url).to.equal(urls.compliance.checkMRNDate);
        });

    });

    describe('get form()', () => {

        it('should contain 4 fields', () => {
            expect(checkMRNClass.form.fields.length).to.equal(4);
        });

        it('should contain a textField reference called \'day\'', () => {
            const textField = checkMRNClass.form.fields[0];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('day');
            expect(textField.validations).to.be.empty;
        });

        it('should contain a textField reference called \'month\'', () => {
            const textField = checkMRNClass.form.fields[1];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('month');
            expect(textField.validations).to.be.empty;
        });

        it('should contain a textField reference called \'year\'', () => {
            const textField = checkMRNClass.form.fields[2];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('year');
            expect(textField.validations).to.be.empty;
        });

        it('should contain a textField called checkedMRN', () => {
            const textField = checkMRNClass.form.fields[3];
            expect(textField.constructor.name).to.eq('FieldDesriptor');
            expect(textField.name).to.equal('checkedMRN');
            expect(textField.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        const setMRNDate = date => {
            checkMRNClass.fields.day.value = date.date();
            checkMRNClass.fields.month.value = date.month() + 1;
            checkMRNClass.fields.year.value = date.year();
        };

        describe('checkMRN field value equals yes', () => {

            beforeEach(() => {
                checkMRNClass.fields.checkedMRN.value = answer.YES;
            });

            it('returns the next step \'/mrn-over-month-late\' when the date is less than thirteen months', () => {
                setMRNDate(DateUtils.oneMonthAndOneDayAgo());
                checkMRNClass.journey.MRNOverOneMonthLate = urls.compliance.mrnOverMonthLate;
                expect(checkMRNClass.next()).to.eql({ nextStep: urls.compliance.mrnOverMonthLate });
            });

            it('returns the next step url /mrn-over-month-late when date is equal to thirteen months', () => {
                checkMRNClass.journey.MRNOverOneMonthLate = urls.compliance.mrnOverMonthLate;
                setMRNDate(DateUtils.thirteenMonthsAgo());
                expect(checkMRNClass.next()).to.eql({ nextStep: urls.compliance.mrnOverMonthLate });
            });

            it('returns the next step url /mrn-over-thirteen-months-late when date is over thirteen months', () => {
                checkMRNClass.journey.MRNOverThirteenMonthsLate = urls.compliance.mrnOverThirteenMonthsLate;
                setMRNDate(DateUtils.thirteenMonthsAndOneDayAgo());
                expect(checkMRNClass.next()).to.eql({ nextStep: urls.compliance.mrnOverThirteenMonthsLate });
            });

        });

        describe('checkMRN field value equals no', () => {

            beforeEach(() => {
                checkMRNClass.fields.checkedMRN.value = answer.NO;
            });

            it('returns the next step url /mrn-date when checkMRN value equals no', () => {
                checkMRNClass.journey.MRNDate = urls.compliance.mrnDate;
                expect(checkMRNClass.next()).to.eql({ nextStep: urls.compliance.mrnDate });
            });

        });

    });

});

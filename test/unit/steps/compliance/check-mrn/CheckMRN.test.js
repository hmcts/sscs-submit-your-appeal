'use strict';

const { expect } = require('test/util/chai');
const { Reference } = require('@hmcts/one-per-page/forms');
const CheckMRN = require('steps/compliance/check-mrn/CheckMRN');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const answer = require('utils/answer');

describe('CheckMRN.js', () => {

    let checkMRN;

    beforeEach(() => {

        checkMRN = new CheckMRN({
            journey: {
                MRNOverOneMonthLate: paths.compliance.mrnOverMonthLate,
                MRNOverThirteenMonthsLate: paths.compliance.mrnOverThirteenMonthsLate,
                MRNDate: paths.compliance.mrnDate
            }
        });

        checkMRN.fields = {
            day: {},
            month: {},
            year: {},
            checkedMRN: {}
        };
    });

    describe('get path()', () => {

        it('returns path /check-mrn-date', () => {
            expect(CheckMRN.path).to.equal(paths.compliance.checkMRNDate);
        });

    });

    describe('get form()', () => {

        it('should contain 4 fields', () => {
            expect(checkMRN.form.fields.length).to.equal(4);
        });

        it('should contain a textField reference called \'day\'', () => {
            const textField = checkMRN.form.fields[0];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('day');
            expect(textField.validations).to.be.empty;
        });

        it('should contain a textField reference called \'month\'', () => {
            const textField = checkMRN.form.fields[1];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('month');
            expect(textField.validations).to.be.empty;
        });

        it('should contain a textField reference called \'year\'', () => {
            const textField = checkMRN.form.fields[2];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('year');
            expect(textField.validations).to.be.empty;
        });

        it('should contain a textField called checkedMRN', () => {
            const textField = checkMRN.form.fields[3];
            expect(textField.constructor.name).to.eq('FieldDesriptor');
            expect(textField.name).to.equal('checkedMRN');
            expect(textField.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        const setMRNDate = date => {
            checkMRN.fields.day.value = date.date();
            checkMRN.fields.month.value = date.month() + 1;
            checkMRN.fields.year.value = date.year();
        };

        describe('checkMRN field value equals yes', () => {

            beforeEach(() => {
                checkMRN.fields.checkedMRN.value = answer.YES;
            });

            it('returns the next step \'/mrn-over-month-late\' when the date is less than thirteen months', () => {
                setMRNDate(DateUtils.oneMonthAndOneDayAgo());
                checkMRN.journey.MRNOverOneMonthLate = paths.compliance.mrnOverMonthLate;
                expect(checkMRN.next()).to.eql({ nextStep: paths.compliance.mrnOverMonthLate });
            });

            it('returns the next step path /mrn-over-month-late when date is equal to thirteen months', () => {
                checkMRN.journey.MRNOverOneMonthLate = paths.compliance.mrnOverMonthLate;
                setMRNDate(DateUtils.thirteenMonthsAgo());
                expect(checkMRN.next()).to.eql({ nextStep: paths.compliance.mrnOverMonthLate });
            });

            it('returns the next step path /mrn-over-thirteen-months-late when date is over thirteen months', () => {
                checkMRN.journey.MRNOverThirteenMonthsLate = paths.compliance.mrnOverThirteenMonthsLate;
                setMRNDate(DateUtils.thirteenMonthsAndOneDayAgo());
                expect(checkMRN.next()).to.eql({ nextStep: paths.compliance.mrnOverThirteenMonthsLate });
            });

        });

        describe('checkMRN field value equals no', () => {

            it('returns the next step path /mrn-date when checkMRN value equals no', () => {
                checkMRN.fields.checkedMRN.value = answer.NO;
                expect(checkMRN.next()).to.eql({ nextStep: paths.compliance.mrnDate });
            });

        });

    });

});

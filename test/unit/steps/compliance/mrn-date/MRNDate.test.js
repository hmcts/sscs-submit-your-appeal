'use strict';

const { expect } = require('test/util/chai');
const DateUtils = require('utils/DateUtils');
const MRNDate = require('steps/compliance/mrn-date/MRNDate');
const paths = require('paths');

describe('MRNDate.js', () => {

    let mrnDate;

    beforeEach(() => {

        mrnDate = new MRNDate({
            journey: {
                Appointee: paths.identity.areYouAnAppointee,
                CheckMRN:  paths.compliance.checkMRNDate
            }
        });
    });

    describe('get path()', () => {

        it('returns path /mrn-date', () => {
            expect(MRNDate.path).to.equal(paths.compliance.mrnDate);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
           fields = mrnDate.form.fields;
        });

        after(() => {
           fields = field = undefined;
        });

        describe('day field', () => {

            beforeEach(() => {

                field = fields[0];
            });

            it('contains the field name day', () => {
                expect(field.name).to.equal('day');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('month field', () => {

            beforeEach(() => {

                field = fields[1];
            });

            it('contains the field name month', () => {
                expect(field.name).to.equal('month');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('year field', () => {

            beforeEach(() => {

                field = fields[2];

            });

            it('contains the field name year', () => {
                expect(field.name).to.equal('year');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('next()', () => {

        const setMRNDate = date => {
            mrnDate.fields.day.value = date.date();
            mrnDate.fields.month.value = date.month() + 1;
            mrnDate.fields.year.value = date.year();
        };

        it('returns the next step path /are-you-an-appointee if date less than a month', () => {
            setMRNDate(DateUtils.oneDayShortOfAMonthAgo());
            expect(mrnDate.next().step).to.eql(paths.identity.areYouAnAppointee);
        });

        it('returns the next step path /are-you-an-appointee if date is equal to a month', () => {
            setMRNDate(DateUtils.oneMonthAgo());
            expect(mrnDate.next().step).to.eql(paths.identity.areYouAnAppointee);
        });

        it('returns the next step path /check-mrn-date if date more than a month', () => {
            setMRNDate(DateUtils.oneMonthAndOneDayAgo());
            expect(mrnDate.next().step).to.eql(paths.compliance.checkMRNDate);
        });

    });

});

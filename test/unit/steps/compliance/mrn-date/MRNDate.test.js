'use strict';

const { expect } = require('test/util/chai');
const { stub } = require('sinon');
const moment = require('moment');
const MRNDate = require('steps/compliance/mrn-date/MRNDate');
const paths = require('paths');

describe('MRNDate.js', () => {

    const mrnDate = m => {
        const date =  moment().subtract(m, 'month');
        return {
            d: date.date(),
            m: date.month() + 1,
            y: date.year()
        }
    };
    let mrnDateClass;

    beforeEach(() => {

        mrnDateClass = new MRNDate({
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
           fields = mrnDateClass.form.fields;
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

        let date;

        beforeEach(() => {
            mrnDateClass.fields = stub();
            mrnDateClass.fields.day = {};
            mrnDateClass.fields.month = {};
            mrnDateClass.fields.year = {};
        });

        it('returns the next step path /are-you-an-appointee if date less than a month', () => {
            date = mrnDate(0);
            mrnDateClass.fields.day.value = date.d;
            mrnDateClass.fields.month.value = date.m;
            mrnDateClass.fields.year.value = date.y;
            expect(mrnDateClass.next()).to.eql({ nextStep: paths.identity.areYouAnAppointee });
        });

        it('returns the next step path /are-you-an-appointee if date is equal to a month', () => {
            date = mrnDate(1);
            mrnDateClass.fields.day.value = date.d;
            mrnDateClass.fields.month.value = date.m;
            mrnDateClass.fields.year.value = date.y;
            expect(mrnDateClass.next()).to.eql({nextStep: paths.identity.areYouAnAppointee});
        });

        it('returns the next step path /check-mrn-date if date more than a month', () => {
            date = mrnDate(2);
            mrnDateClass.fields.day.value = date.d;
            mrnDateClass.fields.month.value = date.m;
            mrnDateClass.fields.year.value = date.y;
            expect(mrnDateClass.next()).to.eql({ nextStep: paths.compliance.checkMRNDate });
        });

    });

});

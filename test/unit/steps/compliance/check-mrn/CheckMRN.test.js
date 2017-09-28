'use strict';

const { expect } = require('test/util/chai');
const moment = require('moment');
const { stub } = require('sinon');
const CheckMRN = require('steps/compliance/check-mrn/CheckMRN');
const content = require('steps/compliance/check-mrn/content.json');
const urls = require('urls');

describe('CheckMRN.js', () => {

    const mrnDate = m => {
        const date = moment().subtract(m, 'month');
        return {
          MRNDate_day: date.date(),
          MRNDate_month: date.month() + 1,
          MRNDate_year: date.year()
        };
    };
    let checkMRNClass;

    beforeEach(() => {
        checkMRNClass = new CheckMRN();
    });

    after(() => {
        checkMRNClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /check-mrn-date', () => {
            expect(checkMRNClass.url).to.equal(urls.compliance.checkMRNDate);
        });

    });

    describe('get template()', () => {

        it('returns template path compliance/check-mrn/template', () => {
            expect(checkMRNClass.template).to.equal('compliance/check-mrn/template');
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(checkMRNClass.i18NextContent).to.equal(content);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = checkMRNClass.form.fields[0];
        });

        after(() => {
            field = undefined;
        });

        it('contains the field name checkedMRN', () => {
            expect(field.name).to.equal('checkedMRN');
        });

        it('contains field content', () => {
            expect(field.content).to.eql(content.en.translation.fields.checkedMRN);
        });

    });

    describe('next()', () => {

        let redirector;

        beforeEach(() => {
            checkMRNClass.fields = stub();
        });

        after(() => {
           redirector = undefined;
        });

        describe('checkMRN field value equals yes', () => {

            beforeEach(() => {
                checkMRNClass.fields.get = stub().returns({value: 'yes'});
            });

            it('returns the next step url /mrn-over-month-late when date is less than thirteen months', () => {
                redirector = {
                    nextStep: urls.compliance.mrnOverMonthLate
                };
                checkMRNClass.journey = {
                    MRNOverOneMonthLate: urls.compliance.mrnOverMonthLate
                };
                checkMRNClass.locals = {
                    session: mrnDate(1)
                };
                expect(checkMRNClass.next()).to.eql(redirector);
            });

            it('returns the next step url /mrn-over-month-late when date is equal to thirteen months', () => {
                redirector = {
                    nextStep: urls.compliance.mrnOverMonthLate
                };
                checkMRNClass.journey = {
                    MRNOverOneMonthLate: urls.compliance.mrnOverMonthLate
                };
                checkMRNClass.locals = {
                    session: mrnDate(13)
                };
                expect(checkMRNClass.next()).to.eql(redirector);
            });

            it('returns the next step url /mrn-over-thirteen-months-late when date is over thirteen months', () => {
                redirector = {
                    nextStep: urls.compliance.mrnOverThirteenMonthsLate
                };
                checkMRNClass.journey = {
                    MRNOverThirteenMonthsLate: urls.compliance.mrnOverThirteenMonthsLate
                };
                checkMRNClass.locals = {
                    session: mrnDate(14)
                };
                expect(checkMRNClass.next()).to.eql(redirector);
            });

        });

        describe('checkMRN field value equals no', () => {

            it('returns the next step url /mrn-date when checkMRN value equals no', () => {
                redirector = {
                    nextStep: urls.compliance.mrnDate
                };
                checkMRNClass.journey = {
                    MRNDate: urls.compliance.mrnDate
                };
                checkMRNClass.fields.get = stub().returns({value: 'no'});
                expect(checkMRNClass.next()).to.eql(redirector);
            });

        });

    });

});

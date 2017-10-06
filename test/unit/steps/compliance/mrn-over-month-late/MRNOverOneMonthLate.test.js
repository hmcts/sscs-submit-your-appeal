'use strict';

const { expect } = require('test/util/chai');
const MRNOverOneMonthLate = require('steps/compliance/mrn-over-month-late/MRNOverOneMonthLate');
const content = require('steps/compliance/mrn-over-month-late/content.json');
const urls = require('urls');

describe('MRNOverOneMonth.js', () => {

    let mrnOverOneMonthClass;

    beforeEach(() => {
        mrnOverOneMonthClass = new MRNOverOneMonthLate();
    });

    after(() => {
        mrnOverOneMonthClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /mrn-over-month-late', () => {
            expect(mrnOverOneMonthClass.url).to.equal(urls.compliance.mrnOverMonthLate);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = mrnOverOneMonthClass.form.fields[0];
        });

        after(() => {
            field = undefined;
        });

        it('contains the field name reasonForBeingLate', () => {
            expect(field.name).to.equal('reasonForBeingLate');
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(mrnOverOneMonthClass.i18NextContent).to.equal(content);
        });

    });

    describe('next()', () => {

        it('returns the next step url /are-you-an-appointee', () => {
            const redirector = {
                nextStep: urls.identity.areYouAnAppointee
            };
            mrnOverOneMonthClass.journey = {
                Appointee: urls.identity.areYouAnAppointee
            };
            expect(mrnOverOneMonthClass.next()).to.eql(redirector);
        });

    });

});

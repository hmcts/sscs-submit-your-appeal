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

    describe('get template()', () => {

        it('returns template path compliance/mrn-over-month-late/template', () => {
            expect(mrnOverOneMonthClass.template).to.equal('compliance/mrn-over-month-late/template');
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(mrnOverOneMonthClass.i18NextContent).to.equal(content);
        });

    });

    it('returns the next step url /', () => {
        const redirector = {
            nextStep: '/sms-confirmation'
        };
        enterMobileClass.journey = {
            SmsConfirmation: '/sms-confirmation'
        };
        expect(enterMobileClass.next()).to.eql(redirector);
    });

});
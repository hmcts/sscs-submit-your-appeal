'use strict';

const { expect } = require('test/util/chai');
const MRNOverThirteenMonthsLate = require('steps/compliance/mrn-over-thirteen-months-late/MRNOverThirteenMonthsLate');
const content = require('steps/compliance/mrn-over-thirteen-months-late/content.json');
const urls = require('urls');

describe('MRNOverThirteenMonthsLate.js', () => {

    let mrnOverThirteenMonthsLateClass;

    beforeEach(() => {
        mrnOverThirteenMonthsLateClass = new MRNOverThirteenMonthsLate();
    });

    after(() => {
        mrnOverThirteenMonthsLateClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /mrn-over-thirteen-months-late', () => {
            expect(mrnOverThirteenMonthsLateClass.url).to.equal(urls.compliance.mrnOverThirteenMonthsLate);
        });

    });

    describe('get template()', () => {

        it('returns template path compliance/mrn-over-thirteen-months-late/template', () => {
            expect(mrnOverThirteenMonthsLateClass.template).to.equal('compliance/mrn-over-thirteen-months-late/template');
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(mrnOverThirteenMonthsLateClass.i18NextContent).to.equal(content);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = mrnOverThirteenMonthsLateClass.form.fields[0];
        });

        after(() => {
            field = undefined;
        });

        it('contains the field name reasonForBeingLate', () => {
            expect(field.name).to.equal('reasonForBeingLate');
        });

        it('contains field content', () => {
            expect(field.content).to.eql(content.en.translation.fields.reasonForBeingLate);
        });

    });

    describe('next()', () => {

        it('returns the next step url /are-you-an-appointee', () => {
            const redirector = {
                nextStep: urls.identity.areYouAnAppointee
            };
            mrnOverThirteenMonthsLateClass.journey = {
                Appointee: urls.identity.areYouAnAppointee
            };
            expect(mrnOverThirteenMonthsLateClass.next()).to.eql(redirector);
        });

    });


});

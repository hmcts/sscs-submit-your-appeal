'use strict';

const { expect } = require('test/util/chai');
const MRNOverThirteenMonthsLate = require('steps/compliance/mrn-over-thirteen-months-late/MRNOverThirteenMonthsLate');
const paths = require('paths');

describe('MRNOverThirteenMonthsLate.js', () => {

    let mrnOverThirteenMonthsLateClass;

    beforeEach(() => {
        mrnOverThirteenMonthsLateClass = new MRNOverThirteenMonthsLate();
        mrnOverThirteenMonthsLateClass.journey = {};
    });

    after(() => {
        mrnOverThirteenMonthsLateClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /mrn-over-thirteen-months-late', () => {
            expect(mrnOverThirteenMonthsLateClass.url).to.equal(paths.compliance.mrnOverThirteenMonthsLate);
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

    });

    describe('next()', () => {

        it('returns the next step url /are-you-an-appointee', () => {
            mrnOverThirteenMonthsLateClass.journey.Appointee = paths.identity.areYouAnAppointee;
            expect(mrnOverThirteenMonthsLateClass.next()).to.eql({ nextStep: paths.identity.areYouAnAppointee });
        });

    });


});

'use strict';

const { expect } = require('test/util/chai');
const MRNOverOneMonthLate = require('steps/compliance/mrn-over-month-late/MRNOverOneMonthLate');
const paths = require('paths');

describe('MRNOverOneMonth.js', () => {

    let mrnOverOneMonth;

    beforeEach(() => {

        mrnOverOneMonth = new MRNOverOneMonthLate({
            journey: {
                Appointee: paths.identity.areYouAnAppointee
            }
        });
    });

    describe('get url()', () => {

        it('returns url /mrn-over-month-late', () => {
            expect(mrnOverOneMonth.url).to.equal(paths.compliance.mrnOverMonthLate);
        });

    });

    describe('get form()', () => {

        it('contains the field name reasonForBeingLate', () => {
            const field = mrnOverOneMonth.form.fields[0];
            expect(field.name).to.equal('reasonForBeingLate');
        });

    });

    describe('next()', () => {

        it('returns the next step url /are-you-an-appointee', () => {
            expect(mrnOverOneMonth.next()).to.eql({ nextStep: paths.identity.areYouAnAppointee });
        });

    });

});

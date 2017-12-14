'use strict';

const { expect } = require('test/util/chai');
const MRNOverOneMonthLate = require('steps/compliance/mrn-over-month-late/MRNOverOneMonthLate');
const paths = require('paths');

describe('MRNOverOneMonth.js', () => {

    let mrnOverOneMonth;

    beforeEach(() => {

        mrnOverOneMonth = new MRNOverOneMonthLate({
            journey: {
                steps: {
                    Appointee: paths.identity.areYouAnAppointee
                }
            }
        });
    });

    describe('get path()', () => {

        it('returns path /mrn-over-month-late', () => {
            expect(MRNOverOneMonthLate.path).to.equal(paths.compliance.mrnOverMonthLate);
        });

    });

    describe('get form()', () => {

        it('contains the field name reasonForBeingLate', () => {
            const field = mrnOverOneMonth.form.fields[0];
            expect(field.name).to.equal('reasonForBeingLate');
        });

    });

    describe('next()', () => {

        it('returns the next step path /are-you-an-appointee', () => {
            expect(mrnOverOneMonth.next()).to.eql({ nextStep: paths.identity.areYouAnAppointee });
        });

    });

});

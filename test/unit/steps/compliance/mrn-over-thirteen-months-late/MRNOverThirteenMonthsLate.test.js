'use strict';

const { expect } = require('test/util/chai');
const MRNOverThirteenMonthsLate = require('steps/compliance/mrn-over-thirteen-months-late/MRNOverThirteenMonthsLate');
const paths = require('paths');

describe('MRNOverThirteenMonthsLate.js', () => {

    let mrnOverThirteenMonthsLate;

    beforeEach(() => {

        mrnOverThirteenMonthsLate = new MRNOverThirteenMonthsLate({
            journey: {
                steps: {
                    Appointee: paths.identity.areYouAnAppointee
                }
            }
        });

    });

    describe('get path()', () => {

        it('returns path /mrn-over-thirteen-months-late', () => {
            expect(MRNOverThirteenMonthsLate.path).to.equal(paths.compliance.mrnOverThirteenMonthsLate);
        });

    });

    describe('get form()', () => {

        it('contains the field name reasonForBeingLate', () => {
            const field = mrnOverThirteenMonthsLate.form.fields[0];
            expect(field.name).to.equal('reasonForBeingLate');
        });

    });

    describe('next()', () => {

        it('returns the next step path /are-you-an-appointee', () => {
            expect(mrnOverThirteenMonthsLate.next()).to.eql({ nextStep: paths.identity.areYouAnAppointee });
        });

    });
});

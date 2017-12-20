'use strict';

const { expect } = require('test/util/chai');
const MRNOverThirteenMonthsLate = require('steps/compliance/mrn-over-thirteen-months-late/MRNOverThirteenMonthsLate');
const sections = require('steps/check-your-appeal/sections');
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

    describe('answers() and values()', () => {

        const question = 'A Question';
        const value = 'The reason is...';

        beforeEach(() => {

            mrnOverThirteenMonthsLate.content = {
                cya: {
                    reasonForBeingLate: {
                        question
                    }
                }
            };

            mrnOverThirteenMonthsLate.fields = {
                reasonForBeingLate: {
                    value
                }
            };

        });

        it('should contain a single answer', () => {
            const answers = mrnOverThirteenMonthsLate.answers();
            expect(answers.length).to.equal(1);
            expect(answers[0].question).to.equal(question);
            expect(answers[0].section).to.equal(sections.mrnDate);
            expect(answers[0].answer).to.equal(value);
        });

        it('should contain a value object', () => {
            const values = mrnOverThirteenMonthsLate.values();
            expect(values).to.eql( { mrn: { reasonForBeingLate: value } });
        });
    });

    describe('next()', () => {

        it('returns the next step path /are-you-an-appointee', () => {
            expect(mrnOverThirteenMonthsLate.next()).to.eql({ nextStep: paths.identity.areYouAnAppointee });
        });

    });
});

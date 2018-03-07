'use strict';

const { expect } = require('test/util/chai');
const MRNOverOneMonthLate = require('steps/compliance/mrn-over-month-late/MRNOverOneMonthLate');
const sections = require('steps/check-your-appeal/sections');
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

        let fields;
        let field;

        before(() => {
            fields = mrnOverOneMonth.form.fields;
        });

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('reasonForBeingLate');
        });

        describe('reasonForBeingLate field', () => {

            beforeEach(() => {
                field = fields.reasonForBeingLate;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDescriptor');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers() and values()', () => {

        const question = 'A Question';
        const value = 'The reason is...';

        beforeEach(() => {

            mrnOverOneMonth.content = {
                cya: {
                    reasonForBeingLate: {
                        question
                    }
                }
            };

            mrnOverOneMonth.fields = {
                reasonForBeingLate: {
                    value
                }
            };

        });

        it('should contain a single answer', () => {
            const answers = mrnOverOneMonth.answers();
            expect(answers.length).to.equal(1);
            expect(answers[0].question).to.equal(question);
            expect(answers[0].section).to.equal(sections.mrnDate);
            expect(answers[0].answer).to.equal(value);
        });

        it('should contain a value object', () => {
            const values = mrnOverOneMonth.values();
            expect(values).to.eql( { mrn: { reasonForBeingLate: value } });
        });
    });

    describe('next()', () => {

        it('returns the next step path /are-you-an-appointee', () => {
            expect(mrnOverOneMonth.next()).to.eql({ nextStep: paths.identity.areYouAnAppointee });
        });

    });

});

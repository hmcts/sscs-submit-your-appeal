'use strict';

const BenefitType = require('steps/start/benefit-type/BenefitType');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('BenefitType.js', () => {

    let benefitType;

    beforeEach(() => {

        benefitType = new BenefitType({
            journey: {
                steps: {
                    AppointeeFormDownload: paths.identity.downloadAppointeeForm,
                    PostcodeChecker: paths.start.postcodeCheck
                }
            }
        });

    });

    describe('get path()', () => {

        it('returns path /benefit-type', () => {
            expect(BenefitType.path).to.equal(paths.start.benefitType);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = benefitType.form.fields[0];
        });

        it('contains the field name benefitType', () => {
            expect(field.name).to.equal('benefitType');
        });

        it('contains validation', () => {
            expect(field.validations).to.not.be.empty;
        });

    });

    describe('answers() and values()', () => {

        const question = 'A Question';
        const value = 'PIP';

        beforeEach(() => {

            benefitType.content = {
                cya: {
                    benefitType: {
                        question
                    }
                }
            };

            benefitType.fields = {
                benefitType: {
                    value
                }
            };

        });

        it('should contain a single answer', () => {
            const answers = benefitType.answers();
            expect(answers.question).to.equal(question);
            expect(answers.section).to.equal(sections.benefitType);
            expect(answers.answer).to.equal(value);
        });

        it('should contain a value object', () => {
            const values = benefitType.values();
            expect(values).to.eql( { benefitType: 'PIP' });
        });
    });

    describe('next()', () => {

        it('returns the next step path /mrn-date with benefit type value is not PIP', () => {
            benefitType.fields.benefitType.value = 'not PIP';
            expect(benefitType.next().step).to.eql(paths.identity.downloadAppointeeForm);
        });

        it('returns the next step path /postcode-check with benefit type value is PIP', () => {
            benefitType.fields.benefitType.value = 'Personal Independence Payment (PIP)';
            expect(benefitType.next().step).to.eql(paths.start.postcodeCheck);
        });

    });

});

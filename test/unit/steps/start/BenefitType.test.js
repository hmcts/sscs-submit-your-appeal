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
                    AppealFormDownload: paths.appealFormDownload,
                    PostcodeChecker: paths.start.postcodeCheck
                }
            }
        });

        benefitType.fields = {
            benefitType: {}
        };

    });

    describe('get path()', () => {

        it('returns path /benefit-type', () => {
            expect(BenefitType.path).to.equal(paths.start.benefitType);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        before(() => {
            fields = benefitType.form.fields
        });

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('benefitType');
        });

        describe('benefitType filed', () => {

            beforeEach(() => {
                field = fields.benefitType;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name benefitType', () => {
                expect(field.name).to.equal('benefitType');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers() and values()', () => {

        const question = 'A Question';
        const value = 'Personal Independence Payment (PIP)';

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
            expect(values).to.deep.equal({
                benefitType: {
                    code: 'PIP',
                    description: 'Personal Independence Payment'
                }
            });
        });
    });

    describe('next()', () => {

        it('returns the next step path /appeal-form-download when benefit type value is not PIP', () => {
            benefitType.fields.benefitType.value = 'not PIP';
            expect(benefitType.next().step).to.eql(paths.appealFormDownload);
        });

        it('returns the next step path /postcode-check with benefit type value is PIP', () => {
            benefitType.fields.benefitType.value = 'Personal Independence Payment (PIP)';
            expect(benefitType.next().step).to.eql(paths.start.postcodeCheck);
        });

    });

});

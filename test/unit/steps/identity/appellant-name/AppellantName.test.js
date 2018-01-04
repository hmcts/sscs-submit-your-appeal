'use strict';

const { expect } = require('test/util/chai');
const AppellantName = require('steps/identity/appellant-name/AppellantName');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');

describe('AppellantName.js', () => {

    let appellantName;

    beforeEach(() => {

        appellantName = new AppellantName({
            journey:{
                steps: {
                    AppellantDOB: paths.identity.enterAppellantDOB
                }
            }
        });
        appellantName.fields = {};
    });

    describe('get path()', () => {

        it('returns path /enter-appellant-contact-details', () => {
            expect(AppellantName.path).to.equal(paths.identity.enterAppellantName);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = appellantName.form.fields;
        });

        it('should contain 3 fields', () => {
            expect(Object.keys(fields).length).to.equal(3);
            expect(fields).to.have.all.keys('title', 'firstName', 'lastName');
        });

        describe('title field', () => {

            beforeEach(() => {
                field = fields.title;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name title', () => {
                expect(field.name).to.equal('title');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('firstName field', () => {

            beforeEach(() => {
                field = fields.firstName;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name firstName', () => {
                expect(field.name).to.equal('firstName');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('lastName field', () => {

            beforeEach(() => {
                field = fields.lastName;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name lastName', () => {
                expect(field.name).to.equal('lastName');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers() and values()', () => {

        const question = 'A Question';

        beforeEach(() => {

            appellantName.fields = {
                title: {
                    value: 'Mr'
                },
                firstName: {
                    value: 'Harry'
                },
                lastName: {
                    value: 'Potter'
                }
            };

            appellantName.content = {
                cya: {
                    appellantName: {
                        question
                    }
                }
            };

        });

        it('should contain a single answer', () => {
            const answers = appellantName.answers();
            expect(answers.length).to.equal(1);
            expect(answers[0].question).to.equal(question);
            expect(answers[0].section).to.equal(sections.appellantDetails);
            expect(answers[0].answer).to.equal('Mr Harry Potter');
        });

        it('should contain a value object', () => {
            const values = appellantName.values();
            expect(values).to.eql({
                appellant: {
                    title: 'Mr',
                    firstName: 'Harry',
                    lastName: 'Potter'
                }
            });
        });
    });

    describe('next()', () => {

        it('returns the next step path /enter-appellant-dob', () => {
            expect(appellantName.next()).to.eql({ nextStep: paths.identity.enterAppellantDOB });
        });

    });

});

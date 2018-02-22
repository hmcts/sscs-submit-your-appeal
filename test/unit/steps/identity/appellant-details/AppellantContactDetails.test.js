'use strict';

const AppellantContactDetails = require('steps/identity/appellant-contact-details/AppellantContactDetails');
const { expect } = require('test/util/chai');
const paths = require('paths');
const userAnswer = require('utils/answer');
const sections = require('steps/check-your-appeal/sections');
const questions = require('steps/identity/appellant-contact-details/content.en').cya;

describe.only('AppellantContactDetails.js', () => {

    let appellantContactDetails;

    beforeEach(() => {
        appellantContactDetails = new AppellantContactDetails({
            journey: {
                steps: {
                    TextReminders: paths.smsNotify.appellantTextReminders
                }
            }
        });

        appellantContactDetails.fields = {
            firstName: { value: '' },
            lastName: { value: '' },
            addressLine1: { value: '' },
            addressLine2: { value: '' },
            townCity: { value: '' },
            county: { value: '' },
            postCode: { value: '' },
            phoneNumber: { value: '' },
            emailAddress: { value: '' }
        }
    });

    describe('get path()', () => {

        it('returns path /enter-appellant-contact-details', () => {
            expect(AppellantContactDetails.path).to.equal(paths.identity.enterAppellantContactDetails);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        before(() => {
            fields = appellantContactDetails.form.fields
        });

        describe('all field names', () => {

            it('should contain 7 fields', () => {
                expect(Object.keys(fields).length).to.equal(7);
                expect(fields).to.have.all.keys(
                    'addressLine1',
                    'addressLine2',
                    'townCity',
                    'county',
                    'postCode',
                    'phoneNumber',
                    'emailAddress');
            });

        });

        describe('addressLine1 field', () => {

            beforeEach(() => {
                field = fields.addressLine1;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name addressLine1', () => {
                expect(field.name).to.equal('addressLine1');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('addressLine2 field', () => {

            beforeEach(() => {
                field = fields.addressLine2;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name addressLine2', () => {
                expect(field.name).to.equal('addressLine2');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('townCity field', () => {

            beforeEach(() => {
                field = fields.townCity;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name townCity', () => {
                expect(field.name).to.equal('townCity');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('county field', () => {

            beforeEach(() => {
                field = fields.county;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name county', () => {
                expect(field.name).to.equal('county');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('postCode field', () => {

            beforeEach(() => {
                field = fields.postCode;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name postCode', () => {
                expect(field.name).to.equal('postCode');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('phoneNumber field', () => {

            beforeEach(() => {
                field = fields.phoneNumber;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name phoneNumber', () => {
                expect(field.name).to.equal('phoneNumber');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('emailAddress field', () => {

            beforeEach(() => {
                field = fields.emailAddress;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name emailAddress', () => {
                expect(field.name).to.equal('emailAddress');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers()', () => {

        let answers;

        before(() => {
            answers = appellantContactDetails.answers();
        });

        describe('fields containing the correct data', () => {

            it('should contain 7 answers', () => {
                expect(answers.length).to.equal(7);
            });

            it('should contain field addressLine1', () => {
                // const addressLine1 = answers[0];
                expect(addressLine1.question).to.equal(questions.addressLine1);
                expect(addressLine1.section).to.equal(sections.appellantDetails);
                // expect(answers[0].answer).to.equal('Mr Harry Potter');
            });

        });

        describe('optional fields defaulting to \'Not provided\' on CYA', () => {

            it('should display \'Not provided\' when the user omits the addressLine2', () => {
                const addressLine2 = answers[1];
                expect(addressLine2.answer).to.equal(userAnswer.NOT_PROVIDED);
            });

            it('should display \'Not provided\' when the user omits the phoneNumber', () => {
                const phoneNumber = answers[5];
                expect(phoneNumber.answer).to.equal(userAnswer.NOT_PROVIDED);
            });

            it('should display \'Not provided\' when the user omits the emailAddress', () => {
                const emailAddress = answers[6];
                expect(emailAddress.answer).to.equal(userAnswer.NOT_PROVIDED);
            });

        });

    });

    describe('next()', () => {

        it('returns the next step path /appellant-text-reminders', () => {
            expect(appellantContactDetails.next()).to.eql({ nextStep: paths.smsNotify.appellantTextReminders });
        });

    });

});

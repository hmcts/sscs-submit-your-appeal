'use strict';

const { expect } = require('test/util/chai');
const { formatMobileNumber } = require('utils/stringUtils');
const RepresentativeDetails = require('steps/representative/representative-details/RepresentativeDetails');
const paths = require('paths');
const userAnswer = require('utils/answer');

describe('RepresentativeDetails.js', () => {

    let representativeDetails;

    beforeEach(() => {

        representativeDetails = new RepresentativeDetails({
            journey: {
                steps: {
                    ReasonForAppealing: paths.reasonsForAppealing.reasonForAppealing
                }
            }
        });

        representativeDetails.fields = {
            firstName: { value: '' },
            lastName: { value: '' },
            organisation: { value: '' },
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

        it('returns path /representative-details', () => {
            expect(RepresentativeDetails.path).to.equal(paths.representative.representativeDetails);
        });

    });

    describe('get CYAOrganisation()', () => {

        it('should return Not Provided if there is no organisation value', () => {
            expect(representativeDetails.CYAOrganisation).to.equal(userAnswer.NOT_PROVIDED)
        });

        it('should return the organisation if an organisation value has been set', () => {
            representativeDetails.fields.organisation.value = 'Organisation';
            expect(representativeDetails.CYAOrganisation).to.equal(representativeDetails.fields.organisation.value)
        });

    });

    describe('get CYAPhoneNumber()', () => {

        it('should return Not Provided if there is no phoneNumber value', () => {
            expect(representativeDetails.CYAPhoneNumber).to.equal(userAnswer.NOT_PROVIDED)
        });

        it('should return a formatted mobile number if a phoneNumber value has been set', () => {
            representativeDetails.fields.phoneNumber.value = '0800109756';
            expect(representativeDetails.CYAPhoneNumber).to.equal(formatMobileNumber(representativeDetails.fields.phoneNumber.value))
        });

    });

    describe('get CYAEmailAddress()', () => {

        it('should return Not Provided if there is no email value', () => {
            expect(representativeDetails.CYAEmailAddress).to.equal(userAnswer.NOT_PROVIDED)
        });

        it('should return the email address if an emailaddress value has been set', () => {
            representativeDetails.fields.emailAddress.value = 'myemailaddress@sscs.com';
            expect(representativeDetails.CYAEmailAddress).to.equal(representativeDetails.fields.emailAddress.value)
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = representativeDetails.form.fields;
        });

        it('should contain 10 fields', () => {
            expect(Object.keys(fields).length).to.equal(10);
            expect(fields).to.have.all.keys(
                'firstName',
                'lastName',
                'organisation',
                'addressLine1',
                'addressLine2',
                'townCity',
                'county',
                'postCode',
                'emailAddress',
                'phoneNumber'
            );
        });

        describe('firstName field', () => {

            beforeEach(() => {
                field = fields.firstName;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDescriptor');
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
                expect(field.constructor.name).to.eq('FieldDescriptor');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('organisation field', () => {

            beforeEach(() => {
                field = fields.organisation;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDescriptor');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('addressLine1 field', () => {

            beforeEach(() => {
                field = fields.addressLine1;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDescriptor');
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
                expect(field.constructor.name).to.eq('FieldDescriptor');
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
                expect(field.constructor.name).to.eq('FieldDescriptor');
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
                expect(field.constructor.name).to.eq('FieldDescriptor');
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
                expect(field.constructor.name).to.eq('FieldDescriptor');
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
                expect(field.constructor.name).to.eq('FieldDescriptor');
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
                expect(field.constructor.name).to.eq('FieldDescriptor');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers()', () => {

        let answers;

        before(() => {
            answers = representativeDetails.answers()[0];
        });

        it('should return expected section', () => {
            expect(answers.section).to.equal('representative');
        });

        it('should return expected template', () => {
            expect(answers.template).to.equal('answer.html');
        });

    });

    describe('values()', () => {

        it('should contain a value object', () => {
            representativeDetails.fields.firstName.value = 'First name';
            representativeDetails.fields.lastName.value = 'Last name';
            representativeDetails.fields.organisation.value = 'Organisation';
            representativeDetails.fields.addressLine1.value = 'First line of my address';
            representativeDetails.fields.addressLine2.value = 'Second line of my address';
            representativeDetails.fields.townCity.value = 'Town or City';
            representativeDetails.fields.county.value = 'County';
            representativeDetails.fields.postCode.value = 'Postcode';
            representativeDetails.fields.phoneNumber.value = '0800109756';
            representativeDetails.fields.emailAddress.value = 'myemailaddress@sscs.com';
            const values = representativeDetails.values();
            expect(values).to.eql({
                representative: {
                    firstName: 'First name',
                    lastName: 'Last name',
                    organisation: 'Organisation',
                    contactDetails: {
                        addressLine1: 'First line of my address',
                        addressLine2: 'Second line of my address',
                        townCity: 'Town or City',
                        county: 'County',
                        postCode: 'Postcode',
                        phoneNumber: '0800109756',
                        emailAddress: 'myemailaddress@sscs.com',
                    }
                }
            });
        });

    });

    describe('next()', () => {

        it('returns the next step path /reason-for-appealing', () => {
            expect(representativeDetails.next()).to.eql({ nextStep: paths.reasonsForAppealing.reasonForAppealing });
        });

    });

});

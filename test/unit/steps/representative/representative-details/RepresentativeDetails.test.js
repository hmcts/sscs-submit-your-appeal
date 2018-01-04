'use strict';

const { expect } = require('test/util/chai');
const RepresentativeDetails = require('steps/representative/representative-details/RepresentativeDetails');
const paths = require('paths');

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

    });

    describe('get path()', () => {

        it('returns path /representative-details', () => {
            expect(RepresentativeDetails.path).to.equal(paths.representative.representativeDetails);
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

        describe('organisation field', () => {

            beforeEach(() => {
                field = fields.organisation;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name organisation', () => {
                expect(field.name).to.equal('organisation');
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

    describe('next()', () => {

        it('returns the next step path /reason-for-appealing', () => {
            expect(representativeDetails.next()).to.eql({ nextStep: paths.reasonsForAppealing.reasonForAppealing });
        });

    });

});

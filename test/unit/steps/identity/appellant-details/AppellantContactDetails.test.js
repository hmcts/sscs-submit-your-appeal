'use strict';

const AppellantDetails = require('steps/identity/appellant-contact-details/AppellantContactDetails');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('AppellantContactDetails.js', () => {

    let appellantDetailsClass;

    beforeEach(() => {
        appellantDetailsClass = new AppellantDetails({
            journey: {
                TextReminders: paths.smsNotify.appellantTextReminders
            }
        });
        appellantDetailsClass.fields = {}
    });

    describe('get url()', () => {

        it('returns url /enter-appellant-contact-details', () => {
            expect(appellantDetailsClass.url).to.equal(paths.identity.enterAppellantDetails);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = appellantDetailsClass.form.fields;
        });

        after(() => {
            fields = field = undefined;
        });

        describe('addressLine1 field', () => {

            beforeEach(() => {
                field = fields[0];
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
                field = fields[1];
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
                field = fields[2];
            });

            it('contains the field name townCity', () => {
                expect(field.name).to.equal('townCity');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('postCode field', () => {

            beforeEach(() => {
                field = fields[3];
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
                field = fields[4];
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
                field = fields[5];
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

        it('returns the next step url /appellant-text-reminders', () => {
            expect(appellantDetailsClass.next()).to.eql({ nextStep: paths.smsNotify.appellantTextReminders });
        });

    });

});

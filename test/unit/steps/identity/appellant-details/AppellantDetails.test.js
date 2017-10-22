'use strict';

const AppellantDetails = require('steps/identity/appellant-details/AppellantDetails');
const { expect } = require('test/util/chai');
const urls = require('urls');
const answer = require('utils/answer');

describe('AppellantDetails.js', () => {

    let appellantDetailsClass;

    beforeEach(() => {
        appellantDetailsClass = new AppellantDetails();
        appellantDetailsClass.journey = {
            Appointee: {}
        };
        appellantDetailsClass.fields = {
            appointee: {}
        }
    });

    describe('get url()', () => {

        it('returns url /enter-appellant-details', () => {
            expect(appellantDetailsClass.url).to.equal(urls.identity.enterAppellantDetails);
        });

    });

    describe('get isAppointee()', () => {

        it('should return true', () => {
            appellantDetailsClass.fields.appointee.value = answer.YES;
            expect(appellantDetailsClass.isAppointee).to.eq(true);
        });

        it('should return false', () => {
            appellantDetailsClass.fields.appointee.value = answer.NO;
            expect(appellantDetailsClass.isAppointee).to.eq(false);
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

        describe('firstName field', () => {

            beforeEach(() => {
                field = fields[0];
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
                field = fields[1];
            });

            it('contains the field name lastName', () => {
                expect(field.name).to.equal('lastName');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('niNumber field', () => {

            beforeEach(() => {
                field = fields[2];
            });

            it('contains the field name niNumber', () => {
                expect(field.name).to.equal('niNumber');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('addressLine1 field', () => {

            beforeEach(() => {
                field = fields[3];
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
                field = fields[4];
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
                field = fields[5];
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
                field = fields[6];
            });

            it('contains the field name postCode', () => {
                expect(field.name).to.equal('postCode');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('appellantPhoneNumber field', () => {

            beforeEach(() => {
                field = fields[7];
            });

            it('contains the field name appellantPhoneNumber', () => {
                expect(field.name).to.equal('appellantPhoneNumber');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('emailAddress field', () => {

            beforeEach(() => {
                field = fields[8];
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
            const redirector = {
                nextStep: urls.smsNotify.appellantTextReminders
            };
            appellantDetailsClass.journey = {
                TextReminders: urls.smsNotify.appellantTextReminders
            };
            expect(appellantDetailsClass.next()).to.eql(redirector);
        });

    });

});

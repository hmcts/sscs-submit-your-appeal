'use strict';

const { expect } = require('test/util/chai');
const SmsConfirmation = require('steps/sms-notify/sms-confirmation/SmsConfirmation');
const urls = require('urls');
const answer = require('utils/answer');

describe('SmsConfirmation.js', () => {

    let smsConfirmationClass;

    beforeEach(() => {
        smsConfirmationClass = new SmsConfirmation();
        smsConfirmationClass.journey = {};
        smsConfirmationClass.fields = {
            appellantPhoneNumber: {},
            enterMobile: {},
            useSameNumber: {}
        };
    });

    describe('get url()', () => {

        it('returns url /sms-confirmation', () => {
            expect(smsConfirmationClass.url).to.equal('/sms-confirmation');
        });

    });

    describe('get mobileNumber()', () => {

        it('should return enterMobile when the appellantPhoneNumber is an empty string', () => {
            smsConfirmationClass.fields.appellantPhoneNumber.value = '';
            smsConfirmationClass.fields.enterMobile.value = '07411738663';
            expect(smsConfirmationClass.mobileNumber).to.eq(smsConfirmationClass.fields.enterMobile.value);
        });

        it('should return enterMobile when the appellantPhoneNumber is not a mobile', () => {
            smsConfirmationClass.fields.appellantPhoneNumber.value = '01277345672';
            smsConfirmationClass.fields.enterMobile.value = '07411738663';
            expect(smsConfirmationClass.mobileNumber).to.eq(smsConfirmationClass.fields.enterMobile.value);
        });

        it('should return enterMobile when the appellantPhoneNumber is a mobile but provides another', () => {
            smsConfirmationClass.fields.appellantPhoneNumber.value = '07411738765';
            smsConfirmationClass.fields.useSameNumber.value = answer.NO;
            smsConfirmationClass.fields.enterMobile.value = '07411738371';
            expect(smsConfirmationClass.mobileNumber).to.eq(smsConfirmationClass.fields.enterMobile.value);
        });

        it('should return appellantPhoneNumber which is a mobile', () => {
            smsConfirmationClass.fields.appellantPhoneNumber.value = '07411738765';
            smsConfirmationClass.fields.useSameNumber.value = answer.YES;
            expect(smsConfirmationClass.mobileNumber).to.eq(smsConfirmationClass.fields.appellantPhoneNumber.value);
        });

    });

    describe('get form()', () => {

        it('should contain 3 fields', () => {
            expect(smsConfirmationClass.form.fields.length).to.equal(3);
        });

        it('should contain a textField reference called \'enterMobile\'', () => {
            const textField = smsConfirmationClass.form.fields[0];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('enterMobile');
            expect(textField.validations).to.be.empty;
        });

        it('should contain a textField reference called \'useSameNumber\'', () => {
            const textField = smsConfirmationClass.form.fields[1];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('useSameNumber');
            expect(textField.validations).to.be.empty;
        });

        it('should contain a textField reference called \'year\'', () => {
            const textField = smsConfirmationClass.form.fields[2];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('appellantPhoneNumber');
            expect(textField.validations).to.be.empty;
        });

    });

    describe('next()', () => {

        it('returns the next step url /representative', () => {
            smsConfirmationClass.journey.Representative = urls.representative.representative;
            expect(smsConfirmationClass.next()).to.eql({ nextStep: urls.representative.representative });
        });

    });

});

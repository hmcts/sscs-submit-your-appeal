'use strict';

const SendToNumber = require('steps/sms-notify/send-to-number/SendToNumber');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('SendToNumber.js', () => {

    let sendToNumber;

    beforeEach(() => {

       sendToNumber = new SendToNumber({
           journey: {
               steps: {
                   SmsConfirmation: paths.smsNotify.smsConfirmation,
                   EnterMobile: paths.smsNotify.enterMobile
               }
           }
       });

       sendToNumber.fields = {
           useSameNumber: {},
           phoneNumber: {
               value: '07411785336'
           }
       }

    });

    describe('get path()', () => {

        it('returns path /send-to-number', () => {
            expect(SendToNumber.path).to.equal(paths.smsNotify.sendToNumber);
        });

    });

    describe('get phoneNumber()', () => {

        it('should be defined', () => {
            expect(sendToNumber.phoneNumber).to.eq(
                sendToNumber.fields.phoneNumber.value
            );
        });

    });

    describe('get form()', () => {

        it('should contain 2 fields', () => {
            expect(sendToNumber.form.fields.length).to.equal(2);
        });

        it('should contain a textField reference called \'phoneNumber\'', () => {
            const textField = sendToNumber.form.fields[0];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('phoneNumber');
            expect(textField.validations).to.be.empty;
        });

        it('should contain a textField called useSameNumber', () => {
            const textField = sendToNumber.form.fields[1];
            expect(textField.constructor.name).to.eq('FieldDesriptor');
            expect(textField.name).to.equal('useSameNumber');
            expect(textField.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        it('returns branch object with condition property', () => {
            const branches = sendToNumber.next().branches[0];
            expect(branches).to.have.property('condition');
        });

        it('returns branch object where condition nextStep equals /sms-confirmation', () => {
            const branches = sendToNumber.next().branches[0];
            expect(branches.redirector).to.eql({ nextStep: paths.smsNotify.smsConfirmation })
        });

        it('returns fallback object where nextStep equals /enter-mobile', () => {
            const fallback = sendToNumber.next().fallback;
            expect(fallback).to.eql({ nextStep: paths.smsNotify.enterMobile });
        });

    });

});

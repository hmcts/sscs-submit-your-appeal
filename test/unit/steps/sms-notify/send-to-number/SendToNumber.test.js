'use strict';
const SendToNumber = require('steps/sms-notify/send-to-number/SendToNumber');
const { expect } = require('test/util/chai');
const { stub } = require('sinon');
const urls = require('urls');
const answer = require('utils/answer');

describe('SendToNumber.js', () => {

    let sendToNumberClass;

    beforeEach(() => {
       sendToNumberClass = new SendToNumber();
       sendToNumberClass.journey = {
           AppellantDetails: {}
       };
       sendToNumberClass.fields = {
           appellantPhoneNumber: {
               value: '07411785336'
           }
       }
    });

    describe('get url()', () => {

        it('returns url /send-to-number', () => {
            expect(sendToNumberClass.url).to.equal(urls.smsNotify.sendToNumber);
        });

    });

    describe('get appellantPhoneNumber()', () => {

        it('should be defined', () => {
            expect(sendToNumberClass.appellantPhoneNumber).to.eq(
                sendToNumberClass.fields.appellantPhoneNumber.value
            );
        });

    });

    describe('get form()', () => {

        it('should contain 2 fields', () => {
            expect(sendToNumberClass.form.fields.length).to.equal(2);
        });

        it('should contain a textField reference called \'appellantPhoneNumber\'', () => {
            const textField = sendToNumberClass.form.fields[0];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('appellantPhoneNumber');
            expect(textField.validations).to.be.empty;
        });

        it('should contain a textField called useSameNumber', () => {
            const textField = sendToNumberClass.form.fields[1];
            expect(textField.constructor.name).to.eq('FieldDesriptor');
            expect(textField.name).to.equal('useSameNumber');
            expect(textField.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        beforeEach(() => {
            sendToNumberClass.fields = stub();
            sendToNumberClass.fields.useSameNumber = {};
            sendToNumberClass.journey.SmsConfirmation = urls.smsNotify.smsConfirmation;
            sendToNumberClass.journey.EnterMobile = urls.smsNotify.enterMobile
        });

        it('returns branch object with condition property', () => {
            sendToNumberClass.fields.useSameNumber.value = answer.YES;
            const branches = sendToNumberClass.next().branches[0];
            expect(branches).to.have.property('condition');
        });

        it('returns branch object where condition nextStep equals /sms-confirmation', () => {
            sendToNumberClass.fields.useSameNumber.value = answer.YES;
            const redirector = {
                nextStep: urls.smsNotify.smsConfirmation
            };
            const branches = sendToNumberClass.next().branches[0];
            expect(branches.redirector).to.eql(redirector)
        });

        it('returns fallback object where nextStep equals /enter-mobile', () => {
            sendToNumberClass.fields.useSameNumber.value = answer.NO;
            const redirector = {
                nextStep: urls.smsNotify.enterMobile
            };
            const fallback = sendToNumberClass.next().fallback;
            expect(fallback).to.eql(redirector);
        });

    });

});

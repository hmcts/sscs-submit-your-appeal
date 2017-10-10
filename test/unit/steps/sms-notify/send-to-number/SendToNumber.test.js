'use strict';

const { expect } = require('test/util/chai');
const { stub } = require('sinon');
const SendToNumber = require('steps/sms-notify/send-to-number/SendToNumber');
const urls = require('urls');

describe('SendToNumber.js', () => {

    let sendToNumberClass;

    beforeEach(() => {
       sendToNumberClass = new SendToNumber;
    });

    after(() => {
       sendToNumberClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /send-to-number', () => {
            expect(sendToNumberClass.url).to.equal('/send-to-number');
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = sendToNumberClass.form.fields[0];
        });

        after(() => {
            field = undefined;
        });

        it('contains the field name useSameNumber', () => {
            expect(field.name).to.equal('useSameNumber');
        });

        it('contains validation', () => {
            expect(field.validator).to.not.be.null;
        });

    });

    describe('next()', () => {

        beforeEach(() => {
            sendToNumberClass.fields = stub();
            sendToNumberClass.fields.useSameNumber = {};
            sendToNumberClass.journey = {
                SmsConfirmation: urls.smsNotify.smsConfirmation,
                EnterMobile: urls.smsNotify.enterMobile
            };
        });

        it('returns branch object with condition property', () => {
            sendToNumberClass.fields.useSameNumber.value = 'yes';
            const branches = sendToNumberClass.next().branches[0];
            console.log(branches)
            expect(branches).to.have.property('condition');
        });

        it('returns branch object where condition nextStep equals /sms-confirmation', () => {
            sendToNumberClass.fields.useSameNumber.value = 'yes';
            const redirector = {
                nextStep: urls.smsNotify.smsConfirmation
            };
            const branches = sendToNumberClass.next().branches[0];
            expect(branches.redirector).to.eql(redirector)
        });

        it('returns fallback object where nextStep equals /enter-mobile', () => {
            sendToNumberClass.fields.useSameNumber.value = 'no';
            const redirector = {
                nextStep: urls.smsNotify.enterMobile
            };
            const fallback = sendToNumberClass.next().fallback;
            expect(fallback).to.eql(redirector);
        });

    });

});

'use strict';

const { expect } = require('test/util/chai');
const { stub } = require('sinon');
const SendToNumber = require('steps/sms-notify/send-to-number/SendToNumber');
const content = require('steps/sms-notify/send-to-number/content.json');

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

    describe('get template()', () => {

        it('returns template path sms-notify/send-to-number/template', () => {
            expect(sendToNumberClass.template).to.equal('sms-notify/send-to-number/template');
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(sendToNumberClass.i18NextContent).to.equal(content);
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
        });

        it('returns the next step url /sms-confirmation when useSameNumber value equals yes', () => {
            const redirector = {
                nextStep: '/sms-confirmation'
            };
            sendToNumberClass.journey = {
                SmsConfirmation: '/sms-confirmation'
            };
            sendToNumberClass.fields.get = stub().returns({value: 'yes'});
            expect(sendToNumberClass.next()).to.eql(redirector);
        });

        it('returns the next step url /enter-mobile when useSameNumber value equals no', () => {
            const redirector = {
                nextStep: '/enter-mobile'
            };
            sendToNumberClass.journey = {
                EnterMobile: '/enter-mobile'
            };
            sendToNumberClass.fields.get = stub().returns({value: 'no'});
            expect(sendToNumberClass.next()).to.eql(redirector);
        });

    });

});
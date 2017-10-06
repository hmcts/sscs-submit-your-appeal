'use strict';

const { expect } = require('test/util/chai');
const SmsConfirmation = require('steps/sms-notify/sms-confirmation/SmsConfirmation');
const content = require('steps/sms-notify/sms-confirmation/content.json');

describe('SmsConfirmation.js', () => {

    let smsConfirmationClass;

    beforeEach(() => {
        smsConfirmationClass = new SmsConfirmation();
    });

    after(() => {
        smsConfirmationClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /sms-confirmation', () => {
            expect(smsConfirmationClass.url).to.equal('/sms-confirmation');
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(smsConfirmationClass.i18NextContent).to.equal(content);
        });

    });

    describe('next()', () => {

        it('returns the next step url /representative', () => {
            const redirector = {
                nextStep: '/representative'
            };
            smsConfirmationClass.journey = {
                Representative: '/representative'
            };
            expect(smsConfirmationClass.next()).to.eql(redirector);
        });

    });

});

'use strict';

const { expect } = require('test/util/chai');
const EnterMobile = require('steps/sms-notify/enter-mobile/EnterMobile');
const content = require('steps/sms-notify/enter-mobile/content.json');

describe('EnterMobile.js', () => {

    let enterMobileClass;

    beforeEach(() => {
       enterMobileClass = new EnterMobile();
    });

    afterEach(() => {
       enterMobileClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /enter-mobile', () => {
           expect(enterMobileClass.url).to.equal('/enter-mobile');
        });

    });

    describe('get template()', () => {

        it('returns template path sms-notify/enter-mobile/template', () => {
            expect(enterMobileClass.template).to.equal('sms-notify/enter-mobile/template');
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(enterMobileClass.i18NextContent).to.equal(content);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = enterMobileClass.form.fields[0];
        });

        afterEach(() => {
            field = undefined;
        });

        it('contains the field name', () => {
           expect(field.name).to.equal('mobileNumber');
        });

        it('contains validation', () => {
            expect(field.validator).to.not.be.null;
        });

        it('contains field content', () => {
            expect(field.content).to.eql(content.en.translation.fields.mobileNumber);
        });

    });

    describe('next()', () => {

        it('returns the next step url', () => {
            const redirector = {
                nextStep: '/sms-confirmation'
            };
            enterMobileClass.journey = {
                SmsConfirmation: '/sms-confirmation'
            };
            expect(enterMobileClass.next()).to.eql(redirector);
        });

    });


});

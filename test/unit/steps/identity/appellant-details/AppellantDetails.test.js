'use strict';

const { expect } = require('test/util/chai');
const AppellantDetails = require('steps/identity/appellant-details/AppellantDetails');
const content = require('steps/identity/appellant-details/content.json');
const urls = require('urls');

describe('AppellantDetails.js', () => {

    let appellantDetailsClass;

    beforeEach(() => {
        appellantDetailsClass = new AppellantDetails();
    });

    after(() => {
        appellantDetailsClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /enter-appellant-details', () => {
            expect(appellantDetailsClass.url).to.equal(urls.identity.enterAppellantDetails);
        });

    });

    describe('get template()', () => {

        it('returns template path identity/appellant-details/template', () => {
            expect(appellantDetailsClass.template).to.equal('identity/appellant-details/template');
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(appellantDetailsClass.i18NextContent).to.equal(content);
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

            it('contains field content', () => {
                expect(field.content).to.eql(content.en.translation.fields.firstName);
            });

        });

        describe('lastName field', () => {

            beforeEach(() => {
                field = fields[1];
            });

            it('contains the field name lastName', () => {
                expect(field.name).to.equal('lastName');
            });

            it('contains field content', () => {
                expect(field.content).to.eql(content.en.translation.fields.lastName);
            });

        });

        describe('niNumber field', () => {

            beforeEach(() => {
                field = fields[2];
            });

            it('contains the field name niNumber', () => {
                expect(field.name).to.equal('niNumber');
            });

            it('contains field content', () => {
                expect(field.content).to.eql(content.en.translation.fields.niNumber);
            });

        });

        describe('addressLine1 field', () => {

            beforeEach(() => {
                field = fields[3];
            });

            it('contains the field name addressLine1', () => {
                expect(field.name).to.equal('addressLine1');
            });

            it('contains field content', () => {
                expect(field.content).to.eql(content.en.translation.fields.addressLine1);
            });

        });

        describe('addressLine2 field', () => {

            beforeEach(() => {
                field = fields[4];
            });

            it('contains the field name addressLine2', () => {
                expect(field.name).to.equal('addressLine2');
            });

            it('contains field content', () => {
                expect(field.content).to.eql(content.en.translation.fields.addressLine2);
            });

        });

        describe('townCity field', () => {

            beforeEach(() => {
                field = fields[5];
            });

            it('contains the field name townCity', () => {
                expect(field.name).to.equal('townCity');
            });

            it('contains field content', () => {
                expect(field.content).to.eql(content.en.translation.fields.townCity);
            });

        });

        describe('postCode field', () => {

            beforeEach(() => {
                field = fields[6];
            });

            it('contains the field name postCode', () => {
                expect(field.name).to.equal('postCode');
            });

            it('contains field content', () => {
                expect(field.content).to.eql(content.en.translation.fields.postCode);
            });

        });

        describe('phoneNumber field', () => {

            beforeEach(() => {
                field = fields[7];
            });

            it('contains the field name phoneNumber', () => {
                expect(field.name).to.equal('phoneNumber');
            });

            it('contains field content', () => {
                expect(field.content).to.eql(content.en.translation.fields.phoneNumber);
            });

        });

        describe('emailAddress field', () => {

            beforeEach(() => {
                field = fields[8];
            });

            it('contains the field name emailAddress', () => {
                expect(field.name).to.equal('emailAddress');
            });

            it('contains field content', () => {
                expect(field.content).to.eql(content.en.translation.fields.emailAddress);
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

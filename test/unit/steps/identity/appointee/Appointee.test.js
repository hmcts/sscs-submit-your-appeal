'use strict';

const { expect } = require('test/util/chai');
const { stub } = require('sinon');
const Appointee = require('steps/identity/appointee/Appointee');
const content = require('steps/identity/appointee/content.json');
const urls = require('urls');

describe('Appointee.js', () => {

    let appointeeClass;

    beforeEach(() => {
        appointeeClass = new Appointee();
    });

    after(() => {
        appointeeClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /are-you-an-appointee', () => {
            expect(appointeeClass.url).to.equal(urls.identity.areYouAnAppointee);
        });

    });

    describe('get template()', () => {

        it('returns template path identity/appointee/template', () => {
            expect(appointeeClass.template).to.equal('identity/appointee/template');
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(appointeeClass.i18NextContent).to.equal(content);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = appointeeClass.form.fields[0];
        });

        after(() => {
            field = undefined;
        });

        it('contains the field name isappointee', () => {
            expect(field.name).to.equal('isappointee');
        });

        it('contains field content', () => {
            expect(field.content).to.eql(content.en.translation.fields.isappointee);
        });

    });

    describe('next()', () => {

        let redirector;

        beforeEach(() => {
            appointeeClass.fields = stub();
            appointeeClass.fields.get = stub();
        });

        after(() => {
            redirector = undefined;
        });

        it('returns the next step url /enter-appointee-details when isappointee value equals yes', () => {
            appointeeClass.fields.get.withArgs('isappointee').returns({value: 'yes'});
            redirector = {
                nextStep: urls.identity.enterAppointeeDetails
            };
            appointeeClass.journey = {
                AppointeeDetails: urls.identity.enterAppointeeDetails
            };
            expect(appointeeClass.next()).to.eql(redirector);
        });


        it('returns the next step url /enter-appellant-details when isappointee value equals no', () => {
            appointeeClass.fields.get.withArgs('isappointee').returns({value: 'no'});
            redirector = {
                nextStep: urls.identity.enterAppellantDetails
            };
            appointeeClass.journey = {
                AppellantDetails: urls.identity.enterAppellantDetails
            };
            expect(appointeeClass.next()).to.eql(redirector);
        });

    });

});

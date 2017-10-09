'use strict';

const { expect } = require('test/util/chai');
const RepresentativeDetails = require('steps/representative/representative-details/RepresentativeDetails');
const content = require('steps/representative/representative-details/content.json');
const urls = require('urls');

describe('RepresentativeDetails.js', () => {

    let representativeDetailsClass;

    beforeEach(() => {
        representativeDetailsClass = new RepresentativeDetails();
    });

    after(() => {
        representativeDetailsClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /representative-details', () => {
            expect(representativeDetailsClass.url).to.equal(urls.representative.representativeDetails);
        });

    });

    describe('get template()', () => {

        it('returns template path representative/representative-details/template', () => {
            expect(representativeDetailsClass.template).to.equal('representative/representative-details/template');
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(representativeDetailsClass.i18NextContent).to.equal(content);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = representativeDetailsClass.form.fields;
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

        describe('organisation field', () => {

            beforeEach(() => {
                field = fields[2];
            });

            it('contains the field name organisation', () => {
                expect(field.name).to.equal('organisation');
            });

            it('doesn\'t contain validation', () => {
                expect(field.validations).to.be.empty;
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

            it('doesn\'t contain validation', () => {
                expect(field.validations).to.be.empty;
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

        describe('county field', () => {

            beforeEach(() => {
                field = fields[6];
            });

            it('contains the field name county', () => {
                expect(field.name).to.equal('county');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('postCode field', () => {

            beforeEach(() => {
                field = fields[7];
            });

            it('contains the field name postCode', () => {
                expect(field.name).to.equal('postCode');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('phoneNumber field', () => {

            beforeEach(() => {
                field = fields[8];
            });

            it('contains the field name phoneNumber', () => {
                expect(field.name).to.equal('phoneNumber');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('emailAddress field', () => {

            beforeEach(() => {
                field = fields[9];
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

        it('returns the next step url /reason-for-appealing', () => {
            const redirector = {
                nextStep: urls.reasonsForAppealing.reasonForAppealing
            };
            representativeDetailsClass.journey = {
                ReasonForAppealing: urls.reasonsForAppealing.reasonForAppealing
            };
            expect(representativeDetailsClass.next()).to.eql(redirector);
        });

    });

});

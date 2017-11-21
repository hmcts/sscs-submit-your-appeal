'use strict';

const AppellantName = require('steps/identity/appellant-name/AppellantName');
const { expect } = require('test/util/chai');
const paths = require('paths');
const answer = require('utils/answer');

describe('AppellantName.js', () => {

    let appellantNameClass;

    beforeEach(() => {
        appellantNameClass = new AppellantName();
        appellantNameClass.journey = {
            Appointee: {}
        };
        appellantNameClass.fields = {
            appointee: {}
        }
    });

    describe('get url()', () => {

        it('returns url /enter-appellant-contact-details', () => {
            expect(appellantNameClass.url).to.equal(paths.identity.enterAppellantName);
        });

    });

    describe('get isAppointee()', () => {

        it('should return true', () => {
            appellantNameClass.fields.appointee.value = answer.YES;
            expect(appellantNameClass.isAppointee).to.eq(true);
        });

        it('should return false', () => {
            appellantNameClass.fields.appointee.value = answer.NO;
            expect(appellantNameClass.isAppointee).to.eq(false);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = appellantNameClass.form.fields;
        });

        after(() => {
            fields = field = undefined;
        });

        describe('title field', () => {

            beforeEach(() => {
                field = fields[0];
            });

            it('contains the field name title', () => {
                expect(field.name).to.equal('title');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('firstName field', () => {

            beforeEach(() => {
                field = fields[1];
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
                field = fields[2];
            });

            it('contains the field name lastName', () => {
                expect(field.name).to.equal('lastName');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });


    });

    describe('next()', () => {

        it('returns the next step url /enter-appellant-dob', () => {
            const redirector = {
                nextStep: paths.identity.enterAppellantDOB
            };
            appellantNameClass.journey = {
                AppellantDOB: paths.identity.enterAppellantDOB
            };
            expect(appellantNameClass.next()).to.eql(redirector);
        });

    });

});

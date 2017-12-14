'use strict';

const AppellantName = require('steps/identity/appellant-name/AppellantName');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('AppellantName.js', () => {

    let appellantNameClass;

    beforeEach(() => {

        appellantNameClass = new AppellantName({
            journey:{
                steps: {
                    AppellantDOB: paths.identity.enterAppellantDOB
                }
            }
        });
        appellantNameClass.fields = {};
    });

    describe('get path()', () => {

        it('returns path /enter-appellant-contact-details', () => {
            expect(AppellantName.path).to.equal(paths.identity.enterAppellantName);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = appellantNameClass.form.fields;
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

        it('returns the next step path /enter-appellant-dob', () => {
            expect(appellantNameClass.next()).to.eql({ nextStep: paths.identity.enterAppellantDOB });
        });

    });

});

'use strict';

const AppellantDOB = require('steps/identity/appellant-dob/AppellantDOB');
const {expect} = require('test/util/chai');
const paths = require('paths');

describe('AppellantDOB.js', () => {

    let appellantDOBClass;

    beforeEach(() => {

        appellantDOBClass = new AppellantDOB({
            journey:{
                steps: {
                    AppellantNINO: paths.identity.enterAppellantNINO
                }
            }
        });

    });

    describe('get path()', () => {

        it('returns path /enter-appellant-dob', () => {
            expect(AppellantDOB.path).to.equal(paths.identity.enterAppellantDOB);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = appellantDOBClass.form.fields;
        });

        describe('day field', () => {

            beforeEach(() => {
                field = fields[0];
            });

            it('contains the field day title', () => {
                expect(field.name).to.equal('day');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('month field', () => {

            beforeEach(() => {
                field = fields[1];
            });

            it('contains the field name month', () => {
                expect(field.name).to.equal('month');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('year field', () => {

            beforeEach(() => {
                field = fields[2];
            });

            it('contains the field name year', () => {
                expect(field.name).to.equal('year');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('next()', () => {

        it('returns the next step path /enter-appellant-nino', () => {
            expect(appellantDOBClass.next()).to.eql({nextStep: paths.identity.enterAppellantNINO});
        });

    });

});

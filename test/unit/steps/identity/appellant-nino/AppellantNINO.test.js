'use strict';

const AppellantNINO = require('steps/identity/appellant-nino/AppellantNINO');
const {expect} = require('test/util/chai');
const paths = require('paths');

describe('AppellantNINO.js', () => {

    let appellantNINO;

    beforeEach(() => {

        appellantNINO = new AppellantNINO({
            journey: {
                steps: {
                    AppellantContactDetails: paths.identity.enterAppellantContactDetails
                }
            }
        });

        appellantNINO.fields = {}

    });

    describe('get path()', () => {

        it('returns path /enter-appellant-nino', () => {
            expect(AppellantNINO.path).to.equal(paths.identity.enterAppellantNINO);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = appellantNINO.form.fields;
        });

        after(() => {
            fields = field = undefined;
        });

        describe('nino field', () => {

            beforeEach(() => {
                field = fields[0];
            });

            it('contains a field with the name nino', () => {
                expect(field.name).to.equal('nino');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('next()', () => {

        it('returns the next step path /enter-appellant-contact-details', () => {
            expect(appellantNINO.next()).to.eql({nextStep: paths.identity.enterAppellantContactDetails});
        });

    });

});

'use strict';

const AppellantNINO = require('steps/identity/appellant-nino/AppellantNINO');
const {expect} = require('test/util/chai');
const paths = require('paths');

describe('AppellantNINO.js', () => {

    let appellantNINOClass;

    beforeEach(() => {

        appellantNINOClass = new AppellantNINO({
            journey: {
                AppellantContactDetails: paths.identity.enterAppellantContactDetails
            }
        });

        appellantNINOClass.fields = {}

    });

    describe('get url()', () => {

        it('returns url /enter-appellant-nino', () => {
            expect(appellantNINOClass.url).to.equal(paths.identity.enterAppellantNINO);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = appellantNINOClass.form.fields;
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

        it('returns the next step url /enter-appellant-contact-details', () => {
            expect(appellantNINOClass.next()).to.eql({nextStep: paths.identity.enterAppellantContactDetails});
        });

    });

});

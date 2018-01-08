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

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('date');
        });

        describe('date field', () => {

            beforeEach(() => {
                field = fields.date;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDescriptor');
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

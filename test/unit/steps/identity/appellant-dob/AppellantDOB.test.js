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

        it('should contain 4 fields', () => {
            expect(Object.keys(fields).length).to.equal(4);
            expect(fields).to.have.all.keys('day', 'month', 'year', 'appointee');
        });

        describe('day field', () => {

            beforeEach(() => {
                field = fields.day;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
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
                field = fields.month;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
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
                field = fields.year;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name year', () => {
                expect(field.name).to.equal('year');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

        describe('appointee field', () => {

            beforeEach(() => {
                field = fields.appointee;
            });

            it('has constructor name Reference', () => {
                expect(field.constructor.name).to.eq('Reference');
            });

            it('contains the field appointee', () => {
                expect(field.name).to.equal('appointee');
            });

        });

    });

    describe('next()', () => {

        it('returns the next step path /enter-appellant-nino', () => {
            expect(appellantDOBClass.next()).to.eql({nextStep: paths.identity.enterAppellantNINO});
        });

    });

});

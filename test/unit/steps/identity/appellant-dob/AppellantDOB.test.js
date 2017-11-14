'use strict';

const AppellantDOB = require('steps/identity/appellant-dob/AppellantDOB');
const { expect } = require('test/util/chai');
const paths = require('paths');
const answer = require('utils/answer');

describe('AppellantDOB.js', () => {

    let appellantDOBClass;

    beforeEach(() => {
        appellantDOBClass = new AppellantDOB();
        appellantDOBClass.journey = {
            Appointee: {}
        };
        appellantDOBClass.fields = {
            appointee: {}
        }
    });

    describe('get url()', () => {

        it('returns url /enter-appellant-dob', () => {
            expect(appellantDOBClass.url).to.equal(paths.identity.enterAppellantDOB);
        });

    });

    describe('get isAppointee()', () => {

        it('should return true', () => {
            appellantDOBClass.fields.appointee.value = answer.YES;
            expect(appellantDOBClass.isAppointee).to.eq(true);
        });

        it('should return false', () => {
            appellantDOBClass.fields.appointee.value = answer.NO;
            expect(appellantDOBClass.isAppointee).to.eq(false);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        beforeEach(() => {
            fields = appellantDOBClass.form.fields;
        });

        after(() => {
            fields = field = undefined;
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

        it('returns the next step url /enter-appellant-nino', () => {
            appellantDOBClass.journey.AppellantNINO = paths.identity.enterAppellantNINO;
            expect(appellantDOBClass.next()).to.eql({nextStep: paths.identity.enterAppellantNINO});
        });

    });

});

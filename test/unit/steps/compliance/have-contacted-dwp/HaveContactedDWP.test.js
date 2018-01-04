'use strict';

const { expect } = require('test/util/chai');
const HaveContactedDWP = require('steps/compliance/have-contacted-dwp/HaveContactedDWP');
const paths = require('paths');
const answer = require('utils/answer');

describe('HaveContactedDWP.js', () => {

    let haveContactedDWP;

    beforeEach(() => {

        haveContactedDWP = new HaveContactedDWP({
            journey: {
                steps: {
                    NoMRN: paths.compliance.noMRN,
                    ContactDWP: paths.compliance.contactDWP
                }
            }
        });

        haveContactedDWP.fields = {
            haveContactedDWP: {}
        };
    });

    describe('get path()', () => {

        it('returns path /have-contacted-dwp', () => {
            expect(HaveContactedDWP.path).to.equal(paths.compliance.haveContactedDWP);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        before(() => {
            fields = haveContactedDWP.form.fields
        });

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('haveContactedDWP');
        });

        describe('haveContactedDWP field', () => {

            beforeEach(() => {
                field = fields.haveContactedDWP;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name haveContactedDWP', () => {
                expect(field.name).to.equal('haveContactedDWP');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers()', () => {

        it('should be hidden', () => {
            expect(haveContactedDWP.answers().hide).to.be.true;
        });

    });

    describe('values()', () => {

        it('should be empty', () => {
            expect(haveContactedDWP.values()).to.be.empty;
        });

    });

    describe('next()', () => {

        it('returns the next step path /dwp-issuing-office when haveAMRN equals Yes', () => {
            haveContactedDWP.fields.haveContactedDWP.value = answer.YES;
            expect(haveContactedDWP.next().step).to.eql(paths.compliance.noMRN);
        });

        it('returns the next step path /have-contacted-dwp when haveAMRN equals No', () => {
            haveContactedDWP.fields.haveContactedDWP.value = answer.NO;
            expect(haveContactedDWP.next().step).to.eql(paths.compliance.contactDWP);
        });

    });

});

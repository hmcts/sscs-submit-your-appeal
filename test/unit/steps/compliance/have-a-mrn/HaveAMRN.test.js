'use strict';

const { expect } = require('test/util/chai');
const HaveAMRN = require('steps/compliance/have-a-mrn/HaveAMRN');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const answer = require('utils/answer');

describe('HaveAMRN.js', () => {

    let haveAMRN;

    beforeEach(() => {

        haveAMRN = new HaveAMRN({
            journey: {
                steps: {
                    DWPIssuingOffice: paths.compliance.dwpIssuingOffice,
                    HaveContactedDWP: paths.compliance.haveContactedDWP
                }
            }
        });

        haveAMRN.fields = {
            haveAMRN: {}
        };
    });

    describe('get path()', () => {

        it('returns path /have-a-mrn', () => {
            expect(HaveAMRN.path).to.equal(paths.compliance.haveAMRN);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        before(() => {
            fields = haveAMRN.form.fields
        });

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('haveAMRN');
        });

        describe('haveAMRN field', () => {

            beforeEach(() => {
                field = fields.haveAMRN;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name pipNumber', () => {
                expect(field.name).to.equal('haveAMRN');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers()', () => {

        it('should be hidden', () => {
            expect(haveAMRN.answers().hide).to.be.true;
        });

    });

    describe('values()', () => {

        it('should be empty', () => {
            expect(haveAMRN.values()).to.be.empty;
        });

    });

    describe('next()', () => {

        it('returns the next step path /dwp-issuing-office when haveAMRN equals Yes', () => {
            haveAMRN.fields.haveAMRN.value = answer.YES;
            expect(haveAMRN.next().step).to.eql(paths.compliance.dwpIssuingOffice);
        });

        it('returns the next step path /have-contacted-dwp when haveAMRN equals No', () => {
            haveAMRN.fields.haveAMRN.value = answer.NO;
            expect(haveAMRN.next().step).to.eql(paths.compliance.haveContactedDWP);
        });

    });

});

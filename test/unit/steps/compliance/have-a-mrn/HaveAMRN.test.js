'use strict';

const { expect } = require('test/util/chai');
const { Reference } = require('@hmcts/one-per-page/forms');
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
    });

    describe('get path()', () => {

        it('returns path /have-a-mrn', () => {
            expect(haveAMRN.path).to.equal(paths.compliance.haveAMRN);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {

            field = haveAMRN.form.fields[0];

        });

        it('contains the field name haveAMRN', () => {
            expect(field.name).to.equal('haveAMRN');
        });

        it('contains validation', () => {
            expect(field.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        it('returns the next step path /dwp-issuing-office when haveAMRN equals Yes', () => {
            haveAMRN.fields.haveAMRN.value = 'yes';
            expect(haveAMRN.next().step).to.eql(paths.compliance.dwpIssuingOffice);
        });

        it('returns the next step path /have-contacted-dwp when haveAMRN equals No', () => {
            haveAMRN.fields.haveAMRN.value = 'no';
            expect(haveAMRN.next().step).to.eql(paths.compliance.haveContactedDWP);
        });

    });

});

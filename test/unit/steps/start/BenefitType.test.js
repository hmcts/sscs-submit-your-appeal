'use strict';

const { expect } = require('test/util/chai');
const paths = require('paths');
const BenefitType = require('steps/start/benefit-type/BenefitType');

describe('BenefitType.js', () => {

    let benefitType;

    beforeEach(() => {

        benefitType = new BenefitType({
            journey: {
                steps: {
                    AppointeeFormDownload: paths.identity.downloadAppointeeForm,
                    PostcodeChecker: paths.start.postcodeCheck
                }
            }
        });

    });

    describe('get path()', () => {

        it('returns path /benefit-type', () => {
            expect(BenefitType.path).to.equal(paths.start.benefitType);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = benefitType.form.fields[0];
        });

        it('contains the field name benefitType', () => {
            expect(field.name).to.equal('benefitType');
        });

        it('contains validation', () => {
            expect(field.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        it('returns the next step path /mrn-date with benefit type value is not PIP', () => {
            benefitType.fields.benefitType.value = 'not PIP';
            expect(benefitType.next().step).to.eql(paths.identity.downloadAppointeeForm);
        });

        it('returns the next step path /postcode-check with benefit type value is PIP', () => {
            benefitType.fields.benefitType.value = 'Personal Independence Payment (PIP)';
            expect(benefitType.next().step).to.eql(paths.start.postcodeCheck);
        });

    });

});

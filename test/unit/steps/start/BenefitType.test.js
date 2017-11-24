'use strict';

const { expect } = require('test/util/chai');
const paths = require('paths');
const BenefitType = require('steps/start/BenefitType');

describe('BenefitType.js', () => {

    let benefitType;

    beforeEach(() => {

        benefitType = new BenefitType({
            journey: {
                MRNDate: paths.compliance.mrnDate
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

        after(() => {
            field = undefined;
        });

        it('contains the field name benefitType', () => {
            expect(field.name).to.equal('benefitType');
        });

        it('contains validation', () => {
            expect(field.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        it('returns the next step path /mrn-date', () => {
            expect(benefitType.next()).to.eql({ nextStep: paths.compliance.mrnDate });
        });

    });

});

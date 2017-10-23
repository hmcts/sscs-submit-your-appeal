'use strict';

const { expect } = require('test/util/chai');
const paths = require('paths');
const BenefitType = require('steps/start/BenefitType');

describe('BenefitType.js', () => {

    let benefitTypeClass;

    beforeEach(() => {
        benefitTypeClass = new BenefitType();
    });

    after(() => {
        benefitTypeClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /benefit-type', () => {
            expect(benefitTypeClass.url).to.equal(paths.start.benefitType);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = benefitTypeClass.form.fields[0];
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

        it('returns the next step url /mrn-date', () => {
            const redirector = {
                nextStep: paths.compliance.mrnDate
            };
            benefitTypeClass.journey = {
                MRNDate: paths.compliance.mrnDate
            };
            expect(benefitTypeClass.next()).to.eql(redirector);
        });

    });


});

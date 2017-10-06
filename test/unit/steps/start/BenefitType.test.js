'use strict';

const { expect } = require('test/util/chai');
const urls = require('urls');
const BenefitType = require('steps/start/BenefitType');
const content = require('steps/start/content.json');

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
            expect(benefitTypeClass.url).to.equal(urls.start.benefitType);
        });

    });

    describe('get i18NextContent()', () => {

        it('returns the correct content for the page', () => {
            expect(benefitTypeClass.i18NextContent).to.equal(content);
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
                nextStep: urls.compliance.mrnDate
            };
            benefitTypeClass.journey = {
                MRNDate: urls.compliance.mrnDate
            };
            expect(benefitTypeClass.next()).to.eql(redirector);
        });

    });


});

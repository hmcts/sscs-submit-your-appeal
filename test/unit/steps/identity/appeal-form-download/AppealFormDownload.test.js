'use strict';

const AppealFormDownload = require('steps/appeal-form-download/AppealFormDownload');
const {expect} = require('test/util/chai');
const paths = require('paths');
const urls = require('urls');
const benefitTypes = require('steps/start/benefit-type/types');

describe('AppealFormDownload.js', () => {

    let appealFormDownload;

    beforeEach(() => {

        appealFormDownload = new AppealFormDownload({
            journey: {
                steps: {}
            }
        });
        appealFormDownload.fields = {
            benefitType: {}
        }

    });

    describe('get path()', () => {

        it('returns path /appointee-form-download', () => {
            expect(AppealFormDownload.path).to.equal(paths.appealFormDownload);
        });

    });

    describe('get benefitType()', () => {

        it('returns correct wording', () => {
            appealFormDownload.fields.benefitType.value = 'some benefitType';
            expect(appealFormDownload.benefitType).to.equal('some benefitType');
        });

    });

    describe('get getFormLink()', () => {

        it('returns SSCS5 form link when Benefit type is Child Benefit', () => {
            appealFormDownload.fields.benefitType.value = benefitTypes.childBenefit;
            expect(appealFormDownload.formDownload.link).to.equal(urls.formDownload.sscs5);
        });

        it('returns SSCS5 form type when Benefit type is Child Benefit', () => {
            appealFormDownload.fields.benefitType.value = benefitTypes.childBenefit;
            expect(appealFormDownload.formDownload.type).to.equal('SSCS5');
        });

        it('returns SSCS1 form link when Benefit type is not Child Benefit', () => {
            appealFormDownload.fields.benefitType.value = benefitTypes.socialFund;
            expect(appealFormDownload.formDownload.link).to.equal(urls.formDownload.sscs1);
        });

        it('returns SSCS1 form type when Benefit type is not Child Benefit', () => {
            appealFormDownload.fields.benefitType.value = benefitTypes.socialFund;
            expect(appealFormDownload.formDownload.type).to.equal('SSCS1');
        });

    });

    describe('get form()', () => {

        it('should contain 1 fields', () => {
            expect(Object.keys(appealFormDownload.form.fields).length).to.equal(1);
        });

        it('should contain a textField reference called \'benefitType\'', () => {
            const textField = appealFormDownload.form.fields.benefitType;
            expect(textField.constructor.name).to.eq('FieldDescriptor');
            expect(textField.validations).to.be.empty;
        });

    });

});

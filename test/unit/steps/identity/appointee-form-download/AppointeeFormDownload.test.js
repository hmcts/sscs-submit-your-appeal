'use strict';

const AppointeeFormDownload = require('steps/identity/appointee-form-download/AppointeeFormDownload');
const {expect} = require('test/util/chai');
const paths = require('paths');
const urls = require('urls');

describe('AppointeeFormDownload.js', () => {

    let appointeeFormDownload;

    beforeEach(() => {

        appointeeFormDownload = new AppointeeFormDownload({
            journey: {
                steps: {}
            }
        });
        appointeeFormDownload.fields = {
            benefitType: {}
        }

    });

    describe('get path()', () => {

        it('returns path /appointee-form-download', () => {
            expect(AppointeeFormDownload.path).to.equal(paths.identity.downloadAppointeeForm);
        });

    });

    describe('get benefitType()', () => {

        it('returns correct wording', () => {
            appointeeFormDownload.fields.benefitType.value = 'some benefitType';
            expect(appointeeFormDownload.benefitType).to.equal('some benefitType');
        });

    });

    describe('get getFormLink()', () => {

        it('returns correct SSCS5 form link when Benefit type is Carer\'s Allowance', () => {
            appointeeFormDownload.fields.benefitType.value = 'Carer’s Allowance';
            expect(appointeeFormDownload.getFormLink).to.equal(urls.formDownload.sscs5);
        });

        it('returns correct SSCS5 form link when Benefit type is Child Benefit', () => {
            appointeeFormDownload.fields.benefitType.value = 'Child Benefit';
            expect(appointeeFormDownload.getFormLink).to.equal(urls.formDownload.sscs5);
        });

        it('returns correct SSCS1 form link when Benefit type is not Carer\'s Allowance or Child Benefit', () => {
            appointeeFormDownload.fields.benefitType.value = 'Social Fund';
            expect(appointeeFormDownload.getFormLink).to.equal(urls.formDownload.sscs1);
        });

    });

    describe('get form()', () => {

        it('should contain 1 fields', () => {
            expect(appointeeFormDownload.form.fields.length).to.equal(1);
        });

        it('should contain a textField reference called \'benefitType\'', () => {
            const textField = appointeeFormDownload.form.fields[0];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('benefitType');
            expect(textField.validations).to.be.empty;
        });

    });

});

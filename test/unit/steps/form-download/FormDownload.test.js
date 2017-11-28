'use strict';

const FormDownload = require('steps/form-download/FormDownload');
const {expect} = require('test/util/chai');
const paths = require('paths');

describe('FormDownload.js', () => {

    let formDownloadSut;

    beforeEach(() => {
        formDownloadSut = new FormDownload();
        formDownloadSut.journey = {};
        formDownloadSut.fields = {
            benefitType: {}
        }

    });

    describe('get url()', () => {

        it('returns url /form-download', () => {
            expect(formDownloadSut.url).to.equal(paths.formDownload);
        });

    });

    describe('get benefitType()', () => {

        it('returns correct wording', () => {
            formDownloadSut.fields.benefitType.value = 'some benefitType';
            expect(formDownloadSut.benefitType).to.equal('Download and fill out a form to appeal a [some benefitType] benefit decision.');
        });

    });

    describe('get form()', () => {

        it('should contain 1 fields', () => {
            expect(formDownloadSut.form.fields.length).to.equal(1);
        });

        it('should contain a textField reference called \'benefitType\'', () => {
            const textField = formDownloadSut.form.fields[0];
            expect(textField.constructor.name).to.eq('Reference');
            expect(textField.name).to.equal('benefitType');
            expect(textField.validations).to.be.empty;
        });

    });

});

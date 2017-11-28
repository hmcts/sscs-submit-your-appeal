'use strict';

const FormDownload = require('steps/form-download/FormDownload');
const {expect} = require('test/util/chai');
const paths = require('paths');

describe('FormDownload.js', () => {

    let formDownloadSut;

    beforeEach(() => {
        formDownloadSut = new FormDownload();

        formDownloadSut.fields = {
            benefitType: {}
        }
    });

    describe('get url()', () => {

        it('returns url /form-download', () => {
            expect(formDownloadSut.url).to.equal(paths.formDownload);
        });

    });

    describe.only('get benefitType()', () => {

        it('returns correct wording', () => {
            formDownloadSut.fields.benefitType.value = 'some benefitType';
            expect(formDownloadSut.benefitType).to.equal('Download and fill out a [Form name here] form to appeal a [some benefitType] benefit decision.');
        });

    });

});

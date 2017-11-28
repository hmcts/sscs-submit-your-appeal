'use strict';

const FormDownload = require('steps/form-download/FormDownload');
const {expect} = require('test/util/chai');
const paths = require('paths');

describe('FormDownload.js', () => {

    let formDownloadSut;

    beforeEach(() => {
        formDownloadSut = new FormDownload();
    });

    describe.only('get url()', () => {

        it('returns url /form-download', () => {
            expect(formDownloadSut.url).to.equal(paths.formDownload);
        });

    });


});

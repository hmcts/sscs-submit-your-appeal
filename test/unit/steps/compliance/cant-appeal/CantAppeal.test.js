'use strict';

const { expect } = require('test/util/chai');
const CantAppeal = require('steps/compliance/cant-appeal/CantAppeal');
const urls = require('urls');

describe('CantAppeal.js', () => {

    let cantAppealClass;

    beforeEach(() => {
       cantAppealClass = new CantAppeal;
    });

    after(() => {
       cantAppealClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /cant-appeal', () => {
            expect(cantAppealClass.url).to.equal(urls.compliance.cantAppeal);
        });

    });

});

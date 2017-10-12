'use strict';

const { expect } = require('test/util/chai');
const Confirmation = require('steps/confirmation/Confirmation');
const urls = require('urls');

describe('Confirmation.js', () => {

    let confirmationClass;

    beforeEach(() => {
        confirmationClass = new Confirmation();
    });

    after(() => {
        confirmationClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /confirmation', () => {
            expect(confirmationClass.url).to.equal(urls.confirmation);
        });

    });

});

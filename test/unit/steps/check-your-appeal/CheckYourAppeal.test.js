'use strict';

const { expect } = require('test/util/chai');
const CheckYourAppeal = require('steps/check-your-appeal/CheckYourAppeal');
const paths = require('paths');

describe('CheckYourAppeal.js', () => {

    let checkYourAppeal;

    beforeEach(() => {

        checkYourAppeal = new CheckYourAppeal({ journey: {
            Confirmation: paths.confirmation
        } });

    });

    describe('get url()', () => {

        it('returns url /check-your-appeal', () => {
            expect(checkYourAppeal.url).to.equal(paths.checkYourAppeal);
        });

    });

    describe('next()', () => {

        it('returns the next step url /confirmation', () => {
            expect(checkYourAppeal.next()).to.eql({ nextStep: paths.confirmation});
        });

    });

});

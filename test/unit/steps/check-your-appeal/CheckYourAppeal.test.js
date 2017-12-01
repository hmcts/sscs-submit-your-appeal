'use strict';

const { expect } = require('test/util/chai');
const CheckYourAppeal = require('steps/check-your-appeal/CheckYourAppeal');
const paths = require('paths');

describe('CheckYourAppeal.js', () => {

    let checkYourAppeal;

    beforeEach(() => {

        checkYourAppeal = new CheckYourAppeal({
            journey: {
                steps: {
                    Confirmation: paths.confirmation
                }
        }   });

    });

    describe('get path()', () => {

        it('returns path /check-your-appeal', () => {
            expect(CheckYourAppeal.path).to.equal(paths.checkYourAppeal);
        });

    });

    describe('next()', () => {

        it('returns the next step path /confirmation', () => {
            expect(checkYourAppeal.next()).to.eql({ nextStep: paths.confirmation});
        });

    });

});

'use strict';

const { expect } = require('test/util/chai');
const CheckYourAppeal = require('steps/check-your-appeal/CheckYourAppeal');
const urls = require('urls');

describe('CheckYourAppeal.js', () => {

    let checkYourAppealClass;

    beforeEach(() => {
        checkYourAppealClass = new CheckYourAppeal();
    });

    after(() => {
        checkYourAppealClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /check-your-appeal', () => {
            expect(checkYourAppealClass.url).to.equal(urls.checkYouAppeal);
        });

    });

    describe('next()', () => {

        it('returns the next step url /confirmation', () => {
            const redirector = {
                nextStep: urls.confirmation
            };
            checkYourAppealClass.journey = {
                Confirmation: urls.confirmation
            };
            expect(checkYourAppealClass.next()).to.eql(redirector);
        });

    });

});

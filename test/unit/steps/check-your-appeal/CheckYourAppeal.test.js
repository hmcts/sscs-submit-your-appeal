'use strict';

const { expect } = require('test/util/chai');
const CheckYourAppeal = require('steps/check-your-appeal/CheckYourAppeal');
const paths = require('paths');

describe('CheckYourAppeal.js', () => {

    let checkYourAppealClass;

    beforeEach(() => {
        checkYourAppealClass = new CheckYourAppeal();
        checkYourAppealClass.journey = {};
    });

    describe('get url()', () => {

        it('returns url /check-your-appeal', () => {
            expect(checkYourAppealClass.url).to.equal(paths.checkYourAppeal);
        });

    });

    describe('get form()', () => {

        it('should be defined', () => {
            expect(checkYourAppealClass.form).to.be.undefined;
        });

    });

    describe('next()', () => {

        it('returns the next step url /confirmation', () => {
            checkYourAppealClass.journey.Confirmation = paths.confirmation;
            expect(checkYourAppealClass.next()).to.eql({ nextStep: paths.confirmation});
        });

    });

});

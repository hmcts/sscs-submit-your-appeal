'use strict';

const { expect } = require('test/util/chai');
const Entry = require('steps/entry/Entry');
const paths = require('paths');

describe('Entry.js', () => {

    let entryClass;

    beforeEach(() => {
       entryClass = new Entry();
    });

    after(() => {
        entryClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /', () => {
            expect(entryClass.url).to.equal(paths.session.entry);
        });

    });

    describe('next()', () => {

        it('returns the next step url /benefit-type', () => {
            const redirector = {
                nextStep: paths.start.benefitType
            };
            entryClass.journey = {
                BenefitType: paths.start.benefitType
            };
            expect(entryClass.next()).to.eql(redirector);
        });

    });

});

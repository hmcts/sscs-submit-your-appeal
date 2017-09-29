'use strict';

const { expect } = require('test/util/chai');
const Entry = require('steps/entry/Entry');
const urls = require('url');

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
            expect(entryClass.url).to.equal(urls.session.entry);
        });

    });

    describe('next()', () => {

        it('returns the next step url /benefit-type', () => {
            const redirector = {
                nextStep: urls.start.benefitType
            };
            entryClass.journey = {
                BenefitType: urls.start.benefitType
            };
            expect(entryClass.next()).to.eql(redirector);
        });

    });

});
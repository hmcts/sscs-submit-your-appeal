'use strict';

const { expect } = require('test/util/chai');
const Entry = require('steps/entry/Entry');
const paths = require('paths');

describe('Entry.js', () => {

    let entry;

    beforeEach(() => {

       entry = new Entry({
           journey: {
               BenefitType: paths.start.benefitType
           }
       });

    });

    describe('get path()', () => {

        it('returns path /entry', () => {
            expect(Entry.path).to.equal(paths.session.entry);
        });

    });

    describe('next()', () => {

        it('returns the next step path /benefit-type', () => {
            expect(entry.next()).to.eql({ nextStep: paths.start.benefitType });
        });

    });

});

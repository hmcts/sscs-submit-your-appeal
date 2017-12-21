'use strict';

const { expect } = require('test/util/chai');
const paths = require('paths');
const Independence = require('steps/start/independence/Independence');

describe('Independence.js', () => {

    let independence;

    beforeEach(() => {

        independence = new Independence({
            journey: {
                steps: {
                    HaveAMRN: paths.compliance.haveAMRN
                }
            }
        });

    });

    describe('answers()', () => {

        it('should be hidden', () => {
            expect(independence.answers().hide).to.be.true;
        });

    });

    describe('get path()', () => {

        it('returns path /independence', () => {
            expect(independence.path).to.equal(paths.start.independence);
        });

    });

    describe('next()', () => {

        it('returns the next step path /mrn-date', () => {
            expect(independence.next().step).to.eql(paths.compliance.haveAMRN);
        });

    });

});

'use strict';

const NoRepresentativeDetails = require('steps/representative/no-representative-details/NoRepresentativeDetails');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('NoRepresentativeDetails.js', () => {

    let noRepresentativeDetails;

    beforeEach(() => {
        noRepresentativeDetails = new NoRepresentativeDetails({
            journey: {
                steps: {
                    ReasonForAppealing: paths.reasonsForAppealing.reasonForAppealing
                }
            }
        });

        noRepresentativeDetails.fields = {
            otherReasonForAppealing: {}
        }
    });

    describe('get path()', () => {

        it('returns path /no-representative-details', () => {
            expect(noRepresentativeDetails.path).to.equal(paths.representative.noRepresentativeDetails);
        });

    });

    describe('answers()', () => {

        it('should be empty', ()=> {
            expect(noRepresentativeDetails.answers()).to.be.empty;
        });

    });

    describe('values()', () => {

        it('should contain a value object', () => {
            const values = noRepresentativeDetails.values();
            expect(values).to.eql( { representative: { hasRepresentative: false } });
        });

    });

    describe('next()', () => {

        it('returns the next step path /sending-evidence', () => {
            expect(noRepresentativeDetails.next().step).to.eq(paths.reasonsForAppealing.reasonForAppealing);

        });

    });

});

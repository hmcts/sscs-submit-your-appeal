'use strict';

const HearingSupport = require('steps/hearing/support/HearingSupport');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('HearingSupport.js', () => {

    let hearingSupport;

    beforeEach(() => {
        hearingSupport = new HearingSupport({
            journey: {
                HearingAvailability: paths.hearing.hearingAvailability,
                HearingArrangements: paths.hearing.hearingArrangements
            }
        });
    });

    describe('get path()', () => {

        it('returns path /hearing-support', () => {
            expect(HearingSupport.path).to.equal(paths.hearing.hearingSupport);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {
            field = hearingSupport.form.fields[0];
        });

        after(() => {
            field = undefined;
        });

        it('contains the field name arrangements', () => {
            expect(field.name).to.equal('arrangements');
        });

        it('contains validation', () => {
            expect(field.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        it('returns branch object where condition nextStep equals /arrangements', () => {
            const nextStep = hearingSupport.next().branches[0].redirector.nextStep;
            expect(nextStep).to.eq(paths.hearing.hearingArrangements);

        });

        it('returns fallback object where nextStep equals /hearing-availability', () => {
            const nextStep = hearingSupport.next().fallback.nextStep;
            expect(nextStep).to.eq(paths.hearing.hearingAvailability);
        });

    });

});

'use strict';

const { expect } = require('test/util/chai');
const Representative = require('steps/representative/representative/Representative');
const paths = require('paths');

describe('Representative.js', () => {

    let representative;

    beforeEach(() => {

        representative = new Representative({
            journey: {
                RepresentativeDetailsToHand: paths.representative.representativeDetailsToHand,
                ReasonForAppealing: paths.reasonsForAppealing.reasonForAppealing
            }
        });

    });

    describe('get path()', () => {

        it('returns path /representative', () => {
            expect(Representative.path).to.equal(paths.representative.representative);
        });

    });

    describe('get form()', () => {

        let field;

        beforeEach(() => {

            field = representative.form.fields[0];

        });

        it('contains the field name hasRepresentative', () => {
            expect(field.name).to.equal('hasRepresentative');
        });

        it('contains validation', () => {
            expect(field.validations).to.not.be.empty;
        });

    });

    describe('next()', () => {

        it('nextStep equals /representative-details', () => {
            const branches = representative.next().branches[0];
            expect(branches.redirector).to.eql({ nextStep: paths.representative.representativeDetailsToHand })
        });

        it('nextStep equals /reason-for-appealing', () => {
            const fallback = representative.next().fallback;
            expect(fallback).to.eql({ nextStep: paths.reasonsForAppealing.reasonForAppealing });
        });

    });

});

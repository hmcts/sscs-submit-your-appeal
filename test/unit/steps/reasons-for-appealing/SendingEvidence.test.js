'use strict';

const { expect } = require('test/util/chai');
const SendingEvidence = require('steps/reasons-for-appealing/sending-evidence/SendingEvidence');
const paths = require('paths');

describe('SendingEvidence.js', () => {

    let sendingEvidence;

    before(() => {

        sendingEvidence = new SendingEvidence({
            journey: {
                steps: {
                    TheHearing: paths.hearing.theHearing
                }
            }
        });

        sendingEvidence.fields = {
            emailAddress: {}
        }

    });

    describe('get hasSignedUpForEmail()', () => {

        it('should be true when the email address has been defined', () => {
            sendingEvidence.fields.emailAddress.value = 'harry.potter@wizards.com';
            expect(sendingEvidence.hasSignedUpForEmail).to.be.true;
        });

        it('should be false when the email address has not been defined', () => {
            sendingEvidence.fields.emailAddress.value = undefined;
            expect(sendingEvidence.hasSignedUpForEmail).to.be.false;
        });

    });

    describe('get path()', () => {

        it('returns path /sending-evidence', () => {
            expect(SendingEvidence.path).to.equal(paths.reasonsForAppealing.sendingEvidence);
        });

    });

    describe('next()', () => {

        it('nextStep equals /the-hearing', () => {
            expect(sendingEvidence.next().step).to.eql(paths.hearing.theHearing)
        });

    });

});

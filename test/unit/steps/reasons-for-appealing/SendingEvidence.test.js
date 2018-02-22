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

    describe('get form()', () => {

        let fields;
        let field;

        before(() => {
            fields = sendingEvidence.form.fields
        });

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('emailAddress');
        });

        describe('emailAddress ref field', () => {

            beforeEach(() => {
                field = fields.emailAddress;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('Reference');
            });

            it('contains the field name emailAddress', () => {
                expect(field.name).to.equal('emailAddress');
            });

        });

    });

    describe('answers()', () => {

        it('should be hidden', () => {
            expect(sendingEvidence.answers().hide).to.be.true;
        });

    });

    describe('next()', () => {

        it('nextStep equals /the-hearing', () => {
            expect(sendingEvidence.next().step).to.eql(paths.hearing.theHearing)
        });

    });

});

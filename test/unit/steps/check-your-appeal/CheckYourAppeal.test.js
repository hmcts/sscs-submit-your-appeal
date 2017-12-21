'use strict';

const { expect, sinon } = require('test/util/chai');
const sections = require('steps/check-your-appeal/sections');
const proxyquire = require('proxyquire');
const paths = require('paths');

describe('CheckYourAppeal.js', () => {

    let CheckYourAppeal;
    let request = {};
    let cya;
    let field;


    before(() => {

        CheckYourAppeal = proxyquire('steps/check-your-appeal/CheckYourAppeal', { 'superagent': request });

        cya = new CheckYourAppeal({
            journey: {
                steps: {
                    Confirmation: paths.confirmation
                },
                values: {
                    benefit: {
                        type: 'PIP'
                    },
                    isAppointee: false,
                    hasRepresentative: true
                },
                settings: {
                    apiUrl: '/appeals'
                }
            }
        });

        cya.fields = {
            signer: {
                value: "Mr Tester"
            }
        };

        field = cya.form.fields[0];
    });

    describe('get path()', () => {

        it('returns path /check-your-appeal', () => {
            expect(CheckYourAppeal.path).to.equal(paths.checkYourAppeal);
        });

    });

    describe('sendToAPI()', () => {

        it('should make an API call to the /appeals endpoint with appeal JSON', () => {
            const sendStub = sinon.stub();
            request.post = sinon.stub().returns({
                send: sendStub
            });

            // Assert
            cya.sendToAPI();
            sinon.assert.calledWith(request.post, cya.journey.settings.apiUrl);
            sinon.assert.calledWith(sendStub, cya.journey.values);
        });

    });

    describe('get section()', () => {

        it('returns the CYA sections', () => {
            const cyaSections = cya.sections();
            Object.values(sections).map(function(value, index) {
                expect(cyaSections[index].id).to.equal(value);
            });
        });

    });

    describe('get form()', () => {

        describe('signer field', () => {

            it('contains a field with the name signer', () => {
                expect(field.name).to.equal('signer');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('get values()', () => {

        it('contains the signAndSubmit json object field', () => {
            expect(cya.values().signAndSubmit.signer).to.equal('Mr Tester');
        });

    });

    describe('next()', () => {

        it('returns the next step path /confirmation', () => {
            const action = cya.next();
            expect(action.nextFlow.nextStep).to.eql(paths.confirmation);
        });

    });

    describe('termsAndConditionPath()', () => {

        it('should return /terms-and-conditions', () => {
            expect(cya.termsAndConditionPath).to.equal(paths.policy.termsAndConditions);
        });
    });

});

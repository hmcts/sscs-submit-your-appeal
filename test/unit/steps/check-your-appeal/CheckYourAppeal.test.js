'use strict';

const { expect, sinon } = require('test/util/chai');
const sections = require('steps/check-your-appeal/sections');
const proxyquire = require('proxyquire');
const paths = require('paths');

describe('CheckYourAppeal.js', () => {

    let CheckYourAppeal;
    let request = {};
    let cya;

    before(() => {

        CheckYourAppeal = proxyquire('steps/check-your-appeal/CheckYourAppeal', { 'request-promise-native': request });

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
    });

    describe('get path()', () => {

        it('returns path /check-your-appeal', () => {
            expect(CheckYourAppeal.path).to.equal(paths.checkYourAppeal);
        });

    });

    describe('sendToAPI()', () => {

        it('should make an API call to the /appeals endpoint with appeal JSON', () => {
            request.post = sinon.spy();
            const endpoint = cya.journey.settings.apiUrl;
            const json = cya.journey.values;

            // Assert
            cya.sendToAPI();
            sinon.assert.calledWith(request.post, endpoint, { json });
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

    describe('next()', () => {

        it('returns the next step path /confirmation', () => {
            const action = cya.next();
            expect(action.nextFlow.nextStep).to.eql(paths.confirmation);
        });

    });

});

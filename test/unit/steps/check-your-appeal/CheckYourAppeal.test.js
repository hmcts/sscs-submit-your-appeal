'use strict';

const { expect } = require('test/util/chai');
const sections = require('steps/check-your-appeal/sections');
const proxyquire = require('proxyquire');
const paths = require('paths');

describe('CheckYourAppeal.js', () => {

    let CheckYourAppeal;
    let request = {};
    let cya;
    let fields;


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

        fields = cya.form.fields;
    });

    describe('get path()', () => {

        it('returns path /check-your-appeal', () => {
            expect(CheckYourAppeal.path).to.equal(paths.checkYourAppeal);
        });

    });

    describe('get section()', () => {

        it('returns the CYA sections', () => {
            const cyaSections = cya.sections();
            Object.values(sections).map((value, index) => expect(cyaSections[index].id).to.equal(value));
        });

    });

    describe('get form()', () => {

        let field;

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('signer');
        });

        describe('signer field', () => {

            beforeEach(() => {
                field = fields.signer;
            });

            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

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

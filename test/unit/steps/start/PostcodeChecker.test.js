'use strict';

const { expect } = require('test/util/chai');
const paths = require('paths');
const PostcodeChecker = require('steps/start/postcode-checker/PostcodeChecker');

describe('PostcodeChecker.js', () => {

    let postcodeChecker;

    beforeEach(() => {

        postcodeChecker = new PostcodeChecker({
            journey: {
                steps: {
                    Independence: paths.start.independence,
                    InvalidPostcode: paths.start.invalidPostcode
                }
            }
        });

    });

    describe('get path()', () => {

        it('returns path /postcode-check', () => {
            expect(postcodeChecker.path).to.equal(paths.start.postcodeCheck);
        });

    });

    describe('get form()', () => {

        let fields;
        let field;

        before(() => {
            fields = postcodeChecker.form.fields
        });

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('postcode');
        });

        describe('postcode field', () => {

            beforeEach(() => {
                field = fields.postcode;
            });


            it('has constructor name FieldDescriptor', () => {
                expect(field.constructor.name).to.eq('FieldDesriptor');
            });

            it('contains the field name postcode', () => {
                expect(field.name).to.equal('postcode');
            });

            it('contains validation', () => {
                expect(field.validations).to.not.be.empty;
            });

        });

    });

    describe('answers()', () => {

        it('should be hidden', () => {
            expect(postcodeChecker.answers().hide).to.be.true;
        });

    });

    describe('values()', () => {

        it('should...', ()=> {
            const value = 'TN32 4GT';
            postcodeChecker.fields = { postcode: { value } };
            const values = postcodeChecker.values();
            expect(values).to.eql({postCodeCheck: value});
        });

    });

    describe('next()', () => {

        it('returns the next step path /independence if postcode is on the list of acceptable postcodes', () => {
            postcodeChecker.fields.postcode.value = 'WV11 2HE';
            expect(postcodeChecker.next().step).to.eql(paths.start.independence);
        });

        it('returns the next step path /invalid-postcode if postcode is not on the list of acceptable postcodes', () => {
            postcodeChecker.fields.postcode.value = 'SW1P 4DF';
            expect(postcodeChecker.next().step).to.eql(paths.start.invalidPostcode);
        });

    });

});

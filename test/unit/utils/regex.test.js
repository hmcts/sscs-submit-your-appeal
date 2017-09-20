const content = require('steps/identity/appellant-details/content.json').en.translation;
const { regex } = require('utils/Validators');
const { expect } = require('test/util/chai');
const { firstName, lastName, whitelist, niNumber, phoneNumber } = require('utils/regex');

const Joi = require('joi');

describe('validating a string', () => {

    it("should validate an address line", () => {
        const stringValidator = regex(whitelist, content.fields.addressLine1);
        expect(stringValidator({value: '45 Wharf Road'})).to.equal(null);
    });

});

describe('validating a first name regular expression', () => {

    it("should validate against a first name like 'Sarah'", () => {
        const firstNameValidator = regex(firstName, content.fields.firstName);
        expect(firstNameValidator({value: 'Sarah'})).to.equal(null);
    });

    it("should validate against a double-barrelled first name like 'Sarah-jane'", () => {
        const firstNameValidator = regex(firstName, content.fields.firstName);
        expect(firstNameValidator({value: 'Sarah-jane'})).to.equal(null);
    });

    it("should not validate against numbers '12345'", () => {
        const firstNameValidator = regex(firstName, content.fields.firstName);
        expect(firstNameValidator({ value: '12345' })).to.equal(content.fields.firstName.error.msg);
    });

    it("should not validate against special characters '!@£$%^&*<>/'", () => {
        const firstNameValidator = regex(firstName, content.fields.firstName);
        expect(firstNameValidator({ value: '!@£$%^&*<>/' })).to.equal(content.fields.firstName.error.msg);
    });

});

describe('validating a last name regular expression', () => {

    it("should validate against a last name like 'Oliver'", () => {
        const lastNameValidator = regex(lastName, content.fields.firstName);
        expect(lastNameValidator({value: 'Oliver'})).to.equal(null);
    });

    it("should validate against a double-barrelled last name like 'Oliver-James'", () => {
        const lastNameValidator = regex(lastName, content.fields.firstName);
        expect(lastNameValidator({value: 'Oliver-James'})).to.equal(null);
    });

    it("should validate against a number of last names like 'Oliver James Brown'", () => {
        const lastNameValidator = regex(lastName, content.fields.firstName);
        expect(lastNameValidator({value: 'Oliver James Brown'})).to.equal(null);
    });


    it("should not validate against numbers '12345'", () => {
        const lastNameValidator = regex(lastName, content.fields.lastName);
        expect(lastNameValidator({ value: '12345' })).to.equal(content.fields.lastName.error.msg);
    });

    it("should not validate against special characters '!@£$%^&*<>/'", () => {
        const lastNameValidator = regex(lastName, content.fields.lastName);
        expect(lastNameValidator({ value: '!@£$%^&*<>/' })).to.equal(content.fields.lastName.error.msg);
    });

});

describe('validating a National Insurance number', () => {

    it("should validate against a valid National Insurance number", () => {
        const niValidator = regex(niNumber, content.fields.niNumber);
        expect(niValidator({value: 'AB123456C'})).to.equal(null);
    });

    it("should not validate against a valid National Insurance number", () => {
        const niValidator = regex(niNumber, content.fields.niNumber);
        expect(niValidator({value: 'AB1234' })).to.equal(content.fields.niNumber.error.msg);
    });

});

describe('validating a telephone number', () => {

    it("should validate a phone number", () => {
        const stringValidator = regex(phoneNumber, content.fields.phoneNumber, false);
        expect(stringValidator({value: '07422735993'})).to.equal(null);
    });

    it("should validate an optional phone number", () => {
        const stringValidator = regex(phoneNumber, content.fields.phoneNumber, true);
        expect(stringValidator({value: ''})).to.equal(null);
    });

});

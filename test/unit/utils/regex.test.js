const { expect } = require('test/util/chai');
const { firstName, lastName, whitelist, niNumber, phoneNumber, internationalMobileNumber } = require('utils/regex');

describe('validating a string', () => {

    it("should validate an address line", () => {
        const address = '45 Wharf Road';
        const stringValidator = address.match(whitelist);
        expect(stringValidator).to.not.equal(null);
    });

});

describe('validating a first name regular expression', () => {

    it("should validate against a first name like 'Sarah'", () => {
        const name = 'Sarah';
        const firstNameValidator = name.match(firstName);
        expect(firstNameValidator).to.not.equal(null);
    });

    it("should validate against a double-barrelled first name like 'Sarah-jane'", () => {
        const name = 'Sarah-jane';
        const firstNameValidator = name.match(firstName);
        expect(firstNameValidator).to.not.equal(null);
    });

    it("should not validate against numbers '12345'", () => {
        const name = '12345';
        const firstNameValidator = name.match(firstName);
        expect(firstNameValidator).to.equal(null);
    });

    it("should not validate against special characters '!@£$%^&*<>/'", () => {
        const name = '!@£$%^&*<>/';
        const firstNameValidator = name.match(firstName);
        expect(firstNameValidator).to.equal(null);
    });

});

describe('validating a last name regular expression', () => {

    it("should validate against a last name like 'Oliver'", () => {
        const name = 'Oliver';
        const lastNameValidator = name.match(lastName);
        expect(lastNameValidator).to.not.equal(null);
    });

    it("should validate against a double-barrelled last name like 'Oliver-James'", () => {
        const name = 'Oliver-James';
        const lastNameValidator = name.match(lastName);
        expect(lastNameValidator).to.not.equal(null);
    });

    it("should validate against a number of last names like 'Oliver James Brown'", () => {
        const name = 'Oliver James Brown';
        const lastNameValidator = name.match(lastName);
        expect(lastNameValidator).to.not.equal(null);
    });


    it("should not validate against numbers '12345'", () => {
        const name = '12345';
        const lastNameValidator = name.match(lastName);
        expect(lastNameValidator).to.equal(null);
    });

    it("should not validate against special characters '!@£$%^&*<>/'", () => {
        const name = '!@£$%^&*<>/';
        const lastNameValidator = name.match(lastName);
        expect(lastNameValidator).to.equal(null);
    });

});

describe('validating a National Insurance number', () => {

    it("should validate against a valid National Insurance number", () => {
        const number = 'AB123456C';
        const niNumberValidator = number.match(niNumber);
        expect(niNumberValidator).to.not.equal(null);
    });

    it("should not validate against a valid National Insurance number", () => {
        const number = 'AB1234';
        const niNumberValidator = number.match(niNumber);
        expect(niNumberValidator).to.equal(null);
    });

});

describe('validating a telephone number', () => {

    it("should validate a phone number", () => {
        const number = '07422735993';
        const phoneNumberValidator = number.match(phoneNumber);
        expect(phoneNumberValidator).to.not.equal(null);
    });

});

describe('validating a international mobile number', () => {

    it("should validate against number starting with 07", () => {
        const number = '07332198765';
        const mobileNumberValidator = number.match(internationalMobileNumber);
        expect(mobileNumberValidator).to.not.equal(null);
    });

    it("should validate against number starting with + before country calling code", () => {
        const number = '+447332198765';
        const mobileNumberValidator = number.match(internationalMobileNumber);
        expect(mobileNumberValidator).to.not.equal(null);
    });

    it("should validate against number starting with 00 before country calling code", () => {
        const number = '00447332198765';
        const mobileNumberValidator = number.match(internationalMobileNumber);
        expect(mobileNumberValidator).to.not.equal(null);
    });

    it("should validate against number starting with (00) before country calling code", () => {
        const number = '(00)447332198765';
        const mobileNumberValidator = number.match(internationalMobileNumber);
        expect(mobileNumberValidator).to.not.equal(null);
    });

    it("should validate against number starting with (0044)", () => {
        const number = '(0044)7332198765';
        const mobileNumberValidator = number.match(internationalMobileNumber);
        expect(mobileNumberValidator).to.not.equal(null);
    });

    it("should not validate against number starting without 07 or + + or 00 or ()", () => {
        const number = '7332198765';
        const mobileNumberValidator = number.match(internationalMobileNumber);
        expect(mobileNumberValidator).to.equal(null);
    });

    it("should not validate against number starting with country code without + or 00 or ()", () => {
        const number = '447332198765';
        const mobileNumberValidator = number.match(internationalMobileNumber);
        expect(mobileNumberValidator).to.equal(null);
    });

});

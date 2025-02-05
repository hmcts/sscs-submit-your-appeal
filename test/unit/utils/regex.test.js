const { expect } = require('test/util/chai');
const {
  firstName,
  lastName,
  whitelist,
  phoneNumber,
  internationalMobileNumber,
  postCode,
  ibcaReference
} = require('utils/regex');

describe('validating a string', () => {
  it('should validate an address line', () => {
    const address = '45 Wharf Road';
    const stringValidator = address.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });
});

describe('validating a postcode', () => {
  it('should validate a postcode in lowercase', () => {
    const postcodeString = 'sw1p 4df';
    const postcodeValidator = postcodeString.match(postCode);
    expect(postcodeValidator).to.not.equal(null);
  });

  it('should validate a postcode in uppercase', () => {
    const postcodeString = 'SW1P 4df';
    const postcodeValidator = postcodeString.match(postCode);
    expect(postcodeValidator).to.not.equal(null);
  });

  it('should validate a postcode with no spaces', () => {
    const postcodeString = 'WV112HE';
    const postcodeValidator = postcodeString.match(postCode);
    expect(postcodeValidator).to.not.equal(null);
  });

  it('should validate a postcode with spaces', () => {
    const postcodeString = 'WV11 2HE';
    const postcodeValidator = postcodeString.match(postCode);
    expect(postcodeValidator).to.not.equal(null);
  });

  it('should validate the large user postcode in uppercase', () => {
    const postcodeString = 'GIR 0AA';
    const postcodeValidator = postcodeString.match(postCode);
    expect(postcodeValidator).to.not.equal(null);
  });

  it('should validate the large user postcode in lowercase', () => {
    const postcodeString = 'gir 0aa';
    const postcodeValidator = postcodeString.match(postCode);
    expect(postcodeValidator).to.not.equal(null);
  });

  it('should not validate an invalid postcode', () => {
    const postcodeString = 'invalid postcode';
    const postcodeValidator = postcodeString.match(postCode);
    expect(postcodeValidator).to.equal(null);
  });

  it('should not validate a postcode with special a character at the beginning', () => {
    const postcodeString = '@Wv11 2HE';
    const postcodeValidator = postcodeString.match(postCode);
    expect(postcodeValidator).to.equal(null);
  });
});

describe('validating a first name regular expression', () => {
  it('should validate against a first name like "Sarah"', () => {
    const name = 'Sarah';
    const firstNameValidator = name.match(firstName);
    expect(firstNameValidator).to.not.equal(null);
  });

  it('should validate against a double-barrelled first name like "Sarah-jane"', () => {
    const name = 'Sarah-jane';
    const firstNameValidator = name.match(firstName);
    expect(firstNameValidator).to.not.equal(null);
  });

  it('should not validate against numbers "12345"', () => {
    const name = '12345';
    const firstNameValidator = name.match(firstName);
    expect(firstNameValidator).to.equal(null);
  });

  it('should not validate against special characters "!@£$%^&*<>/"', () => {
    const name = '!@£$%^&*<>/';
    const firstNameValidator = name.match(firstName);
    expect(firstNameValidator).to.equal(null);
  });
});

describe('validating a last name regular expression', () => {
  it('should validate against a last name like "Oliver"', () => {
    const name = 'Oliver';
    const lastNameValidator = name.match(lastName);
    expect(lastNameValidator).to.not.equal(null);
  });

  it('should validate against a double-barrelled last name like "Oliver-James"', () => {
    const name = 'Oliver-James';
    const lastNameValidator = name.match(lastName);
    expect(lastNameValidator).to.not.equal(null);
  });

  it('should validate against a number of last names like "Oliver James Brown"', () => {
    const name = 'Oliver James Brown';
    const lastNameValidator = name.match(lastName);
    expect(lastNameValidator).to.not.equal(null);
  });

  it('should not validate against numbers "12345"', () => {
    const name = '12345';
    const lastNameValidator = name.match(lastName);
    expect(lastNameValidator).to.equal(null);
  });

  it('should not validate against special characters "!@£$%^&*<>/"', () => {
    const name = '!@£$%^&*<>/';
    const lastNameValidator = name.match(lastName);
    expect(lastNameValidator).to.equal(null);
  });
});

describe('validating a telephone number', () => {
  it('should validate a phone number', () => {
    const number = '07422735993';
    const phoneNumberValidator = number.match(phoneNumber);
    expect(phoneNumberValidator).to.not.equal(null);
  });
});

describe('validating a international mobile number', () => {
  it('should validate against number starting with 07', () => {
    const number = '07332198765';
    const mobileNumberValidator = number.match(internationalMobileNumber);
    expect(mobileNumberValidator).to.not.equal(null);
  });

  it('should validate against number starting with + before country calling code', () => {
    const number = '+447332198765';
    const mobileNumberValidator = number.match(internationalMobileNumber);
    expect(mobileNumberValidator).to.not.equal(null);
  });

  it('should validate against number starting with 00 before country calling code', () => {
    const number = '00447332198765';
    const mobileNumberValidator = number.match(internationalMobileNumber);
    expect(mobileNumberValidator).to.not.equal(null);
  });

  it('should validate against number starting with (00) before country calling code', () => {
    const number = '(00)447332198765';
    const mobileNumberValidator = number.match(internationalMobileNumber);
    expect(mobileNumberValidator).to.not.equal(null);
  });

  it('should validate against number starting with (0044)', () => {
    const number = '(0044)7332198765';
    const mobileNumberValidator = number.match(internationalMobileNumber);
    expect(mobileNumberValidator).to.not.equal(null);
  });

  it('should not validate against number starting without 07 or + + or 00 or ()', () => {
    const number = '7332198765';
    const mobileNumberValidator = number.match(internationalMobileNumber);
    expect(mobileNumberValidator).to.equal(null);
  });

  it('should not validate against number starting with country code without + or 00 or ()', () => {
    const number = '447332198765';
    const mobileNumberValidator = number.match(internationalMobileNumber);
    expect(mobileNumberValidator).to.equal(null);
  });
});

describe('IBCA Reference Regex', () => {
  it('should validate a correct IBCA reference for England', () => {
    const reference = 'E24A45';
    const result = reference.match(ibcaReference);
    expect(result).to.not.equal(null);
  });

  it('should validate a correct IBCA reference in lowercase for England', () => {
    const reference = 'e24a45';
    const result = reference.match(ibcaReference);
    expect(result).to.not.equal(null);
  });

  it('should validate a correct IBCA reference for Scotland', () => {
    const reference = 'S35B67';
    const result = reference.match(ibcaReference);
    expect(result).to.not.equal(null);
  });

  it('should validate a correct IBCA reference in lowercase for Scotland', () => {
    const reference = 's35b67';
    const result = reference.match(ibcaReference);
    expect(result).to.not.equal(null);
  });

  it('should validate a correct IBCA reference for Wales', () => {
    const reference = 'W29C89';
    const result = reference.match(ibcaReference);
    expect(result).to.not.equal(null);
  });

  it('should validate a correct IBCA reference in lowercase for Wales', () => {
    const reference = 'w29c89';
    const result = reference.match(ibcaReference);
    expect(result).to.not.equal(null);
  });

  it('should validate a correct IBCA reference for Northern Ireland', () => {
    const reference = 'N31D12';
    const result = reference.match(ibcaReference);
    expect(result).to.not.equal(null);
  });

  it('should validate a correct IBCA reference in lowercase for Northern Ireland', () => {
    const reference = 'n31d12';
    const result = reference.match(ibcaReference);
    expect(result).to.not.equal(null);
  });

  it('should not validate a reference with an invalid year', () => {
    const reference = 'E2A45';
    const result = reference.match(ibcaReference);
    expect(result).to.equal(null);
  });

  it('should not validate a reference with missing characters', () => {
    const reference = 'E24A4';
    const result = reference.match(ibcaReference);
    expect(result).to.equal(null);
  });

  it('should not validate a reference with extra characters', () => {
    const reference = 'E24A456';
    const result = reference.match(ibcaReference);
    expect(result).to.equal(null);
  });

  it('should not validate a reference with an invalid letter "i" ', () => {
    const reference = 'E24I45';
    const result = reference.match(ibcaReference);
    expect(result).to.equal(null);
  });

  it('should not validate a reference with an invalid letter "o" ', () => {
    const reference = 'E24O45';
    const result = reference.match(ibcaReference);
    expect(result).to.equal(null);
  });

  it('should not validate a reference with an invalid letter "l" ', () => {
    const reference = 'E24L45';
    const result = reference.match(ibcaReference);
    expect(result).to.equal(null);
  });
});

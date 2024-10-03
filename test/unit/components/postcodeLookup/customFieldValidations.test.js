const { expect } = require('test/util/chai');
const customValidations = require('components/postcodeLookup/customFieldValidations.js');

describe('components/customFieldValidations.js', () => {
  let page = {};
  let req = {};
  beforeEach(() => {
    req = { body: {} };
    page = { fields: {}, req };
  });
  afterEach(() => {
    page = {};
    req = {};
  });

  it('expect submit type lookup to be valid', () => {
    page.req.body = { submitType: 'lookup' };
    const joiSchema = customValidations.string().validateAddressList(page);
    const value = 'n29ed';
    const validation = joiSchema.validate(value);
    expect(validation.value)
      .to.eql('n29ed');
    expect(validation.error)
      .to.eql(undefined);
  });

  it('expect submit type addressSelection to be valid', () => {
    page.req.body = { submitType: 'addressSelection' };
    const joiSchema = customValidations.string().validateAddressList(page);
    const value = 'n29ed';
    const validation = joiSchema.validate(value);
    expect(validation.value)
      .to.eql('n29ed');
    expect(validation.error)
      .to.eql(undefined);
  });

  it('expect request type Get to be valid', () => {
    page.req.method = 'GET';
    const joiSchema = customValidations.string().validateAddressList(page);
    const value = 'n29ed';
    const validation = joiSchema.validate(value);
    expect(validation.value)
      .to.eql('n29ed');
    expect(validation.error)
      .to.eql(undefined);
  });

  it('expect postcode valid address field  to be valid', () => {
    page.fields.postcodeAddress = { validate: () => true };
    page.req.method = 'POST';
    const joiSchema = customValidations.string().validateAddressList(page);
    const value = 'n29ed';
    const validation = joiSchema.validate(value);
    expect(validation.value)
      .to.eql('n29ed');
    expect(validation.error)
      .to.eql(undefined);
  });

  it('expect postcode  non valid address field valid to be not valid', () => {
    page.fields.postcodeAddress = { validate: () => false };
    page.req.method = 'POST';
    const joiSchema = customValidations.string().validateAddressList(page);
    const value = 'n29ed';
    const validation = joiSchema.validate(value);
    expect(validation.value)
      .to.eql('n29ed');
    expect(validation.error.message)
      .to.eql('n29ed is an invalid address lookup request');
  });
});
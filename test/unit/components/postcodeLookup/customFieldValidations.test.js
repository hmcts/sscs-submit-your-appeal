const { expect } = require('test/util/chai');
const customValidations = require('components/postcodeLookup/customFieldValidations');
const Joi = require('joi');

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
    const value = 'n29ed';
    expect(
      Joi.validate(value, customValidations.string().validateAddressList(page))
        .error
    ).to.eql(null);
  });

  it('expect submit type addressSelection to be valid', () => {
    page.req.body = { submitType: 'addressSelection' };
    const value = 'n29ed';
    expect(
      Joi.validate(value, customValidations.string().validateAddressList(page))
        .error
    ).to.eql(null);
  });

  it('expect request type Get to be valid', () => {
    page.req.method = 'GET';
    const value = 'n29ed';
    expect(
      Joi.validate(value, customValidations.string().validateAddressList(page))
        .error
    ).to.eql(null);
  });

  it('expect postcode valid address field  to be valid', () => {
    page.fields.postcodeAddress = { validate: () => true };
    page.req.method = 'POST';
    const value = 'n29ed';
    expect(
      Joi.validate(value, customValidations.string().validateAddressList(page))
        .error
    ).to.eql(null);
  });

  it('expect postcode  non valid address field valid to be not valid', () => {
    page.fields.postcodeAddress = { validate: () => false };
    page.req.method = 'POST';
    const value = 'n29ed';
    expect(
      Joi.validate(value, customValidations.string().validateAddressList(page))
        .error
    ).to.not.eql(null);
  });
});

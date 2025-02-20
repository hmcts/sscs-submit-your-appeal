const { expect } = require('test/util/chai');
const {
  joiValidation,
  hasNameButNoTitleValidation,
  hasTitleButNoNameValidation
} = require('utils/validationUtils');
const { whitelist } = require('utils/regex');
const Joi = require('joi');

describe('validationUtils.js', () => {
  describe('joiValidation', () => {
    it('should return true if value has been set', () => {
      const valid = joiValidation('field has a value', Joi.string().required());
      expect(valid).to.equal(true);
    });

    it("should return false if value hasn't been set", () => {
      const valid = joiValidation(null, Joi.string().required());
      expect(valid).to.equal(false);
    });

    it('should return true if value is valid', () => {
      const valid = joiValidation(
        'valid value!',
        Joi.string().regex(whitelist)
      );
      expect(valid).to.equal(true);
    });

    it("should return false if value isn't valid", () => {
      const valid = joiValidation(
        '<invalid value>',
        Joi.string().regex(whitelist)
      );
      expect(valid).to.equal(false);
    });
  });

  describe('hasNameButNoTitleValidation', () => {
    let value = {};

    beforeEach(() => {
      value = {};
    });

    it('should return false if there is a first name but no title', () => {
      value.first = 'First name';
      const noError = hasNameButNoTitleValidation(value);
      expect(noError).to.equal(false);
    });

    it('should return false if there is a last name but no title', () => {
      value.last = 'Last name';
      const noError = hasNameButNoTitleValidation(value);
      expect(noError).to.equal(false);
    });

    it('should return false if there is a first and last name but no title', () => {
      value.first = 'First name';
      value.last = 'Last name';
      const noError = hasNameButNoTitleValidation(value);
      expect(noError).to.equal(false);
    });

    it('should return true if there is no first or last name', () => {
      const noError = hasNameButNoTitleValidation(value);
      expect(noError).to.equal(true);
    });

    it('should return true if there is first name and a title', () => {
      value.title = 'Title';
      value.first = 'First name';
      const noError = hasNameButNoTitleValidation(value);
      expect(noError).to.equal(true);
    });

    it('should return true if there is last name and a title', () => {
      value.title = 'Title';
      value.last = 'Last name';
      const noError = hasNameButNoTitleValidation(value);
      expect(noError).to.equal(true);
    });

    it('should return true if there is first name, last name and a title', () => {
      value.title = 'Title';
      value.first = 'First name';
      value.last = 'Last name';
      const noError = hasNameButNoTitleValidation(value);
      expect(noError).to.equal(true);
    });
  });

  describe('hasTitleButNoNameValidation', () => {
    let value = {};
    beforeEach(() => {
      value = {};
    });

    it('should return false if there is a title but no first or last name', () => {
      value.title = 'Title';
      const noError = hasTitleButNoNameValidation(value);
      expect(noError).to.equal(false);
    });

    it('should return true if there is a title and first name but no last name', () => {
      value.title = 'Title';
      value.first = 'First name';
      const noError = hasTitleButNoNameValidation(value);
      expect(noError).to.equal(true);
    });

    it('should return true if there is a title and last name but no first name', () => {
      value.title = 'Title';
      value.last = 'Last name';
      const noError = hasTitleButNoNameValidation(value);
      expect(noError).to.equal(true);
    });

    it('should return true if there is no title', () => {
      const noError = hasTitleButNoNameValidation(value);
      expect(noError).to.equal(true);
    });
  });
});

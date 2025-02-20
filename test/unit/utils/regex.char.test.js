const { expect } = require('test/util/chai');
const { whitelist } = require('utils/regex');

describe('validating strings with special characters', () => {
  it('should validate a string that contains a forward slash', () => {
    const string = 'special/characters';
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });

  it('should validate a string that contains a backwards slash', () => {
    const backslash = '\\';
    const string = `special${backslash}characters`;
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });

  it('should validate a string that contains an underscore', () => {
    const string = 'special_characters';
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });

  it('should validate a string that contains square brackets', () => {
    const string = '[special characters]';
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });

  it('should validate a string that contains a plus symbol', () => {
    const string = 'special+characters';
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });

  it('should validate a string that contains a percentage symbol', () => {
    const string = 'special%characters';
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });

  it('should validate a string that contains an ampersand', () => {
    const string = 'special&characters';
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });

  it('should validate a string that contains a full stop', () => {
    const string = 'special characters.';
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });

  it('should validate a string that contains double quotes', () => {
    const string = '"special characters"';
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });

  it('should validate a string that contains single quotes', () => {
    const string = "'special characters'";
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });

  it('should validate a string that contains a question mark', () => {
    const string = 'special characters?';
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });

  it('should validate a string that contains an exclamation mark', () => {
    const string = 'special characters!';
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });

  it('should validate a string that contains parentheses', () => {
    const string = 'special (characters)';
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });

  it('should validate a string that contains a colon', () => {
    const string = 'special: characters';
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });

  it('should validate a string that contains a hyphen', () => {
    const string = 'special-characters';
    const stringValidator = string.match(whitelist);
    expect(stringValidator).to.not.equal(null);
  });
});

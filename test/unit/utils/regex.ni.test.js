const { expect } = require('test/util/chai');
const { niNumber } = require('utils/regex');

describe('validating a National Insurance number', () => {
  let number = null;
  let niNumberValidator = null;

  it('should validate against a valid National Insurance number', () => {
    number = 'AB123456C';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.not.equal(null);
  });

  it('should validate against a valid National Insurance number with spaces', () => {
    number = 'AB 123 456 C';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.not.equal(null);
  });

  it('should validate against a valid National Insurance number with lowercase letters', () => {
    number = 'ab123456c';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.not.equal(null);
  });

  it('should not validate against a National Insurance number with BG prefix', () => {
    number = 'BG123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a National Insurance number with GB prefix', () => {
    number = 'GB123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a National Insurance number with KN prefix', () => {
    number = 'KN123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a National Insurance number with NK prefix', () => {
    number = 'NK123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a National Insurance number with NT prefix', () => {
    number = 'NT123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a National Insurance number with TN prefix', () => {
    number = 'TN123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a National Insurance number with ZZ prefix', () => {
    number = 'ZZ123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a NI number when O is the second letter of prefix', () => {
    number = 'SO123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a NI number when D is the first letter of prefix', () => {
    number = 'DA123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a NI number when D is the second letter of prefix', () => {
    number = 'AD123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a NI number when F is the first letter of prefix', () => {
    number = 'FA123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a NI number when F is the second letter of prefix', () => {
    number = 'AF123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a NI number when I is the first letter of prefix', () => {
    number = 'IA123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a NI number when I is the second letter of prefix', () => {
    number = 'AI123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a NI number when Q is the first letter of prefix', () => {
    number = 'QA123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a NI number when Q is the second letter of prefix', () => {
    number = 'AQ123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a NI number when U is the first letter of prefix', () => {
    number = 'UA123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a NI number when U is the second letter of prefix', () => {
    number = 'AU123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a NI number when V is the first letter of prefix', () => {
    number = 'VA123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });

  it('should not validate against a NI number when V is the second letter of prefix', () => {
    number = 'AV123456A';
    niNumberValidator = number.match(niNumber);
    expect(niNumberValidator).to.equal(null);
  });
});

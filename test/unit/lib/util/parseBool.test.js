const modulePath = 'lib/vendor/one-per-page/src/util/parseBool';
const parseBool = require(modulePath);

const { expect } = require('test/util/chai');

describe(modulePath, () => {
  it('should return true when given boolean true', () => {
    expect(parseBool(true)).to.be.true;
  });

  it('should return true when given string true', () => {
    expect(parseBool('true')).to.be.true;
  });

  it('should return true when given string yes', () => {
    expect(parseBool('yes')).to.be.true;
  });

  it('should return true when given integer 1', () => {
    expect(parseBool(1)).to.be.true;
  });

  it('should return false when given boolean false', () => {
    expect(parseBool(false)).to.be.false;
  });

  it('should return false when given string false', () => {
    expect(parseBool('false')).to.be.false;
  });

  it('should return false when given integer 0', () => {
    expect(parseBool(0)).to.be.false;
  });

  it('should return false when given string no', () => {
    expect(parseBool('no')).to.be.false;
  });

  it('should return false when given a random string', () => {
    expect(parseBool('random string')).to.be.false;
  });
});

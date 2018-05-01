const { expect } = require('test/util/chai');
const { long, short } = require('utils/months');

describe('months.js', () => {
  it('should return an array', () => {
    expect(long).to.be.an('array');
    expect(short).to.be.an('array');
  });
});

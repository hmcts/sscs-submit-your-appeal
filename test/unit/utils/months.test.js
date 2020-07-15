const { expect } = require('test/util/chai');
const { long, short } = require('utils/months');

describe('months.js', () => {
  it('should return an array', () => {
    expect(long).to.be.an('object');
    expect(long.en).to.be.an('array');
    expect(long.cy).to.be.an('array');

    expect(short).to.be.an('object');
    expect(short.en).to.be.an('array');
    expect(short.cy).to.be.an('array');
  });
});

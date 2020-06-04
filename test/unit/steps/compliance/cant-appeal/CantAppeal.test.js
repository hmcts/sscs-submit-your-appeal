const { expect } = require('test/util/chai');
const CantAppeal = require('steps/compliance/cant-appeal/CantAppeal');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('CantAppeal.js', () => {
  describe('get path()', () => {
    it('returns path /cant-appeal', () => {
      expect(CantAppeal.path).to.equal(paths.compliance.cantAppeal);
    });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      const cantAppeal = new CantAppeal({
        journey: {}
      });

      expect(cantAppeal.middleware).to.be.an('array');
      expect(cantAppeal.middleware).to.have.length(6);
      expect(cantAppeal.middleware).to.include(checkWelshToggle);
    });
  });
});

const { expect } = require('test/util/chai');
const CantAppeal = require('steps/compliance/cant-appeal/CantAppeal');
const paths = require('paths');

describe('CantAppeal.js', () => {
  describe('get path()', () => {
    it('returns path /cant-appeal', () => {
      expect(CantAppeal.path).to.equal(paths.compliance.cantAppeal);
    });
  });
});

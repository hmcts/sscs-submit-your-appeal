const Error500 = require('steps/errors/500/Error500');
const { expect } = require('test/util/chai');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('Error500.js', () => {
  describe('get path()', () => {
    it('returns path /internal-server-error', () => {
      expect(Error500.path).to.equal('/internal-server-error');
    });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      const error500 = new Error500({
        journey: {}
      });

      expect(error500.middleware).to.be.an('array');
      expect(error500.middleware).to.have.length(5);
      expect(error500.middleware[0]).to.equal(checkWelshToggle);
    });
  });
});

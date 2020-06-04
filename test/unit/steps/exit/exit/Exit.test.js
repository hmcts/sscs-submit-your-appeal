const { expect } = require('test/util/chai');
const Exit = require('steps/exit-points/exit/Exit');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('Exit.js', () => {
  describe('get path()', () => {
    it('returns path /exit', () => {
      expect(Exit.path).to.equal(paths.session.exit);
    });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      const exit = new Exit({
        journey: {}
      });

      expect(exit.middleware).to.be.an('array');
      expect(exit.middleware).to.have.length(6);
      expect(exit.middleware[0]).to.equal(checkWelshToggle);
    });
  });
});

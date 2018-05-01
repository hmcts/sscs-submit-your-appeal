const { expect } = require('test/util/chai');
const Exit = require('steps/exit/Exit');
const paths = require('paths');

describe('Exit.js', () => {
  describe('get path()', () => {
    it('returns path /exit', () => {
      expect(Exit.path).to.equal(paths.session.exit);
    });
  });
});

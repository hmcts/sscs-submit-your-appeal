const Error500 = require('steps/errors/500/Error500');
const { expect } = require('test/util/chai');

describe('Error500.js', () => {
  describe('get path()', () => {
    it('returns path /internal-server-error', () => {
      expect(Error500.path).to.equal('/internal-server-error');
    });
  });
});

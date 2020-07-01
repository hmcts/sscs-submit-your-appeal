const DuplicateError = require('steps/errors/duplicate-error/DuplicateError');
const { expect } = require('test/util/chai');

describe('DuplicateError.js', () => {
  describe('get path()', () => {
    it('returns path /duplicate-case-error', () => {
      expect(DuplicateError.path).to.equal('/duplicate-case-error');
    });
  });
});

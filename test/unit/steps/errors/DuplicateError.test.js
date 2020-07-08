const DuplicateError = require('steps/errors/duplicate-error/DuplicateError');
const { stub } = require('sinon');
const { expect } = require('test/util/chai');

describe('DuplicateError.js', () => {
  const res = {
    send: stub().callsArgWith(0, null, 'html')
  };
  res.render = stub();
  res.send = stub();
  describe('get path()', () => {
    it('returns path /duplicate-case-error', () => {
      expect(DuplicateError.path).to.equal('/duplicate-case-error');
    });
  });
});

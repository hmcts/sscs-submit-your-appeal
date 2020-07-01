const DuplicateError = require('steps/errors/duplicate-error/DuplicateError');
const { stub } = require('sinon');
const { expect } = require('test/util/chai');

describe('DuplicateError.js', () => {
  const res = stub();
  const req = {
    method: 'GET'
  };
  let duplicateErrorClass = null;
  res.render = stub();
  res.send = stub();

  beforeEach(() => {
    duplicateErrorClass = new DuplicateError({ journey: {} });
  });
  describe('get path()', () => {
    it('returns path /duplicate-case-error', () => {
      expect(DuplicateError.path).to.equal('/duplicate-case-error');
    });
  });

  describe('handler', () => {
    it('calls res.send()', () => {
      duplicateErrorClass.handler(req, res);
    });
  });
});

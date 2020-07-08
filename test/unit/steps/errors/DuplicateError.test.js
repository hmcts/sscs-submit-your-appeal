const DuplicateError = require('steps/errors/duplicate-error/DuplicateError');
const { stub } = require('sinon');
const DateUtils = require('utils/DateUtils');
const { expect } = require('test/util/chai');

describe('DuplicateError.js', () => {
  const req = stub();
  let duplicateErrorClass = null;
  const res = stub();
  res.send = stub();

  beforeEach(() => {
    duplicateErrorClass = new DuplicateError({
      journey: {
        req: {
          session: {
            MRNDate: {
              mrnDate: DateUtils.oneDayShortOfAMonthAgo()
            }
          }
        }
      }
    });
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

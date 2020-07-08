const DuplicateError = require('steps/errors/duplicate-error/DuplicateError');
const { stub } = require('sinon');
const DateUtils = require('utils/DateUtils');
const { expect } = require('test/util/chai');
const sinon = require('sinon');

describe('DuplicateError.js', () => {
  let req = stub();
  let duplicateErrorClass = null;
  let res = stub();
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

  afterEach(() => {
    req = {};
    res = {};
  });

  describe('get path()', () => {
    it('returns path /duplicate-case-error', () => {
      expect(DuplicateError.path).to.equal('/duplicate-case-error');
    });
  });

  describe('handler', () => {
    req.method = 'GET';
    const duplicateErrorMrnDate = sinon.stub().returns('20 June 2020');
    it('calls res.send()', () => {
      duplicateErrorClass.handler(req, res);
      duplicateErrorMrnDate().should.eql('20 June 2020');
    });
  });
});

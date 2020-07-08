const DuplicateError = require('steps/errors/duplicate-error/DuplicateError');
const { stub } = require('sinon');
const DateUtils = require('utils/DateUtils');
const { expect } = require('test/util/chai');
const sinon = require('sinon');

describe.only('DuplicateError.js', () => {
  let req = stub();
  let duplicateErrorClass = null;
  let res = stub();
  const mrnDate = DateUtils.oneDayShortOfAMonthAgo();

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

  describe('handler when method is GET', () => {
    req.method = 'GET';
    const duplicateErrorMrnDate = sinon.stub().returns(mrnDate);
    it('calls res.send()', () => {
      duplicateErrorClass.handler(req, res);
      duplicateErrorMrnDate().should.eql(mrnDate);
      expect(duplicateErrorMrnDate).to.have.been.calledOnce;
    });
  });

  describe('duplicateErrorMrnDate', () => {
    const duplicateErrorMrnDate = sinon.stub().returns(mrnDate);
    it('calls duplicateErrorMrnDate', () => {
      expect(duplicateErrorMrnDate()).to.equal(mrnDate);
    });
  });

  describe('handler when method is POST', () => {
    req.method = 'POST';
    const duplicateErrorMrnDate = sinon.stub().returns(mrnDate);
    it('not calls res.send()', () => {
      duplicateErrorClass.handler(req, res);
      expect(duplicateErrorMrnDate).to.have.not.been.calledOnce;
    });
  });
});

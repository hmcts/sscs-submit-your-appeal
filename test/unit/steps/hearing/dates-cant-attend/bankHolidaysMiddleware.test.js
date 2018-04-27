'use strict';

const { expect, sinon } = require('test/util/chai');
const proxyquire = require('proxyquire');

describe('bankHolidaysMiddleware.js', () => {
  const ukBankHolidays = {
    loadBankHolidayDates: () => {
      return 'Successful request';
    }
  };
  const ukBankHolidaysStub = sinon.stub().returns(ukBankHolidays);
  let BankHolidaysMiddleware = null;
  let req = null;
  let res = null;
  let next = null;

  before(() => {
    BankHolidaysMiddleware = proxyquire('steps/hearing/dates-cant-attend/bankHolidaysMiddleware', {
      '@hmcts/uk-bank-holidays': ukBankHolidaysStub
    });
    req = sinon.stub();
    next = sinon.stub();
  });

  beforeEach(() => {
    res = {
      locals: {}
    };
  });

  it('sets ukBankHolidays class to res.locals', () => {
    const middleware = BankHolidaysMiddleware(req, res, next);
    return middleware.then(() => {
      expect(res.locals).to.eql({
        ukBankHolidays
      });
    });
  });

  it('calls next when the request has been successful', () => {
    const middleware = BankHolidaysMiddleware(req, res, next);
    return middleware.then(() => {
      next.should.have.been.called;
    });
  });

  it('calls next with the error when the request has been unsuccessful', () => {
    ukBankHolidays.loadBankHolidayDates = errCallback => {
      errCallback('error');
    };
    const middleware = BankHolidaysMiddleware(req, res, next);
    return middleware.then(() => {
      next.should.have.been.calledWith('error');
    });
  });
});

const { expect } = require('test/util/chai');
const CheckIRN = require('steps/compliance/check-irn/CheckIRN');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const answer = require('utils/answer');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');

describe('CheckIRN.js', () => {
  let checkIRN = null;

  beforeEach(() => {
    checkIRN = new CheckIRN({
      journey: {
        steps: {
          IRNOverOneMonthLate: paths.compliance.irnOverMonthLate,
          IRNOverThirteenMonthsLate: paths.compliance.irnOverThirteenMonthsLate,
          IRNDate: paths.compliance.irnDate
        },
        req: {
          session: {
            BenefitType: {
              benefitType: benefitTypes.infectedBloodAppeal
            }
          }
        }
      }
    });

    checkIRN.fields = {
      irnDate: {
        day: {},
        month: {},
        year: {}
      },
      checkedIRN: {}
    };
  });

  describe('get path()', () => {
    it('returns path /check-irn-date', () => {
      expect(CheckIRN.path).to.equal(paths.compliance.checkIRNDate);
    });
  });
  describe('handler()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('redirect to entry called for iba', () => {
      const superStub = sinon.stub(SaveToDraftStore.prototype, 'handler');
      const req = {
        method: 'GET',
        session: {
          BenefitType: {
            benefitType: benefitTypes.infectedBloodAppeal
          }
        }
      };
      const res = {
        redirect: sinon.spy()
      };
      const next = sinon.spy();
      checkIRN.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
    it('no redirect to entry called for non iba', () => {
      const superStub = sinon.stub(SaveToDraftStore.prototype, 'handler');
      const req = {
        method: 'GET',
        session: {
          BenefitType: {
            benefitType: benefitTypes.nationalInsuranceCredits
          }
        }
      };
      const res = {
        redirect: sinon.spy()
      };
      const next = sinon.spy();
      checkIRN.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('get benefitType()', () => {
    it('returns PIP code from benefit type', () => {
      checkIRN.journey.req.session.BenefitType.benefitType = 'Personal Independence Payment (PIP)';
      expect(checkIRN.benefitType).to.equal('PIP');
    });

    it('returns DLA code from benefit type', () => {
      checkIRN.journey.req.session.BenefitType.benefitType = 'Disability Living Allowance (DLA)';
      expect(checkIRN.benefitType).to.equal('DLA');
    });
  });

  describe('get form()', () => {
    it('should contain 2 fields', () => {
      expect(Object.keys(checkIRN.form.fields).length).to.equal(2);
      expect(checkIRN.form.fields).to.have.all.keys('irnDate', 'checkedIRN');
    });

    it('should contain a textField reference called \'irnDate\'', () => {
      const textField = checkIRN.form.fields.irnDate;
      expect(textField.constructor.name).to.eq('FieldDescriptor');
      expect(textField.validations).to.be.empty;
    });

    it('should contain a textField called checkedIRN', () => {
      const textField = checkIRN.form.fields.checkedIRN;
      expect(textField.constructor.name).to.eq('FieldDescriptor');
      expect(textField.validations).to.not.be.empty;
    });
  });

  describe('answers()', () => {
    it('should be hidden', () => {
      expect(checkIRN.answers().hide).to.be.true;
    });
  });

  describe('values()', () => {
    it('should be empty', () => {
      expect(checkIRN.values()).to.be.empty;
    });
  });

  describe('next()', () => {
    const setIRNDate = date => {
      checkIRN.fields.irnDate.day.value = date.date();
      checkIRN.fields.irnDate.month.value = date.month() + 1;
      checkIRN.fields.irnDate.year.value = date.year();
    };

    describe('checkIRN field value equals yes', () => {
      beforeEach(() => {
        checkIRN.fields.checkedIRN.value = answer.YES;
      });

      it('returns /irn-over-month-late when the date is less than thirteen months', () => {
        setIRNDate(DateUtils.oneMonthAndOneDayAgo());
        expect(checkIRN.next().step).to.equal(paths.compliance.irnOverMonthLate);
      });

      it('returns /irn-over-month-late when date is equal to thirteen months', () => {
        setIRNDate(DateUtils.thirteenMonthsAgo());
        expect(checkIRN.next().step).to.equal(paths.compliance.irnOverMonthLate);
      });

      it('returns /irn-over-thirteen-months-late when date is over thirteen months', () => {
        setIRNDate(DateUtils.thirteenMonthsAndOneDayAgo());
        expect(checkIRN.next().step).to.equal(paths.compliance.irnOverThirteenMonthsLate);
      });
    });

    describe('checkIRN field value equals no', () => {
      it('returns the next step path /irn-date when checkIRN value equals no', () => {
        checkIRN.fields.checkedIRN.value = answer.NO;
        expect(checkIRN.next().step).to.eql(paths.compliance.irnDate);
      });
    });
  });
});

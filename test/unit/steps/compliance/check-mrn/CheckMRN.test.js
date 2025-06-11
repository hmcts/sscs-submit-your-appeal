const { expect } = require('test/util/chai');
const CheckMRN = require('steps/compliance/check-mrn/CheckMRN');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const answer = require('utils/answer');

describe('CheckMRN.js', () => {
  let checkMRN = null;

  beforeEach(() => {
    checkMRN = new CheckMRN({
      journey: {
        steps: {
          MRNOverOneMonthLate: paths.compliance.mrnOverMonthLate,
          MRNOverThirteenMonthsLate: paths.compliance.mrnOverThirteenMonthsLate,
          MRNDate: paths.compliance.mrnDate
        },
        req: {
          session: {
            BenefitType: {
              benefitType: null
            }
          }
        }
      }
    });

    checkMRN.fields = {
      mrnDate: {
        day: {},
        month: {},
        year: {}
      },
      checkedMRN: {}
    };
  });

  describe('get path()', () => {
    it('returns path /check-mrn-date', () => {
      expect(CheckMRN.path).to.equal(paths.compliance.checkMRNDate);
    });
  });

  describe('suffix()', () => {
    it('should return Iba for IBA case', () => {
      checkMRN.req.hostname = 'some-iba-hostname';
      expect(checkMRN.suffix).to.eql('Iba');
    });

    it('should return empty for non IBA case', () => {
      checkMRN.req.hostname = 'some-normal-hostname';
      expect(checkMRN.suffix).to.eql('');
    });
  });

  describe('get benefitType()', () => {
    it('returns PIP code from benefit type', () => {
      checkMRN.journey.req.session.BenefitType.benefitType =
        'Personal Independence Payment (PIP)';
      expect(checkMRN.benefitType).to.equal('PIP');
    });

    it('returns DLA code from benefit type', () => {
      checkMRN.journey.req.session.BenefitType.benefitType =
        'Disability Living Allowance (DLA)';
      expect(checkMRN.benefitType).to.equal('DLA');
    });
  });

  describe('get form()', () => {
    it('should contain 2 fields', () => {
      expect(Object.keys(checkMRN.form.fields).length).to.equal(2);
      expect(checkMRN.form.fields).to.have.all.keys('mrnDate', 'checkedMRN');
    });

    it("should contain a textField reference called 'mrnDate'", () => {
      const textField = checkMRN.form.fields.mrnDate;
      expect(textField.constructor.name).to.eq('FieldDescriptor');
      expect(textField.validations).to.be.empty;
    });

    it('should contain a textField called checkedMRN', () => {
      const textField = checkMRN.form.fields.checkedMRN;
      expect(textField.constructor.name).to.eq('FieldDescriptor');
      expect(textField.validations).to.not.be.empty;
    });
  });

  describe('answers()', () => {
    it('should be hidden', () => {
      expect(checkMRN.answers().hide).to.be.true;
    });
  });

  describe('values()', () => {
    it('should be empty', () => {
      expect(checkMRN.values()).to.be.empty;
    });
  });

  describe('next()', () => {
    const setMRNDate = (date) => {
      checkMRN.fields.mrnDate.day.value = date.date();
      checkMRN.fields.mrnDate.month.value = date.month() + 1;
      checkMRN.fields.mrnDate.year.value = date.year();
    };

    describe('checkMRN field value equals yes', () => {
      beforeEach(() => {
        checkMRN.fields.checkedMRN.value = answer.YES;
      });

      it('returns /mrn-over-month-late when the date is less than thirteen months', () => {
        setMRNDate(DateUtils.oneMonthAndOneDayAgo());
        expect(checkMRN.next().step).to.equal(
          paths.compliance.mrnOverMonthLate
        );
      });

      it('returns /mrn-over-month-late when date is equal to thirteen months', () => {
        setMRNDate(DateUtils.thirteenMonthsAgo());
        expect(checkMRN.next().step).to.equal(
          paths.compliance.mrnOverMonthLate
        );
      });

      it('returns /mrn-over-thirteen-months-late when date is over thirteen months', () => {
        setMRNDate(DateUtils.thirteenMonthsAndOneDayAgo());
        expect(checkMRN.next().step).to.equal(
          paths.compliance.mrnOverThirteenMonthsLate
        );
      });
    });

    describe('checkMRN field value equals no', () => {
      it('returns the next step path /mrn-date when checkMRN value equals no', () => {
        checkMRN.fields.checkedMRN.value = answer.NO;
        expect(checkMRN.next().step).to.eql(paths.compliance.mrnDate);
      });
    });
  });
});

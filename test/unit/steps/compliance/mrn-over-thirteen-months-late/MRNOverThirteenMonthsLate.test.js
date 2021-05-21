/* eslint-disable max-len */

const { expect } = require('test/util/chai');
const MRNOverThirteenMonthsLate = require('steps/compliance/mrn-over-thirteen-months-late/MRNOverThirteenMonthsLate');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');

describe('MRNOverThirteenMonthsLate.js', () => {
  let mrnOverThirteenMonthsLate = null;

  beforeEach(() => {
    mrnOverThirteenMonthsLate = new MRNOverThirteenMonthsLate({
      journey: {
        req: {
          session: {
            BenefitType: {
              benefitType: null
            }
          }
        },
        steps: {
          DWPIssuingOffice: paths.compliance.dwpIssuingOffice,
          Appointee: paths.identity.areYouAnAppointee
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /mrn-over-thirteen-months-late', () => {
      expect(MRNOverThirteenMonthsLate.path).to.equal(paths.compliance.mrnOverThirteenMonthsLate);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = mrnOverThirteenMonthsLate.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('reasonForBeingLate');
    });

    describe('reasonForBeingLate field', () => {
      beforeEach(() => {
        field = fields.reasonForBeingLate;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';
    const value = 'The reason is...';

    beforeEach(() => {
      mrnOverThirteenMonthsLate.content = {
        cya: {
          reasonForBeingLate: {
            question
          }
        }
      };

      mrnOverThirteenMonthsLate.fields = {
        reasonForBeingLate: {
          value
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = mrnOverThirteenMonthsLate.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.mrnDate);
      expect(answers[0].answer).to.equal(value);
    });

    it('should contain a value object', () => {
      const values = mrnOverThirteenMonthsLate.values();
      expect(values).to.eql({ mrn: { reasonForBeingLate: value } });
    });
  });

  describe('next()', () => {
    const setBenefitType = benefitType => {
      mrnOverThirteenMonthsLate.req.journey.req.session.BenefitType.benefitType = benefitType;
    };

    it('returns the next step path /dwp-issuing-office', () => {
      setBenefitType(benefitTypes.personalIndependencePayment);
      expect(mrnOverThirteenMonthsLate.next().step).to.eql(paths.compliance.dwpIssuingOffice);
    });

    it('returns the next step path /dwp-issuing-office', () => {
      setBenefitType(benefitTypes.employmentAndSupportAllowance);
      expect(mrnOverThirteenMonthsLate.next().step).to.eql(paths.compliance.dwpIssuingOffice);
    });

    it('returns the next step path /are-you-an-appointee', () => {
      setBenefitType(benefitTypes.universalCredit);
      expect(mrnOverThirteenMonthsLate.next().step).to.eql(paths.identity.areYouAnAppointee);
    });

    it('returns the next step path /are-you-an-appointee for Carers Allowance', () => {
      setBenefitType(benefitTypes.carersAllowance);
      expect(mrnOverThirteenMonthsLate.next().step).to.eql(paths.identity.areYouAnAppointee);
    });

    it('returns the next step path /dwp-issuing-office for Disability Living Allowance (DLA)', () => {
      setBenefitType(benefitTypes.disabilityLivingAllowance);
      expect(mrnOverThirteenMonthsLate.next().step).to.eql(paths.compliance.dwpIssuingOffice);
    });

    it('returns the next step path /dwp-issuing-office for Attendance Allowance', () => {
      setBenefitType(benefitTypes.attendanceAllowance);
      expect(mrnOverThirteenMonthsLate.next().step).to.eql(paths.compliance.dwpIssuingOffice);
    });

    it('returns the next step path /are-you-an-appointee for Bereavement Benefit', () => {
      setBenefitType(benefitTypes.bereavementBenefit);
      expect(mrnOverThirteenMonthsLate.next().step).to.eql(paths.identity.areYouAnAppointee);
    });
  });
});

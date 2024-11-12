const { expect } = require('test/util/chai');
const MRNOverOneMonthLate = require('steps/compliance/mrn-over-month-late/MRNOverOneMonthLate');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');

describe('MRNOverOneMonth.js', () => {
  let mrnOverOneMonth = null;

  beforeEach(() => {
    mrnOverOneMonth = new MRNOverOneMonthLate({
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
          DWPIssuingOfficeEsa: paths.compliance.dwpIssuingOfficeEsa,
          Appointee: paths.identity.areYouAnAppointee,
          AppellantRole: paths.identity.enterAppellantRole
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /mrn-over-month-late', () => {
      expect(MRNOverOneMonthLate.path).to.equal(paths.compliance.mrnOverMonthLate);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = mrnOverOneMonth.form.fields;
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
      mrnOverOneMonth.content = {
        cya: {
          reasonForBeingLate: {
            question
          }
        }
      };

      mrnOverOneMonth.fields = {
        reasonForBeingLate: {
          value
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = mrnOverOneMonth.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.mrnDate);
      expect(answers[0].answer).to.equal(value);
    });

    it('should contain a value object', () => {
      const values = mrnOverOneMonth.values();
      expect(values).to.eql({ mrn: { reasonForBeingLate: value } });
    });
  });

  describe('next()', () => {
    const setBenefitType = benefitType => {
      mrnOverOneMonth.req.journey.req.session.BenefitType.benefitType = benefitType;
    };

    it('returns the next step path /dwp-issuing-office', () => {
      setBenefitType(benefitTypes.personalIndependencePayment);
      expect(mrnOverOneMonth.next().step).to.eql(paths.compliance.dwpIssuingOffice);
    });

    it('returns the next step path /dwp-issuing-office', () => {
      setBenefitType(benefitTypes.employmentAndSupportAllowance);
      expect(mrnOverOneMonth.next().step).to.eql(paths.compliance.dwpIssuingOfficeEsa);
    });

    it('returns the next step path /are-you-an-appointee for UC', () => {
      setBenefitType(benefitTypes.universalCredit);
      expect(mrnOverOneMonth.next().step).to.eql(paths.identity.areYouAnAppointee);
    });

    it('returns the next step path /are-you-an-appointee for Carers Allowance', () => {
      setBenefitType(benefitTypes.carersAllowance);
      expect(mrnOverOneMonth.next().step).to.eql(paths.identity.areYouAnAppointee);
    });

    it('returns the next step path /dwp-issuing-office for Disability Living Allowance (DLA) if MRN date is over a month', () => {
      setBenefitType(benefitTypes.disabilityLivingAllowance);
      expect(mrnOverOneMonth.next().step).to.eql(paths.compliance.dwpIssuingOfficeEsa);
    });

    it('returns the next step path /dwp-issuing-office for Attendance Allowance if MRN date is over a month', () => {
      setBenefitType(benefitTypes.attendanceAllowance);
      expect(mrnOverOneMonth.next().step).to.eql(paths.compliance.dwpIssuingOfficeEsa);
    });

    it('returns the next step path /are-you-an-appointee for Bereavement Benefit', () => {
      setBenefitType(benefitTypes.bereavementBenefit);
      expect(mrnOverOneMonth.next().step).to.eql(paths.identity.areYouAnAppointee);
    });

    it('returns the next step path /dwp-issuing-office for Social Fund', () => {
      setBenefitType(benefitTypes.socialFund);
      expect(mrnOverOneMonth.next().step).to.eql(paths.compliance.dwpIssuingOfficeEsa);
    });

    it('returns the next step path /are-you-an-appointee for Bereavement Support Payment Scheme', () => {
      setBenefitType(benefitTypes.bereavementSupportPaymentScheme);
      expect(mrnOverOneMonth.next().step).to.eql(paths.identity.areYouAnAppointee);
    });

    it('returns the next step path /dwp-issuing-office for Industrial Death Benefit', () => {
      setBenefitType(benefitTypes.industrialDeathBenefit);
      expect(mrnOverOneMonth.next().step).to.eql(paths.compliance.dwpIssuingOfficeEsa);
    });

    it('returns the next step path /dwp-issuing-office for Pension Credit', () => {
      setBenefitType(benefitTypes.pensionCredit);
      expect(mrnOverOneMonth.next().step).to.eql(paths.compliance.dwpIssuingOfficeEsa);
    });

    it('returns the next step path /dwp-issuing-office for Retirement Pension', () => {
      setBenefitType(benefitTypes.retirementPension);
      expect(mrnOverOneMonth.next().step).to.eql(paths.compliance.dwpIssuingOfficeEsa);
    });

    it('returns the next step path /enter-appellant-role for IBA', () => {
      mrnOverOneMonth.req.hostname = 'some-iba-hostname';
      expect(mrnOverOneMonth.next().step).to.eql(paths.identity.enterAppellantRole);
    });
  });
});

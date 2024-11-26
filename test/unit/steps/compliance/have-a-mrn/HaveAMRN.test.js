const { expect } = require('test/util/chai');
const HaveAMRN = require('steps/compliance/have-a-mrn/HaveAMRN');
const paths = require('paths');
const answer = require('utils/answer');
const benefitTypes = require('steps/start/benefit-type/types');

describe('HaveAMRN.js', () => {
  let haveAMRN = null;

  beforeEach(() => {
    haveAMRN = new HaveAMRN({
      journey: {
        steps: {
          MRNDate: paths.compliance.mrnDate,
          NeedRDN: paths.compliance.needRDN,
          HaveContactedDWP: paths.compliance.haveContactedDWP,
          AppellantIBCAReference: paths.identity.enterAppellantIBCAReference
        }
      },
      session: {
        BenefitType: {
          benefitType: benefitTypes.universalCredit
        }
      }
    });

    haveAMRN.fields = {
      haveAMRN: {}
    };
  });

  describe('get path()', () => {
    it('returns path /have-a-mrn', () => {
      expect(HaveAMRN.path).to.equal(paths.compliance.haveAMRN);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = haveAMRN.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('haveAMRN');
    });

    describe('haveAMRN field', () => {
      beforeEach(() => {
        field = fields.haveAMRN;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
  });

  describe('answers()', () => {
    it('should be hidden', () => {
      expect(haveAMRN.answers().hide).to.be.true;
    });
  });

  describe('values()', () => {
    it('should be empty', () => {
      expect(haveAMRN.values()).to.be.empty;
    });
  });

  describe('suffix()', () => {
    it('should return Iba for IBA case', () => {
      haveAMRN.req.hostname = 'some-iba-hostname';
      expect(haveAMRN.suffix).to.eql('Iba');
    });

    it('should return empty for non IBA case', () => {
      haveAMRN.req.hostname = 'some-normal-hostname';
      expect(haveAMRN.suffix).to.eql('');
    });
  });

  describe('benefitType()', () => {
    it('should return benefit type', () => {
      expect(haveAMRN.benefitType).to.eql('UC');
    });
  });

  describe('benefitCode()', () => {
    it('should return benefit code', () => {
      expect(haveAMRN.benefitCode).to.eql('UC');
    });
  });

  describe('benefitName()', () => {
    it('should return benefit name', () => {
      expect(haveAMRN.benefitName).to.eql('Universal Credit');
    });
  });

  describe('next()', () => {
    it('returns the next step path /mrn-date when haveAMRN equals Yes for non IBA', () => {
      haveAMRN.fields.haveAMRN.value = answer.YES;
      expect(haveAMRN.next().step).to.eql(paths.compliance.mrnDate);
    });

    it('returns the next step path /enter-appellant-ibca-reference when haveAMRN equals Yes for IBA', () => {
      haveAMRN.fields.haveAMRN.value = answer.YES;
      haveAMRN.req.session.BenefitType.benefitType = benefitTypes.infectedBloodCompensation;
      expect(haveAMRN.next().step).to.eql(paths.identity.enterAppellantIBCAReference);
    });

    it('returns the next step path /need-a-review-decision-notice when haveAMRN equals No for IBA', () => {
      haveAMRN.fields.haveAMRN.value = answer.NO;
      haveAMRN.req.session.BenefitType.benefitType = benefitTypes.infectedBloodCompensation;
      expect(haveAMRN.next().step).to.eql(paths.compliance.needRDN);
    });


    it('returns the next step path /have-contacted-dwp when haveAMRN equals No for non IBA', () => {
      haveAMRN.fields.haveAMRN.value = answer.NO;
      haveAMRN.req.session.BenefitType.benefitType = benefitTypes.universalCredit;
      expect(haveAMRN.next().step).to.eql(paths.compliance.haveContactedDWP);
    });
  });
});

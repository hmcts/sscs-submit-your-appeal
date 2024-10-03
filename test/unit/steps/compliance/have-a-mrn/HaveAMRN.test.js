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
          HaveContactedDWP: paths.compliance.haveContactedDWP
        }
      },
      session: {
        BenefitType: {
          benefitType: 'Universal Credit (UC)'
        }
      }
    });

    haveAMRN.fields = {
      haveAMRN: {},
      haveAnIRN: {}
    };
  });

  describe('get path()', () => {
    it('returns path /have-a-mrn', () => {
      expect(HaveAMRN.path).to.equal(paths.compliance.haveAMRN);
    });
  });

  describe('get form() non IBA', () => {
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

  describe('get form() IBA', () => {
    let fields = null;
    let field = null;

    before(() => {
      haveAMRN.req = {
        session: {
          BenefitType: {
            benefitType: benefitTypes.infectedBloodAppeal
          }
        }
      };
      fields = haveAMRN.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('haveAnIRN');
    });

    describe('haveAnIRN field', () => {
      beforeEach(() => {
        field = fields.haveAnIRN;
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
    it('returns the next step path /mrn-date when haveAMRN equals Yes non IBA', () => {
      haveAMRN.fields.haveAMRN.value = answer.YES;
      expect(haveAMRN.next().step).to.eql(paths.compliance.mrnDate);
    });

    it('returns the next step path /mrn-date when hasAnMRN equals Yes IBA', () => {
      haveAMRN.fields.haveAnIRN.value = answer.YES;
      expect(haveAMRN.next().step).to.eql(paths.compliance.mrnDate);
    });

    it('returns the next step path /have-contacted-dwp when haveAMRN equals No', () => {
      haveAMRN.fields.haveAMRN.value = answer.NO;
      expect(haveAMRN.next().step).to.eql(paths.compliance.haveContactedDWP);
    });
  });
});

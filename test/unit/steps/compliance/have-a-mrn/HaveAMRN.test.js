const { expect } = require('test/util/chai');
const HaveAMRN = require('steps/compliance/have-a-mrn/HaveAMRN');
const paths = require('paths');
const answer = require('utils/answer');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
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
      haveAMRN: {}
    };
  });

  describe('get path()', () => {
    it('returns path /have-a-mrn', () => {
      expect(HaveAMRN.path).to.equal(paths.compliance.haveAMRN);
    });
  });

  describe('handler()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('redirect to entry called for non iba', () => {
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
      haveAMRN.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
    it('no redirect to entry called for iba', () => {
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
      haveAMRN.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
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
    it('returns the next step path /mrn-date when haveAMRN equals Yes', () => {
      haveAMRN.fields.haveAMRN.value = answer.YES;
      expect(haveAMRN.next().step).to.eql(paths.compliance.mrnDate);
    });

    it('returns the next step path /have-contacted-dwp when haveAMRN equals No', () => {
      haveAMRN.fields.haveAMRN.value = answer.NO;
      expect(haveAMRN.next().step).to.eql(paths.compliance.haveContactedDWP);
    });
  });
});

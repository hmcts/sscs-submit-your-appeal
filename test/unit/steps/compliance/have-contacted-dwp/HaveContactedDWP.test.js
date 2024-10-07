const { expect } = require('test/util/chai');
const HaveContactedDWP = require('steps/compliance/have-contacted-dwp/HaveContactedDWP');
const paths = require('paths');
const answer = require('utils/answer');
const config = require('config');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');

describe('HaveContactedDWP.js', () => {
  let haveContactedDWP = null;

  beforeEach(() => {
    haveContactedDWP = new HaveContactedDWP({
      journey: {
        steps: {
          NoMRN: paths.compliance.noMRN,
          ContactDWP: paths.compliance.contactDWP
        }
      },
      session: {
        BenefitType: {
          benefitType: 'Universal Credit (UC) Universal Credit UC'
        }
      }
    });

    haveContactedDWP.fields = {
      haveContactedDWP: {}
    };
  });

  describe('get path()', () => {
    it('returns path /have-contacted-dwp', () => {
      expect(HaveContactedDWP.path).to.equal(paths.compliance.haveContactedDWP);
    });
  });

  describe('handler()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('no redirect to /does-not-exist called for non iba', () => {
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
      haveContactedDWP.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
    it('redirect to /does-not-exist called for iba', () => {
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
      haveContactedDWP.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('isBenefitEnabled', () => {
    it('should return wheter benefit is active', () => {
      expect(haveContactedDWP.isBenefitEnabled('allowUC')).to.equal(config.get('features.allowUC.enabled') === 'true');
    });
  });

  describe('get Benefit type', () => {
    it('should return the benefit type', () => {
      expect(haveContactedDWP.benefitType).to.equal('UC Universal Credit UC');
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = haveContactedDWP.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('haveContactedDWP');
    });

    describe('haveContactedDWP field', () => {
      beforeEach(() => {
        field = fields.haveContactedDWP;
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
      expect(haveContactedDWP.answers().hide).to.be.true;
    });
  });

  describe('values()', () => {
    it('should be empty', () => {
      expect(haveContactedDWP.values()).to.be.empty;
    });
  });

  describe('isBenefitEnabled()', () => {
    it('should return boolean', () => {
      expect(haveContactedDWP.isBenefitEnabled('allowUC')).to.eql(true);
    });
  });

  describe('next()', () => {
    it('returns the next step path /dwp-issuing-office when haveAMRN equals Yes', () => {
      haveContactedDWP.fields.haveContactedDWP.value = answer.YES;
      expect(haveContactedDWP.next().step).to.eql(paths.compliance.noMRN);
    });

    it('returns the next step path /have-contacted-dwp when haveAMRN equals No', () => {
      haveContactedDWP.fields.haveContactedDWP.value = answer.NO;
      expect(haveContactedDWP.next().step).to.eql(paths.compliance.contactDWP);
    });
  });
});

const { expect } = require('test/util/chai');
const HaveAnIRN = require('steps/compliance/have-an-irn/HaveAnIRN');
const paths = require('paths');
const answer = require('utils/answer');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');


describe('HaveAnIRN.js', () => {
  let haveAnIRN = null;

  beforeEach(() => {
    haveAnIRN = new HaveAnIRN({
      journey: {
        steps: {
          IRNDate: paths.compliance.irnDate,
          NeedIRN: paths.compliance.needIRN
        }
      },
      session: {
        BenefitType: {
          benefitType: benefitTypes.infectedBloodAppeal
        }
      }
    });

    haveAnIRN.fields = {
      haveAnIRN: {}
    };
  });

  describe('get path()', () => {
    it('returns path /have-an-irn', () => {
      expect(HaveAnIRN.path).to.equal(paths.compliance.haveAnIRN);
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
      haveAnIRN.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
    it('redirect to /does-not-exist called for non iba', () => {
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
      haveAnIRN.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = haveAnIRN.form.fields;
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
      expect(haveAnIRN.answers().hide).to.be.true;
    });
  });

  describe('values()', () => {
    it('should be empty', () => {
      expect(haveAnIRN.values()).to.be.empty;
    });
  });

  describe('next()', () => {
    it('returns the next step path /irn-date when haveAnIRN equals Yes', () => {
      haveAnIRN.fields.haveAnIRN.value = answer.YES;
      expect(haveAnIRN.next().step).to.eql(paths.compliance.irnDate);
    });

    it('returns the next step path /need-an-irn when haveAnIRN equals No', () => {
      haveAnIRN.fields = {
        haveAnIRN: {
          value: answer.NO
        }
      };
      expect(haveAnIRN.next().step).to.eql(paths.compliance.needIRN);
    });
  });
});

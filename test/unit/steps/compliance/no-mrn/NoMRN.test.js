const { expect } = require('test/util/chai');
const NoMRN = require('steps/compliance/no-mrn/NoMRN');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');

describe('NoMRN.js', () => {
  let noMRN = null;

  beforeEach(() => {
    noMRN = new NoMRN({
      journey: {
        steps: {
          StillCanAppeal: paths.compliance.stillCanAppeal
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /no-mrn', () => {
      expect(NoMRN.path).to.equal(paths.compliance.noMRN);
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
      noMRN.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
    it('redirect to /does-not-exist called for iba', () => {
      const superStub = sinon.stub(SaveToDraftStore.prototype, 'handler');
      const req = {
        method: 'GET',
        session: {
          BenefitType: {
            benefitType: benefitTypes.infectedBloodCompensation
          }
        }
      };
      const res = {
        redirect: sinon.spy()
      };
      const next = sinon.spy();
      noMRN.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = noMRN.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('reasonForNoMRN');
    });

    describe('reasonForNoMRN field', () => {
      beforeEach(() => {
        field = fields.reasonForNoMRN;
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
      noMRN.content = {
        cya: {
          reasonForNoMRN: {
            question
          }
        }
      };

      noMRN.fields = {
        reasonForNoMRN: {
          value
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = noMRN.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.mrnDate);
      expect(answers[0].answer).to.equal(value);
    });

    it('should contain a value object', () => {
      const values = noMRN.values();
      expect(values).to.eql({ mrn: { reasonForNoMRN: value } });
    });
  });

  describe('next()', () => {
    it('returns the next step path /still-can-appeal', () => {
      expect(noMRN.next()).to.eql({ nextStep: paths.compliance.stillCanAppeal });
    });
  });
});

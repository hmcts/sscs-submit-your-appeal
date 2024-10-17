const AppellantIBCARef = require('steps/identity/appellant-ibca-ref/AppellantIBCARef');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const paths = require('paths');
const { it, describe } = require('mocha');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');

describe('AppellantIBCARef.js', () => {
  let appellantibcaReference = null;

  beforeEach(() => {
    appellantibcaReference = new AppellantIBCARef({
      journey: {
        req: { session: { Appointee: { isAppointee: 'no' } } },
        steps: {
          MRNDate: paths.compliance.mrnDate
        }
      }
    });

    appellantibcaReference.fields = {};
  });

  describe('get path()', () => {
    it('returns the path /enter-appellant-ibca-reference', () => {
      expect(AppellantIBCARef.path).to.equal(paths.identity.enterAppellantIBCARef);
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
      appellantibcaReference.handler(req, res, next);
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
      appellantibcaReference.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('get form()', () => {
    it('should have one field', () => {
      expect(Object.keys(appellantibcaReference.form.fields).length).to.equal(1);
    });

    it('should have the key to only field "ibcaReference" ', () => {
      expect(appellantibcaReference.form.fields).to.have.all.keys('ibcaReference');
    });

    it('should have validations', () => {
      expect(appellantibcaReference.form.fields.ibcaReference.validations).to.not.be.empty;
    });
  });

  describe('title() and subtitle()', () => {
    // TODO: change to the agreed when new designs are ready. Also in content json to change
    const NOT_APPOINTEE_TITLE = 'Enter IBCA Reference provided';
    const NOT_APPOINTEE_SUBTITLE = 'Enter your IBCA Reference';
    const IS_APPOINTEE_TITLE = 'Enter their IBCA Reference';
    const IS_APPOINTEE_SUBTITLE = 'Enter the IBCA Reference of the person you are authorised to appeal for.';

    beforeEach(() => {
      appellantibcaReference.content = {
        title: {
          withoutAppointee: NOT_APPOINTEE_TITLE,
          withAppointee: IS_APPOINTEE_TITLE
        },
        subtitle: {
          withoutAppointee: NOT_APPOINTEE_SUBTITLE,
          withAppointee: IS_APPOINTEE_SUBTITLE
        }
      };
    });

    it('should return correct not appointee title', () => {
      expect(appellantibcaReference.title).to.equal(NOT_APPOINTEE_TITLE);
    });

    it('should return correct is appointee title', () => {
      appellantibcaReference.journey.req.session.Appointee.isAppointee = 'yes';
      expect(appellantibcaReference.title).to.equal(IS_APPOINTEE_TITLE);
    });

    it('should return correct not appointee subtitle', () => {
      expect(appellantibcaReference.subtitle).to.equal(NOT_APPOINTEE_SUBTITLE);
    });

    it('should return correct is appointee subtitle', () => {
      appellantibcaReference.journey.req.session.Appointee.isAppointee = 'yes';
      expect(appellantibcaReference.subtitle).to.equal(IS_APPOINTEE_SUBTITLE);
    });
  });

  describe('answers() and values() methods', () => {
    const ibcaReferenceNo = '343545434234';
    const question = 'IBCA Reference';

    beforeEach(() => {
      appellantibcaReference.content = {
        cya: {
          ibcaReference: {
            question
          }
        }
      };

      appellantibcaReference.fields = {
        ibcaReference: {
          value: ibcaReferenceNo
        }
      };
    });

    it('should contain a single question, section and answer', () => {
      const answers = appellantibcaReference.answers();
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.appellantDetails);
      expect(answers[0].answer).to.equal(ibcaReferenceNo);
    });

    it('should contain value as IBCA Ref', () => {
      const values = appellantibcaReference.values();
      expect(values).to.eql({ appellant: { ibcaReference: ibcaReferenceNo } });
    });
  });

  describe('next()', () => {
    it('should return the next step path /mrn-date', () => {
      expect(appellantibcaReference.next().step).to.eql(paths.compliance.mrnDate);
    });
  });
});

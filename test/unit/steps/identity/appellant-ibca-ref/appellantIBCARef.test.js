const AppellantIBCARef = require('steps/identity/appellant-ibca-ref/AppellantIBCARef');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const paths = require('paths');
const { it, describe } = require('mocha');

describe('AppellantIBCARef.js', () => {
  const WITH_APPOINTEE = 'withAppointee';
  const WITHOUT_APPOINTEE = 'withoutAppointee';
  let appellantIBCARef = null;

  beforeEach(() => {
    appellantIBCARef = new AppellantIBCARef({
      journey: {
        req: { session: { Appointee: { isAppointee: 'no' } } },
        steps: {
          AppellantContactDetails: paths.identity.enterAppellantContactDetails,
          SameAddress: paths.appointee.sameAddress
        }
      }
    });

    appellantIBCARef.fields = {};
  });

  describe('get path()', () => {
    it('returns the path /enter-appellant-ibca-ref', () => {
      expect(AppellantIBCARef.path).to.equal(paths.identity.enterAppellantIBCARef);
    });
  });

  describe('get form()', () => {
    it('should have one field', () => {
      expect(Object.keys(appellantIBCARef.form.fields).length).to.equal(1);
    });

    it('should have the key to only field "ibcaRef" ', () => {
      expect(appellantIBCARef.form.fields).to.have.all.keys('ibcaRef');
    });

    it('should have validations', () => {
      expect(appellantIBCARef.form.fields.ibcaRef.validations).to.not.be.empty;
    });
  });

  describe('contentPrefix using isAppointee()', () => {
    it('should return "withoutAppointee" when is appellant journey', () => {
      appellantIBCARef.journey.req.session.Appointee.isAppointee = 'no';
      expect(appellantIBCARef.contentPrefix()).to.equal(WITHOUT_APPOINTEE);
    });

    it('should return "withAppointee" when is appellant journey', () => {
      appellantIBCARef.journey.req.session.Appointee.isAppointee = 'yes';
      expect(appellantIBCARef.contentPrefix()).to.equal(WITH_APPOINTEE);
    });
  });

  describe('answers() and values() methods', () => {
    const ibcaRefNo = '343545434234';
    const question = 'IBCA Reference';

    beforeEach(() => {
      appellantIBCARef.content = {
        cya: {
          ibcaRef: {
            question
          }
        }
      };

      appellantIBCARef.fields = {
        ibcaRef: {
          value: ibcaRefNo
        }
      };
    });

    it('should contain a single question, section and answer', () => {
      const answers = appellantIBCARef.answers();
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.appellantDetails);
      expect(answers[0].answer).to.equal(ibcaRefNo);
    });

    it('should contain value as IBCA Ref', () => {
      const values = appellantIBCARef.values();
      expect(values).to.eql({ appellant: { ibcaRef: ibcaRefNo } });
    });
  });
});

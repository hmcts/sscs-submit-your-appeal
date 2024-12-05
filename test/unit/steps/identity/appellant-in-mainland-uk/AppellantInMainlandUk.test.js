
const { expect } = require('test/util/chai');
const paths = require('paths');
const sections = require('steps/check-your-appeal/sections');
const userAnswer = require('utils/answer');
const i18next = require('i18next');
const AppellantInMainlandUk = require('steps/identity/appellant-in-mainland-uk/AppellantInMainlandUk');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');

describe('AppellantInMainlandUk.js', () => {
  let appellantInMainlandUk = null;

  beforeEach(() => {
    appellantInMainlandUk = new AppellantInMainlandUk({
      journey: {
        steps: {
          AppellantContactDetails: paths.identity.enterAppellantContactDetails,
          AppellantInternationalContactDetails: paths.identity.enterAppellantInternationalContactDetails
        }
      }
    });
    appellantInMainlandUk.fields = { appellantInMainlandUk: {} };
  });

  describe('get path()', () => {
    it('returns path /appellant-in-mainland-uk', () => {
      expect(AppellantInMainlandUk.path).to.equal(paths.identity.enterAppellantInMainlandUk);
    });
  });
  describe('handler()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('no redirect to /does-not-exist called for iba', () => {
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
      appellantInMainlandUk.handler(req, res, next);
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
      appellantInMainlandUk.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';

    beforeEach(() => {
      appellantInMainlandUk.content = {
        cya: {
          inMainlandUk: {
            question,
            yes: 'Yes',
            no: 'No'
          }
        }
      };

      appellantInMainlandUk.fields = {
        inMainlandUk: {}
      };
    });

    it('should set the question and section', () => {
      const answers = appellantInMainlandUk.answers();
      expect(answers.question).to.equal(question);
      expect(answers.section).to.equal(sections.appellantDetails);
    });

    describe('values()', () => {
      it('should return the correct values for yes', () => {
        appellantInMainlandUk.fields.inMainlandUk.value = userAnswer.YES;
        const values = appellantInMainlandUk.values();
        expect(values.appellant.contactDetails.inMainlandUk).to.equal(true);
      });

      it('should return the correct values for no', () => {
        appellantInMainlandUk.fields.inMainlandUk.value = userAnswer.NO;
        const values = appellantInMainlandUk.values();
        expect(values.appellant.contactDetails.inMainlandUk).to.equal(false);
      });

      it('should return null for null', () => {
        appellantInMainlandUk.fields.inMainlandUk.value = null;
        const values = appellantInMainlandUk.values();
        expect(values.appellant.contactDetails.inMainlandUk).to.equal(null);
      });
    });

    describe('English', () => {
      it('should return the correct answer \'Yes\' for CYA (English)', () => {
        appellantInMainlandUk.fields.inMainlandUk.value = userAnswer.YES;
        const answers = appellantInMainlandUk.answers();
        expect(answers.answer).to.equal('Yes');
      });

      it('should return the correct answer \'No\' for CYA (English)', () => {
        appellantInMainlandUk.fields.inMainlandUk.value = userAnswer.NO;
        const answers = appellantInMainlandUk.answers();
        expect(answers.answer).to.equal('No');
      });
    });

    describe('Welsh', () => {
      beforeEach(() => {
        i18next.changeLanguage('cy');
      });

      afterEach(() => {
        i18next.changeLanguage('en');
      });
      // TODO update welsh
      it('should return the correct answer \'No\' for CYA (Welsh)', () => {
        appellantInMainlandUk.content.cya.inMainlandUk.no = 'No';
        appellantInMainlandUk.fields.inMainlandUk.value = userAnswer.NO;
        const answers = appellantInMainlandUk.answers();
        expect(answers.answer).to.equal('No');
      });
      // TODO update welsh
      it('should return the correct answer \'Yes\' for CYA (Welsh)', () => {
        appellantInMainlandUk.content.cya.inMainlandUk.yes = 'Yes';
        appellantInMainlandUk.fields.inMainlandUk.value = userAnswer.YES;
        const answers = appellantInMainlandUk.answers();
        expect(answers.answer).to.equal('Yes');
      });
    });
  });

  describe('get form()', () => {
    let fields = null;

    beforeEach(() => {
      fields = appellantInMainlandUk.form.fields;
    });

    it('should contain 1 fields', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys(
        'inMainlandUk'
      );
    });

    it('should contain a select reference called \'inMainlandUk\'', () => {
      const selectField = fields.inMainlandUk;
      expect(selectField.constructor.name).to.eq('FieldDescriptor');
      expect(selectField.validations).to.not.be.empty;
    });
  });

  describe('next()', () => {
    it('returns /appellant-contact-details for Yes in UK', () => {
      appellantInMainlandUk.fields.inMainlandUk = { value: userAnswer.YES };
      expect(appellantInMainlandUk.next().step).to.eql(paths.identity.enterAppellantContactDetails);
    });

    it('returns /appellant-international-contact-details for No in UK', () => {
      appellantInMainlandUk.fields.inMainlandUk = { value: userAnswer.NO };
      expect(appellantInMainlandUk.next().step).to.eql(paths.identity.enterAppellantInternationalContactDetails);
    });
  });
});


const { expect } = require('test/util/chai');
const paths = require('paths');
const sections = require('steps/check-your-appeal/sections');
const userAnswer = require('utils/answer');
const i18next = require('i18next');
const AppellantInUk = require('steps/identity/appellant-in-uk/AppellantInUk');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');

describe('AppellantInUk.js', () => {
  let appellantInUk = null;

  beforeEach(() => {
    appellantInUk = new AppellantInUk({
      journey: {
        steps: {
          AppellantContactDetails: paths.identity.enterAppellantContactDetails,
          AppellantInternationalContactDetails: paths.identity.enterAppellantInternationalContactDetails
        }
      }
    });
    appellantInUk.fields = { appellantInUk: {} };
  });

  describe('get path()', () => {
    it('returns path /appellant-in-uk', () => {
      expect(AppellantInUk.path).to.equal(paths.identity.enterAppellantInUk);
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
            benefitType: benefitTypes.infectedBloodAppeal
          }
        }
      };
      const res = {
        redirect: sinon.spy()
      };
      const next = sinon.spy();
      appellantInUk.handler(req, res, next);
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
      appellantInUk.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('contentPrefix', () => {
    describe('when is Appointee journey', () => {
      it('should return `withAppointee`', () => {
        appellantInUk.journey.req = { session: { Appointee: { isAppointee: 'yes' } } };
        expect(appellantInUk.contentPrefix()).to.equal('withAppointee');
      });
    });
    describe('when is NOT Appointee journey', () => {
      it('should return `withoutAppointee`', () => {
        expect(appellantInUk.contentPrefix()).to.equal('withoutAppointee');
      });
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';

    beforeEach(() => {
      appellantInUk.content = {
        cya: {
          inUk: {
            question: {
              withAppointee: question,
              withoutAppointee: question
            },
            yes: 'Yes',
            no: 'No'
          }
        }
      };

      appellantInUk.fields = {
        inUk: {}
      };
    });

    it('should set the question and section', () => {
      const answers = appellantInUk.answers();
      expect(answers.question).to.equal(question);
      expect(answers.section).to.equal(sections.appellantDetails);
    });

    describe('English', () => {
      it('should return the correct answer \'Yes\' for CYA (English)', () => {
        appellantInUk.fields.inUk.value = userAnswer.YES;
        const answers = appellantInUk.answers();
        expect(answers.answer).to.equal('Yes');
      });

      it('should return the correct answer \'No\' for CYA (English)', () => {
        appellantInUk.fields.inUk.value = userAnswer.NO;
        const answers = appellantInUk.answers();
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
        appellantInUk.content.cya.inUk.no = 'No';
        appellantInUk.fields.inUk.value = userAnswer.NO;
        const answers = appellantInUk.answers();
        expect(answers.answer).to.equal('No');
      });
      // TODO update welsh
      it('should return the correct answer \'Yes\' for CYA (Welsh)', () => {
        appellantInUk.content.cya.inUk.yes = 'Yes';
        appellantInUk.fields.inUk.value = userAnswer.YES;
        const answers = appellantInUk.answers();
        expect(answers.answer).to.equal('Yes');
      });
    });
  });

  describe('get form()', () => {
    let fields = null;

    beforeEach(() => {
      fields = appellantInUk.form.fields;
    });

    it('should contain 1 fields', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys(
        'inUk'
      );
    });

    it('should contain a select reference called \'inUk\'', () => {
      const selectField = fields.inUk;
      expect(selectField.constructor.name).to.eq('FieldDescriptor');
      expect(selectField.validations).to.not.be.empty;
    });
  });

  describe('next()', () => {
    it('returns /appellant-contact-details for Yes in UK', () => {
      appellantInUk.fields.inUk = { value: userAnswer.YES };
      expect(appellantInUk.next().step).to.eql(paths.identity.enterAppellantContactDetails);
    });

    it('returns /appellant-international-contact-details for No in UK', () => {
      appellantInUk.fields.inUk = { value: userAnswer.NO };
      expect(appellantInUk.next().step).to.eql(paths.identity.enterAppellantInternationalContactDetails);
    });
  });
});

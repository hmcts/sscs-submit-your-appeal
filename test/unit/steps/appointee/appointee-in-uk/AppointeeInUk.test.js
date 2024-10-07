
const { expect } = require('test/util/chai');
const paths = require('paths');
const sections = require('steps/check-your-appeal/sections');
const userAnswer = require('utils/answer');
const i18next = require('i18next');
const AppointeeInUk = require('steps/appointee/appointee-in-uk/AppointeeInUk');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');

describe('AppointeeInUk.js', () => {
  let appointeeInUk = null;

  beforeEach(() => {
    appointeeInUk = new AppointeeInUk({
      journey: {
        steps: {
          AppointeeContactDetails: paths.appointee.enterAppointeeContactDetails,
          AppointeeInternationalContactDetails: paths.appointee.enterAppointeeInternationalContactDetails
        }
      }
    });
    appointeeInUk.fields = { appointeeInUk: {} };
  });

  describe('get path()', () => {
    it('returns path /appointee-in-uk', () => {
      expect(AppointeeInUk.path).to.equal(paths.appointee.enterAppointeeInUk);
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
      appointeeInUk.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
    it('no redirect to entry called for non iba', () => {
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
      appointeeInUk.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';

    beforeEach(() => {
      appointeeInUk.content = {
        cya: {
          inUk: {
            question,
            yes: 'Yes',
            no: 'No'
          }
        }
      };

      appointeeInUk.fields = {
        inUk: {}
      };
    });

    it('should set the question and section', () => {
      const answers = appointeeInUk.answers();
      expect(answers.question).to.equal(question);
      expect(answers.section).to.equal(sections.appointeeDetails);
    });

    describe('English', () => {
      it('should return the correct answer \'Yes\' for CYA (English)', () => {
        appointeeInUk.fields.inUk.value = userAnswer.YES;
        const answers = appointeeInUk.answers();
        expect(answers.answer).to.equal('Yes');
      });

      it('should return the correct answer \'No\' for CYA (English)', () => {
        appointeeInUk.fields.inUk.value = userAnswer.NO;
        const answers = appointeeInUk.answers();
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
        appointeeInUk.content.cya.inUk.no = 'No';
        appointeeInUk.fields.inUk.value = userAnswer.NO;
        const answers = appointeeInUk.answers();
        expect(answers.answer).to.equal('No');
      });
      // TODO update welsh
      it('should return the correct answer \'Yes\' for CYA (Welsh)', () => {
        appointeeInUk.content.cya.inUk.yes = 'Yes';
        appointeeInUk.fields.inUk.value = userAnswer.YES;
        const answers = appointeeInUk.answers();
        expect(answers.answer).to.equal('Yes');
      });
    });
  });

  describe('get form()', () => {
    let fields = null;

    beforeEach(() => {
      fields = appointeeInUk.form.fields;
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
    it('returns /appointee-contact-details for Yes in UK', () => {
      appointeeInUk.fields.inUk = { value: userAnswer.YES };
      expect(appointeeInUk.next().step).to.eql(paths.appointee.enterAppointeeContactDetails);
    });

    it('returns /appointee-international-contact-details for No in UK', () => {
      appointeeInUk.fields.inUk = { value: userAnswer.NO };
      expect(appointeeInUk.next().step).to.eql(paths.appointee.enterAppointeeInternationalContactDetails);
    });
  });
});

const AppointeeDOB = require('steps/appointee/appointee-dob/AppointeeDOB');
const { expect } = require('test/util/chai');
const paths = require('paths');
const sections = require('steps/check-your-appeal/sections');
const moment = require('moment');
const benefitTypes = require('steps/start/benefit-type/types');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sinon = require('sinon');

describe('AppointeeDOB.js', () => {
  let appointeeDOBClass = null;

  beforeEach(() => {
    appointeeDOBClass = new AppointeeDOB({
      journey: {
        steps: {
          AppointeeContactDetails: paths.appointee.enterAppointeeContactDetails
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /enter-appointee-dob', () => {
      expect(AppointeeDOB.path).to.equal(paths.appointee.enterAppointeeDOB);
    });
  });

  describe('handler()', () => {
    afterEach(() => {
      sinon.restore();
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
      appointeeDOBClass.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
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
      appointeeDOBClass.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    beforeEach(() => {
      fields = appointeeDOBClass.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('date');
    });

    describe('date field', () => {
      beforeEach(() => {
        field = fields.date;
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

    beforeEach(() => {
      appointeeDOBClass.fields = {
        date: {
          value: moment('07-08-1980', 'DD-MM-YYYY')
        }
      };

      appointeeDOBClass.content = {
        cya: {
          dob: {
            question
          }
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = appointeeDOBClass.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.appointeeDetails);
      expect(answers[0].answer).to.equal('07 August 1980');
    });

    it('should contain a value object', () => {
      const values = appointeeDOBClass.values();
      expect(values).to.eql({
        appointee: {
          dob: '07-08-1980'
        }
      });
    });
  });

  describe('next()', () => {
    it('returns the next step path /appointee-contact-details', () => {
      expect(appointeeDOBClass.next())
        .to.eql({ nextStep: paths.appointee.enterAppointeeContactDetails });
    });
  });
});

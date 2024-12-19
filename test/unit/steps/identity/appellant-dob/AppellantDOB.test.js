const AppellantDOB = require('steps/identity/appellant-dob/AppellantDOB');
const { expect } = require('test/util/chai');
const paths = require('paths');
const sections = require('steps/check-your-appeal/sections');
const moment = require('moment');
const benefitTypes = require('steps/start/benefit-type/types');

describe('AppellantDOB.js', () => {
  let appellantDOBClass = null;

  beforeEach(() => {
    appellantDOBClass = new AppellantDOB({
      journey: {
        steps: {
          AppellantNINO: paths.identity.enterAppellantNINO,
          AppellantInMainlandUk: paths.identity.enterAppellantInMainlandUk

        }
      },
      session: {
        BenefitType: {
          benefitType: benefitTypes.infectedBloodCompensation
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /enter-appellant-dob', () => {
      expect(AppellantDOB.path).to.equal(paths.identity.enterAppellantDOB);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    beforeEach(() => {
      fields = appellantDOBClass.form.fields;
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
      appellantDOBClass.fields = {
        date: {
          value: moment('07-08-1980', 'DD-MM-YYYY')
        }
      };

      appellantDOBClass.content = {
        cya: {
          dob: {
            question
          }
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = appellantDOBClass.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.appellantDetails);
      expect(answers[0].answer).to.equal('07 August 1980');
    });

    it('should contain a value object', () => {
      const values = appellantDOBClass.values();
      expect(values).to.eql({
        appellant: {
          dob: '07-08-1980'
        }
      });
    });
  });

  describe('next()', () => {
    it('returns the next step path /enter-appellant-nino', () => {
      appellantDOBClass.req.session.BenefitType.benefitType = benefitTypes.personalIndependencePayment;
      expect(appellantDOBClass.next().step).to.eql(paths.identity.enterAppellantNINO);
    });

    it('returns the next step path /appellent-in-mainland-uk in Iba journey', () => {
      appellantDOBClass.req.session.BenefitType.benefitType = benefitTypes.infectedBloodCompensation;
      expect(appellantDOBClass.next().step).to.eql(paths.identity.enterAppellantInMainlandUk);
    });
  });
});

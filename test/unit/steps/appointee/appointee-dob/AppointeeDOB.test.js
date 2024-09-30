const AppointeeDOB = require('steps/appointee/appointee-dob/AppointeeDOB');
const { expect } = require('test/util/chai');
const paths = require('paths');
const sections = require('steps/check-your-appeal/sections');
const moment = require('moment');

describe('AppointeeDOB.js', () => {
  let appointeeDOBClass = null;

  beforeEach(() => {
    appointeeDOBClass = new AppointeeDOB({
      journey: {
        steps: {
          AppointeeContactDetails: paths.appointee.enterAppointeeContactDetails,
          AppointeeInUk: paths.appointee.enterAppointeeInUk
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /enter-appointee-dob', () => {
      expect(AppointeeDOB.path).to.equal(paths.appointee.enterAppointeeDOB);
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
    it('returns the next step path /appointee-contact-details for non IBA', () => {
      expect(appointeeDOBClass.next().step)
        .to.eql(paths.appointee.enterAppointeeContactDetails);
    });

    it('returns the next step path /appointee-in-uk for IBA', () => {
      appointeeDOBClass.req = { hostname: 'some-iba-hostname' };
      expect(appointeeDOBClass.next().step)
        .to.eql(paths.appointee.enterAppointeeInUk);
    });
  });
});

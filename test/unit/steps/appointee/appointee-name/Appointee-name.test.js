const { expect } = require('test/util/chai');
const AppointeeName = require('steps/appointee/appointee-name/AppointeeName');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');

describe('AppointeeName.js', () => {
  let appointeeName = null;

  beforeEach(() => {
    appointeeName = new AppointeeName({
      journey: {
        steps: {
          AppointeeDOB: paths.appointee.enterAppointeeDOB
        }
      }
    });
    appointeeName.fields = {};
  });

  describe('get path()', () => {
    it('returns path /enter-appointee-name', () => {
      expect(AppointeeName.path).to.equal(paths.appointee.enterAppointeeName);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    beforeEach(() => {
      fields = appointeeName.form.fields;
    });

    it('should contain 3 fields', () => {
      expect(Object.keys(fields).length).to.equal(3);
      expect(fields).to.have.all.keys('title', 'firstName', 'lastName');
    });

    describe('title field', () => {
      beforeEach(() => {
        field = fields.title;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });

    describe('firstName field', () => {
      beforeEach(() => {
        field = fields.firstName;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });

    describe('lastName field', () => {
      beforeEach(() => {
        field = fields.lastName;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
  });

const Name = 'Mr,HARRY,POTTER-Smith';

    describe(`answers() appellant full name # ${Name}`, () => {
      beforeEach(() => {
        appointeeName.fields = {
          title: {
            value: Name.split(',')[0]
          },
          firstName: {
            value: Name.split(',')[1]
          },
          lastName: {
            value: Name.split(',')[2]
          }
        };
      });
      it('should normalise appointee full name in the answers()', () => {
        const answers = appointeeName.answers();
        expect(answers[0].answer).to.equal('Mr HARRY POTTER-Smith');
      });

      it('should normalise appointee full name in the values()', () => {
        const values = appointeeName.values();
        expect(values).to.eql({
          appointee: {
            title: 'Mr',
            firstName: 'HARRY',
            lastName: 'POTTER-Smith'
          }
        });
      });
    });

  describe('answers() and values()', () => {
    const question = 'A Question';

    beforeEach(() => {
      appointeeName.fields = {
        title: {
          value: 'Mr'
        },
        firstName: {
          value: 'Harry'
        },
        lastName: {
          value: 'Potter'
        }
      };

      appointeeName.content = {
        cya: {
          appointeeName: {
            question
          }
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = appointeeName.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.appointeeDetails);
      expect(answers[0].answer).to.equal('Mr Harry Potter');
    });

    it('should contain a value object', () => {
      const values = appointeeName.values();
      expect(values).to.eql({
        appointee: {
          title: 'Mr',
          firstName: 'Harry',
          lastName: 'Potter'
        }
      });
    });
  });

  describe('next()', () => {
    it('returns the next step path /enter-appointee-dob', () => {
      expect(appointeeName.next()).to.eql({ nextStep: paths.appointee.enterAppointeeDOB });
    });
  });
});

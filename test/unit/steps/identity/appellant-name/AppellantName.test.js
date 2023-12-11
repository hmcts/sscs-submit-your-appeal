const { expect } = require('test/util/chai');
const AppellantName = require('steps/identity/appellant-name/AppellantName');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const titlesList = require('utils/titlesList');
const { decode } = require('utils/stringUtils');

describe('AppellantName.js', () => {
  let appellantName = null;

  beforeEach(() => {
    appellantName = new AppellantName({
      journey: {
        steps: {
          AppellantDOB: paths.identity.enterAppellantDOB
        }
      }
    });
    appellantName.fields = {};
  });

  describe('get path()', () => {
    it('returns path /enter-appellant-name', () => {
      expect(AppellantName.path).to.equal(paths.identity.enterAppellantName);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    beforeEach(() => {
      fields = appellantName.form.fields;
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

      it('validates all valid titles', () => {
        const schema = appellantName.titleSchema();

        for (const testTitle of titlesList) {
          const result = schema.validate(decode(testTitle.value));
          expect(result.error).to.eq(null);
        }
      });

      it('rejects non valid titles', () => {
        const schema = appellantName.titleSchema();
        const result = schema.validate(decode('Rt Hon'));
        expect(result.error).not.to.eq(null);
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

const Name = 'Mr,harry John,pOttEr';

    describe(`answers() appellant full name # ${Name}`, () => {
      beforeEach(() => {
        appellantName.fields = {
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
      it('should normalise appellant full name in the answers()', () => {
        const answers = appellantName.answers();
        expect(answers[0].answer).to.equal('Mr harry John pOttEr');
      });

      it('should normalise appellant full name in the values()', () => {
        const values = appellantName.values();
        expect(values).to.eql({
          appellant: {
            title: 'Mr',
            firstName: 'harry John',
            lastName: 'pOttEr'
          }
        });
      });
    });

  describe('answers() and values()', () => {
    const question = 'A Question';

    beforeEach(() => {
      appellantName.fields = {
        title: {
          value: 'Mr'
        },
        firstName: {
          value: 'HARRY'
        },
        lastName: {
          value: 'POTTER'
        }
      };

      appellantName.content = {
        cya: {
          appellantName: {
            question
          }
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = appellantName.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.appellantDetails);
      expect(answers[0].answer).to.equal('Mr HARRY POTTER');
    });

    it('should contain a value object', () => {
      const values = appellantName.values();
      expect(values).to.eql({
        appellant: {
          title: 'Mr',
          firstName: 'HARRY',
          lastName: 'POTTER'
        }
      });
    });
  });

  describe('next()', () => {
    it('returns the next step path /enter-appellant-dob', () => {
      expect(appellantName.next()).to.eql({ nextStep: paths.identity.enterAppellantDOB });
    });
  });
});

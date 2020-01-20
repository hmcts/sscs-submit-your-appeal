const { expect } = require('test/util/chai');
const DWPIssuingOffice = require('steps/compliance/dwp-issuing-office/DWPIssuingOffice');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');

describe('DWPIssuingOffice.js', () => {
  let dWPIssuingOffice = null;

  beforeEach(() => {
    dWPIssuingOffice = new DWPIssuingOffice({
      journey: {
        steps: {
          Appointee: paths.identity.areYouAnAppointee
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /dwp-issuing-office', () => {
      expect(dWPIssuingOffice.path).to.equal(paths.compliance.dwpIssuingOffice);
    });
  });

  describe('get dwp office options()', () => {
    it('return dwp office option', () => {
      expect(11).to.equal(dWPIssuingOffice.options.length);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = dWPIssuingOffice.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('dwpIssuingOffice');
    });

    describe('dwpIssuingOffice field', () => {
      beforeEach(() => {
        field = fields.dwpIssuingOffice;
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
      dWPIssuingOffice.fields = {
        dwpIssuingOffice: {
          value: '5'
        }
      };

      dWPIssuingOffice.content = {
        cya: {
          dwpIssuingOffice: {
            question
          }
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = dWPIssuingOffice.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.mrnDate);
      expect(answers[0].answer).to.equal('5');
    });

    it('should contain a value object', () => {
      const values = dWPIssuingOffice.values();
      expect(values).to.eql({ mrn: { dwpIssuingOffice: 'DWP PIP (5)' } });
    });
  });

  describe('answers() and values() for PIP AE', () => {
    const question = 'A Question';

    beforeEach(() => {
      dWPIssuingOffice.fields = {
        dwpIssuingOffice: {
          value: 'AE'
        }
      };

      dWPIssuingOffice.content = {
        cya: {
          dwpIssuingOffice: {
            question
          }
        }
      };
    });

    it('should contain a single answer for PIP AE', () => {
      const answers = dWPIssuingOffice.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.mrnDate);
      expect(answers[0].answer).to.equal('AE');
    });

    it('should contain a value object for PIP AE', () => {
      const values = dWPIssuingOffice.values();
      expect(values).to.eql({ mrn: { dwpIssuingOffice: 'DWP PIP AE' } });
    });
  });

  describe('next()', () => {
    it('returns the next step path /are-you-an-appointee', () => {
      expect(dWPIssuingOffice.next()).to.eql({ nextStep: paths.identity.areYouAnAppointee });
    });
  });
});

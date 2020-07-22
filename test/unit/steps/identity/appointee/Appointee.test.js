const { expect } = require('test/util/chai');
const Appointee = require('steps/identity/appointee/Appointee');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const userAnswer = require('utils/answer');

describe('Appointee.js', () => {
  let appointee = null;

  beforeEach(() => {
    appointee = new Appointee({
      journey: {
        steps: {
          AppealFormDownload: paths.appealFormDownload,
          AppellantName: paths.identity.enterAppellantName,
          AppointeeName: paths.appointee.enterAppointeeName
        }
      }
    });

    appointee.fields = {
      isAppointee: {}
    };
  });

  describe('get path()', () => {
    it('returns path /are-you-an-appointee', () => {
      expect(Appointee.path).to.equal(paths.identity.areYouAnAppointee);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = appointee.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('isAppointee');
    });

    describe('isAppointee field', () => {
      beforeEach(() => {
        field = fields.isAppointee;
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
      appointee.content = {
        cya: {
          isAppointee: {
            question,
            yes: 'Yes',
            no: 'No'
          }
        }
      };

      appointee.fields = {
        isAppointee: {}
      };
    });

    it('should set the question and section', () => {
      const answers = appointee.answers();
      expect(answers.question).to.equal(question);
      expect(answers.section).to.equal(sections.appointeeDetails);
    });

    it('should titleise the users selection to \'No\' for CYA (English)', () => {
      appointee.fields.isAppointee.value = userAnswer.NO;
      const answers = appointee.answers();
      expect(answers.answer).to.equal('No');
    });

    it('should titleise the users selection to \'Yes\' for CYA (English)', () => {
      appointee.fields.isAppointee.value = userAnswer.YES;
      const answers = appointee.answers();
      expect(answers.answer).to.equal('Yes');
    });

    it('should titleise the users selection to \'Na\' for CYA (Welsh)', () => {
      appointee.content.cya.isAppointee.no = 'Na';
      appointee.fields.isAppointee.value = userAnswer.NO;
      const answers = appointee.answers();
      expect(answers.answer).to.equal('Na');
    });

    it('should titleise the users selection to \'Do\' for CYA (Welsh)', () => {
      appointee.content.cya.isAppointee.yes = 'Do';
      appointee.fields.isAppointee.value = userAnswer.YES;
      const answers = appointee.answers();
      expect(answers.answer).to.equal('Do');
    });

    it('should set isAppointee to false', () => {
      appointee.fields.isAppointee.value = userAnswer.NO;
      const values = appointee.values();
      expect(values).to.eql({ isAppointee: false });
    });

    it('should set isAppointee to true', () => {
      appointee.fields.isAppointee.value = userAnswer.YES;
      const values = appointee.values();
      expect(values).to.eql({ isAppointee: true });
    });

    it('should set isAppointee to null', () => {
      appointee.fields.isAppointee.value = '';
      const values = appointee.values();
      expect(values).to.eql({ isAppointee: null });
    });
  });

  describe('next()', () => {
    it('returns the next step path /enter-appointee-name', () => {
      const nextStep = appointee.next().branches[0].redirector.nextStep;
      expect(nextStep).to.eq(paths.appointee.enterAppointeeName);
    });

    it('returns the next step path /appeal-form-download', () => {
      appointee.fields.isAppointee.value = userAnswer.YES;
      const nextStep = appointee.next().branches[1].redirector.nextStep;
      expect(nextStep).to.eq(paths.appealFormDownload);
    });

    it('returns the next step path /enter-appellant-name', () => {
      appointee.fields.isAppointee.value = userAnswer.NO;
      const nextStep = appointee.next().fallback.nextStep;
      expect(nextStep).to.eq(paths.identity.enterAppellantName);
    });
  });
});

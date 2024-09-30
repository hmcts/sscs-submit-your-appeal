
const { expect } = require('test/util/chai');
const paths = require('paths');
const sections = require('steps/check-your-appeal/sections');
const userAnswer = require('utils/answer');
const i18next = require('i18next');
const RepresentativeInUk = require('steps/representative/representative-in-uk/RepresentativeInUk');

describe('RepresentativeInUk.js', () => {
  let representativeInUk = null;

  beforeEach(() => {
    representativeInUk = new RepresentativeInUk({
      journey: {
        steps: {
          RepresentativeDetails: paths.representative.representativeDetails,
          RepresentativeInternationalDetails: paths.representative.representativeInternationalDetails
        }
      }
    });
    representativeInUk.fields = { representativeInUk: {} };
  });

  describe('get path()', () => {
    it('returns path /representative-in-uk', () => {
      expect(RepresentativeInUk.path).to.equal(paths.representative.representativeInUk);
    });
  });

  describe('get form()', () => {
    let fields = null;

    beforeEach(() => {
      fields = representativeInUk.form.fields;
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

  describe('answers() and values()', () => {
    const question = 'A Question';

    beforeEach(() => {
      representativeInUk.content = {
        cya: {
          inUk: {
            question,
            yes: 'Yes',
            no: 'No'
          }
        }
      };

      representativeInUk.fields = {
        inUk: {}
      };
    });

    it('should set the question and section', () => {
      const answers = representativeInUk.answers();
      expect(answers.question).to.equal(question);
      expect(answers.section).to.equal(sections.representative);
    });

    describe('English', () => {
      it('should return the correct answer \'Yes\' for CYA (English)', () => {
        representativeInUk.fields.inUk.value = userAnswer.YES;
        const answers = representativeInUk.answers();
        expect(answers.answer).to.equal('Yes');
      });

      it('should return the correct answer \'No\' for CYA (English)', () => {
        representativeInUk.fields.inUk.value = userAnswer.NO;
        const answers = representativeInUk.answers();
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
      it('should return the correct answer \'No in welsh\' for CYA (Welsh)', () => {
        representativeInUk.content.cya.inUk.no = 'No in welsh';
        representativeInUk.fields.inUk.value = userAnswer.NO;
        const answers = representativeInUk.answers();
        expect(answers.answer).to.equal('No in welsh');
      });
      // TODO update welsh
      it('should return the correct answer \'Yes in welsh\' for CYA (Welsh)', () => {
        representativeInUk.content.cya.inUk.yes = 'Yes in welsh';
        representativeInUk.fields.inUk.value = userAnswer.YES;
        const answers = representativeInUk.answers();
        expect(answers.answer).to.equal('Yes in welsh');
      });
    });
  });

  describe('next()', () => {
    it('returns /representative-contact-details for Yes in UK', () => {
      representativeInUk.fields.inUk = { value: userAnswer.YES };
      expect(representativeInUk.next().step).to.eql(paths.representative.representativeDetails);
    });

    it('returns /representative-international-contact-details for No in UK', () => {
      representativeInUk.fields.inUk = { value: userAnswer.NO };
      expect(representativeInUk.next().step).to.eql(paths.representative.representativeInternationalDetails);
    });
  });
});

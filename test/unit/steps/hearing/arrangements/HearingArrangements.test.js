const { expect } = require('test/util/chai');
const HearingArrangements = require('steps/hearing/arrangements/HearingArrangements');
const paths = require('paths');
const languages = require('steps/hearing/arrangements/languages');
const signLanguages = require('steps/hearing/arrangements/signLanguages');

describe('HearingArrangements.js', () => {
  let hearingArrangements = null;

  beforeEach(() => {
    hearingArrangements = new HearingArrangements({
      journey: {
        steps: {
          HearingAvailability: paths.hearing.hearingAvailability
        }
      }
    });

    hearingArrangements.fields = {
      selection: {
        value: {
          interpreterLanguage: {
            requested: true,
            language: 'A language'
          },
          signLanguage: {
            requested: false
          },
          hearingLoop: {
            requested: true
          },
          accessibleHearingRoom: {
            requested: false
          },
          anythingElse: {
            requested: true,
            language: 'more support'
          }
        }
      }
    };
  });

  describe('get path()', () => {
    it('returns path /arrangements', () => {
      expect(HearingArrangements.path).to.equal(
        paths.hearing.hearingArrangements
      );
    });
  });

  describe('get languagesList()', () => {
    it('returns an object', () => {
      expect(hearingArrangements.languagesList).to.be.an('array');
    });

    it('should have an array of objects', () => {
      expect(hearingArrangements.languagesList[0]).to.eql({
        label: languages[0],
        value: languages[0]
      });
    });
  });

  describe('get signLanguagesList()', () => {
    it('returns an object', () => {
      expect(hearingArrangements.signLanguagesList).to.be.an('array');
    });

    it('should have an array of objects', () => {
      expect(hearingArrangements.signLanguagesList[0]).to.eql({
        label: signLanguages[0],
        value: signLanguages[0]
      });
    });
  });

  describe('static selectify', () => {
    it('returns an array of objects', () => {
      const outcome = HearingArrangements.selectify(signLanguages);
      expect(outcome).to.be.an('array');
      expect(outcome[0]).to.be.an('object');
    });
    it('such objects have a value / label structure', () => {
      const outcome = HearingArrangements.selectify(signLanguages)[0];
      expect(outcome).to.be.an('object');
      expect(outcome.label).to.equal(signLanguages[0]);
      expect(outcome.value).to.equal(signLanguages[0]);
    });
  });

  describe('get cyaArrangements()', () => {
    it('should return an object', () => {
      expect(hearingArrangements.cyaArrangements).to.eql({
        interpreterLanguage: 'A language',
        signLanguage: 'Not required',
        hearingLoop: 'Required',
        accessibleHearingRoom: 'Not required',
        anythingElse: 'more support'
      });
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = hearingArrangements.form.fields;
    });

    it('should contain 2 fields', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('selection');
    });

    describe('selection field', () => {
      beforeEach(() => {
        field = fields.selection;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
  });

  describe('answers()', () => {
    let answers = null;

    before(() => {
      answers = hearingArrangements.answers()[0];
    });

    it('should return expected section', () => {
      expect(answers.section).to.equal('hearing-arrangements');
    });

    it('should return expected template', () => {
      expect(answers.template).to.equal('answer.html');
    });
  });

  describe('values()', () => {
    it('should contain a value object', () => {
      const values = hearingArrangements.values();
      expect(values).to.eql({
        hearing: {
          arrangements: {
            languageInterpreter: true,
            signLanguageInterpreter: false,
            hearingLoop: true,
            accessibleHearingRoom: false,
            other: true
          },
          interpreterLanguageType: 'A language',
          signLanguageType: undefined,
          anythingElse: 'more support'
        }
      });
    });
  });

  describe('next()', () => {
    it('returns the next step path /hearing-availability', () => {
      expect(hearingArrangements.next()).to.eql({
        nextStep: paths.hearing.hearingAvailability
      });
    });
  });
});

const AppellantNINO = require('steps/identity/appellant-nino/AppellantNINO');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('AppellantNINO.js', () => {
  let appellantNINO = null;

  beforeEach(() => {
    appellantNINO = new AppellantNINO({
      journey: {
        req: { session: { Appointee: { isAppointee: 'no' } } },
        steps: {
          AppellantContactDetails: paths.identity.enterAppellantContactDetails,
          SameAddress: paths.appointee.sameAddress,
          AppellantInUk: paths.identity.enterAppellantInUk
        }
      }
    });

    appellantNINO.fields = {};
  });

  describe('get path()', () => {
    it('returns path /enter-appellant-nino', () => {
      expect(AppellantNINO.path).to.equal(paths.identity.enterAppellantNINO);
    });
  });

  describe('contentPrefix', () => {
    describe('when is Appointee journey', () => {
      it('should return `withoutAppointee`', () => {
        appellantNINO.journey.req.session.Appointee.isAppointee = 'yes';
        expect(appellantNINO.contentPrefix()).to.equal('withAppointee');
      });
    });
    describe('when is NOT Appointee journey', () => {
      it('should return `withoutAppointee`', () => {
        expect(appellantNINO.contentPrefix()).to.equal('withoutAppointee');
      });
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    beforeEach(() => {
      fields = appellantNINO.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('nino');
    });

    describe('nino field', () => {
      beforeEach(() => {
        field = fields.nino;
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
    const value = 'AB877533C';

    beforeEach(() => {
      appellantNINO.content = {
        cya: {
          nino: {
            question
          }
        }
      };

      appellantNINO.fields = {
        nino: {
          value
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = appellantNINO.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.appellantDetails);
      expect(answers[0].answer).to.equal(value);
    });

    it('should contain a value object', () => {
      const values = appellantNINO.values();
      expect(values).to.eql({ appellant: { nino: value } });
    });

    it('removes whitespace from before and after the nino string', () => {
      appellantNINO.fields.nino.value = ' AB 123 456 C ';
      const nino = appellantNINO.values().appellant.nino;
      expect(nino).to.not.equal(' AB 123 456 C ');
      expect(nino).to.equal('AB 123 456 C');
    });
  });

  describe('next()', () => {
    it('returns the next step path /enter-appellant-contact-details', () => {
      expect(appellantNINO.next().step).to.eql(paths.identity.enterAppellantContactDetails);
    });

    it('returns the next step path /appellant-international-contact-details for IBA', () => {
      appellantNINO.req = { hostname: 'iba-' };
      expect(appellantNINO.next().step).to.eql(paths.identity.enterAppellantInUk);
    });

    it('returns the next step path /appointee-same-address', () => {
      appellantNINO.journey.req.session.Appointee.isAppointee = 'yes';
      expect(appellantNINO.next().step).to.eql(paths.appointee.sameAddress);
    });
  });
});

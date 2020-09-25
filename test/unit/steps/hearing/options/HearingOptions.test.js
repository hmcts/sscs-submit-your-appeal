const HearingOptions = require('steps/hearing/options/HearingOptions');
const { expect } = require('test/util/chai');
const paths = require('paths');
const {
  emptyTelephoneValidation,
  emptyEmailValidation
} = require('steps/hearing/options/optionsValidation');
const validOptions = require('steps/hearing/options/options');


describe('HearingOptions.js', () => {
  let hearingOptions = null;

  beforeEach(() => {
    hearingOptions = new HearingOptions({
      journey: {
        steps: {
          HearingSupport: paths.hearing.hearingSupport
        },
        values: {
          appellant: {
            contactDetails: {
              phoneNumber: '099723122',
              emailAddress: 'jey@gmail.com'
            }
          }
        }
      }
    });

    hearingOptions.fields = {
      selectOptions: {
        option: {},
        telephone: {},
        email: {}
      }
    };
  });

  describe('get path()', () => {
    it('returns path /hearing-options', () => {
      expect(hearingOptions.path).to.equal(paths.hearing.hearingOptions);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = hearingOptions.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('selectOptions');
    });

    describe('selectOption field', () => {
      beforeEach(() => {
        field = fields.selectOptions;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
  });

  describe('appellant contact delails', () => {
    it('return appellant phone number', () => {
      expect(hearingOptions.telephone).to.eql('099723122');
    });

    it('return appellant email', () => {
      expect(hearingOptions.email).to.eql('jey@gmail.com');
    });
  });

  describe('appellant empty contact delails', () => {
    it('return empty phone number for null value', () => {
      hearingOptions = new HearingOptions({journey: {}});
      expect(hearingOptions.telephone).to.eql(null);
    });

    it('return empty email for null value', () => {
      hearingOptions = new HearingOptions({journey: {}});
      expect(hearingOptions.email).to.eql(null);
    });

    it('return empty phone number for null appellant', () => {
      hearingOptions = new HearingOptions({journey: {values: {}}});
      expect(hearingOptions.telephone).to.eql(null);
    });

    it('return empty email for null appellant', () => {
      hearingOptions = new HearingOptions({journey: {values: {}}});
      expect(hearingOptions.email).to.eql(null);
    });

    it('return empty phone number for null contact', () => {
      hearingOptions = new HearingOptions({journey: {values: {contactDetails:{}}}});
      expect(hearingOptions.telephone).to.eql(null);
    });

    it('return empty email for null contact', () => {
      hearingOptions = new HearingOptions({journey: {values: {contactDetails:{}}}});
      expect(hearingOptions.email).to.eql(null);
    });
  });


  describe('value()', () => {
    it('returns the hearing type telephone value', () => {
      hearingOptions.fields.selectOptions.option.value = validOptions.telephone;
      hearingOptions.fields.selectOptions.telephone.value = '07325561123';

      const values = hearingOptions.values();
      expect(values).to.eql({ hearing: {
        options: {
          hearingTypeTelephone: true,
          telephone: '07325561123',
          hearingTypeVideo: false,
          email: null,
          hearingTypeFaceToFace: false
        }
      } });
    });

    it('returns the hearing type video value', () => {
      hearingOptions.fields.selectOptions.option.value = validOptions.video;
      hearingOptions.fields.selectOptions.email.value = 'jey@gmail.com';

      const values = hearingOptions.values();
      expect(values).to.eql({ hearing: {
        options: {
          hearingTypeTelephone: false,
          telephone: null,
          hearingTypeVideo: true,
          email: 'jey@gmail.com',
          hearingTypeFaceToFace: false
        }
      } });
    });

    it('returns the hearing type face to face value', () => {
      hearingOptions.fields.selectOptions.option.value = validOptions.faceToFace;

      const values = hearingOptions.values();
      expect(values).to.eql({ hearing: {
        options: {
          hearingTypeTelephone: false,
          telephone: null,
          hearingTypeVideo: false,
          email: null,
          hearingTypeFaceToFace: true
        }
      } });
    });
  });

  describe('answers()', () => {
    it('should contain hide index which is set to true', () => {
      const answers = hearingOptions.answers();
      expect(answers.hide).to.equal(true);
    });
  });

  describe('next()', () => {
    it('returns the next step path /hearing-support', () => {
      hearingOptions.fields.selectOptions.option.value = 'telephone';
      expect(hearingOptions.next().step).to.eq(paths.hearing.hearingSupport);
    });
  });

  describe('FieldValidation', () => {
    const value = {};

    it('returns false when telephone field has not been set', () => {
      value.option = validOptions.telephone;
      expect(emptyTelephoneValidation(value)).to.equal(false);
    });

    it('returns false when email field has not been set', () => {
      value.option = validOptions.video;
      expect(emptyEmailValidation(value)).to.equal(false);
    });

    it('returns true when telephone field has been set', () => {
      value.option = validOptions.telephone;
      value.telephone = "0993402";
      expect(emptyTelephoneValidation(value)).to.equal(true);
    });

    it('returns true when email field has been set', () => {
      value.option = validOptions.video;
      value.email = "email@gmail.com";
      expect(emptyEmailValidation(value)).to.equal(true);
    });

  });
});

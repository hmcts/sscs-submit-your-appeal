const HearingOptions = require('steps/hearing/options/HearingOptions');
const { expect } = require('test/util/chai');
const paths = require('paths');
const {
  emptyTelephoneValidation,
  invalidTelephoneValidation,
  emptyEmailValidation,
  invalidEmailValidation,
  optionSelected
} = require('steps/hearing/options/optionsValidation');


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
        telephone: {
          requested: {},
          phoneNumber: {}
        },
        video: {
          requested: {},
          email: {}
        },
        faceToFace: {
          requested: {}
        }
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

  describe('appellant contact details', () => {
    it('return appellant phone number', () => {
      expect(hearingOptions.phoneNumber).to.eql('099723122');
    });

    it('return appellant email', () => {
      expect(hearingOptions.email).to.eql('jey@gmail.com');
    });
  });

  describe('appellant empty contact delails', () => {
    it('return empty phone number for null value', () => {
      hearingOptions = new HearingOptions({ journey: {} });
      expect(hearingOptions.phoneNumber).to.eql(null);
    });

    it('return empty email for null value', () => {
      hearingOptions = new HearingOptions({ journey: {} });
      expect(hearingOptions.email).to.eql(null);
    });

    it('return empty phone number for null appellant', () => {
      hearingOptions = new HearingOptions({ journey: { values: {} } });
      expect(hearingOptions.phoneNumber).to.eql(null);
    });

    it('return empty email for null appellant', () => {
      hearingOptions = new HearingOptions({ journey: { values: {} } });
      expect(hearingOptions.email).to.eql(null);
    });

    it('return empty phone number for null contact', () => {
      hearingOptions = new HearingOptions({ journey: { values: { contactDetails: {} } } });
      expect(hearingOptions.phoneNumber).to.eql(null);
    });

    it('return empty email for null contact', () => {
      hearingOptions = new HearingOptions({ journey: { values: { contactDetails: {} } } });
      expect(hearingOptions.email).to.eql(null);
    });
  });


  describe('value()', () => {
    it('returns the hearing type telephone value', () => {
      hearingOptions.fields.selectOptions.telephone.requested.value = true;
      hearingOptions.fields.selectOptions.telephone.phoneNumber.value = '07325561123';

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
      hearingOptions.fields.selectOptions.video.requested.value = true;
      hearingOptions.fields.selectOptions.video.email.value = 'jey@gmail.com';

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
      hearingOptions.fields.selectOptions.faceToFace.requested.value = true;

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
    let answers = null;

    before(() => {
      answers = hearingOptions.answers()[0];
    });

    it('should return expected section', () => {
      expect(answers.section).to.equal('hearing-options');
    });

    it('should return expected template', () => {
      expect(answers.template).to.equal('answer.html');
    });
  });

  describe('next()', () => {
    it('returns the next step path /hearing-support', () => {
      hearingOptions.fields.selectOptions.faceToFace.requested.value = true;
      expect(hearingOptions.next().step).to.eq(paths.hearing.hearingSupport);
    });
  });

  describe('FieldValidation', () => {
    const value = {};
    const options = {
      telephone: {},
      video: {},
      faceToFace: {}
    };

    it('returns false when telephone field has not been set', () => {
      value.requested = true;
      expect(emptyTelephoneValidation(value)).to.equal(false);
    });

    it('returns false when email field has not been set', () => {
      value.requested = true;
      expect(emptyEmailValidation(value)).to.equal(false);
    });

    it('returns true when telephone field has been set', () => {
      value.requested = true;
      value.phoneNumber = '0993402';
      expect(emptyTelephoneValidation(value)).to.equal(true);
    });

    it('returns true when email field has been set', () => {
      value.requested = true;
      value.email = 'email@gmail.com';
      expect(emptyEmailValidation(value)).to.equal(true);
    });

    it('returns false when invalid telephone number set', () => {
      value.requested = true;
      value.phoneNumber = '0993402';
      expect(invalidTelephoneValidation(value)).to.equal(false);
    });

    it('returns false when invalid email set', () => {
      value.requested = true;
      value.email = 'emailXXgmail.com';
      expect(invalidEmailValidation(value)).to.equal(false);
    });

    it('returns true when valid telephone field has been set', () => {
      value.requested = true;
      value.phoneNumber = '07543233432';
      expect(invalidTelephoneValidation(value)).to.equal(true);
    });

    it('returns true when valid email field has been set', () => {
      value.requested = true;
      value.email = 'email@gmail.com';
      expect(invalidEmailValidation(value)).to.equal(true);
    });

    it('returns false when no option has been set', () => {
      options.telephone.requested = false;
      options.video.requested = false;
      options.faceToFace.requested = false;
      expect(optionSelected(options)).to.equal(false);
    });

    it('returns true when some option has been set', () => {
      options.telephone.requested = true;
      options.video.requested = false;
      options.faceToFace.requested = true;
      expect(optionSelected(options)).to.equal(true);
    });
  });

  describe('get cyaOptions()', () => {
    it('should return an object', () => {
      hearingOptions = new HearingOptions({});
      hearingOptions.fields = {
        selectOptions: {
          value: {
            telephone: { requested: { value: true }, phoneNumber: '0987654321' },
            video: { requested: { value: true }, email: 'name@email' }, faceToFace: { requested: { value: true } }
          }
        }
      };

      expect(hearingOptions.cyaOptions).to.eql({
        hearingTypeTelephone: '0987654321',
        hearingTypeVideo: 'name@email',
        hearingTypeFaceToFace: 'Requested'
      });
    });
  });
});

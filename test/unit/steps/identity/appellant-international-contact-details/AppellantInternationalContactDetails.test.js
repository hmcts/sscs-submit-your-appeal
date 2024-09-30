const { expect } = require('test/util/chai');
const paths = require('paths');
const { decode } = require('utils/stringUtils');
const AppellantInternationalContactDetails = require('steps/identity/appellant-international-contact-details/AppellantInternationalContactDetails');
const countriesList = require('utils/countriesList');
const portOfEntryList = require('utils/portOfEntryList');
const userAnswer = require('utils/answer');

describe('AppellantInternationalContactDetails.js', () => {
  let appellantInternationalContactDetails = null;
  beforeEach(() => {
    appellantInternationalContactDetails = new AppellantInternationalContactDetails({
      journey: {
        steps: {
          TextReminders: paths.smsNotify.appellantTextReminders
        }
      }
    });
    appellantInternationalContactDetails.fields = {};
  });

  describe('get path()', () => {
    it('returns path /appellant-international-contact-details', () => {
      expect(AppellantInternationalContactDetails.path).to.equal(paths.identity.enterAppellantInternationalContactDetails);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    beforeEach(() => {
      fields = appellantInternationalContactDetails.form.fields;
    });

    it('should contain 5 fields', () => {
      expect(Object.keys(fields).length).to.equal(5);
      expect(fields).to.have.all.keys('country', 'internationalAddress', 'portOfEntry', 'phoneNumber', 'emailAddress');
    });

    describe('country field', () => {
      beforeEach(() => {
        field = fields.country;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });

      it('validates all valid countries', () => {
        const schema = appellantInternationalContactDetails.validCountrySchema();
        for (const testCountry of countriesList) {
          const result = schema.validate(decode(testCountry.value));
          expect(result.error).to.eq(null);
        }
      });

      it('rejects non valid countries', () => {
        const schema = appellantInternationalContactDetails.validCountrySchema();
        const result = schema.validate(decode('Rt Hon'));
        expect(result.error).not.to.eq(null);
      });
    });

    describe('internationalAddress field', () => {
      beforeEach(() => {
        field = fields.internationalAddress;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });

    describe('portOfEntry field', () => {
      beforeEach(() => {
        field = fields.portOfEntry;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });

      it('validates all valid ports of entry', () => {
        const schema = appellantInternationalContactDetails.validPortSchema();
        for (const testPort of portOfEntryList) {
          const result = schema.validate(decode(testPort.value));
          expect(result.error).to.eq(null);
        }
      });

      it('rejects non valid ports of entry', () => {
        const schema = appellantInternationalContactDetails.validPortSchema();
        const result = schema.validate(decode('Rt Hon'));
        expect(result.error).not.to.eq(null);
      });
    });

    describe('phoneNumber field', () => {
      beforeEach(() => {
        field = fields.phoneNumber;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });

    describe('emailAddress field', () => {
      beforeEach(() => {
        field = fields.emailAddress;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
  });


  describe('get getCountries()', () => {
    it('should return the countryList', () => {
      expect(appellantInternationalContactDetails.getCountries).to.equal(countriesList);
    });
  });

  describe('get getPortOfEntryList()', () => {
    it('should return the portOfEntryList', () => {
      expect(appellantInternationalContactDetails.getPortOfEntryList).to.equal(portOfEntryList);
    });
  });

  describe('answers()', () => {
    let answers = null;

    before(() => {
      answers = appellantInternationalContactDetails.answers()[0];
    });

    it('should return expected section', () => {
      expect(answers.section).to.equal('appellant-details');
    });

    it('should return expected template', () => {
      expect(answers.template).to.equal('answer.html');
    });
  });


  describe('get CYAPhoneNumber()', () => {
    it('should return Not Provided if there is no phoneNumber value', () => {
      appellantInternationalContactDetails.fields.phoneNumber = {};
      expect(appellantInternationalContactDetails.CYAPhoneNumber).to.equal(userAnswer.NOT_PROVIDED);
    });

    it('should return the phone number if a phoneNumber value has been set', () => {
      appellantInternationalContactDetails.fields.phoneNumber = { value: '0800109756' };
      expect(appellantInternationalContactDetails.CYAPhoneNumber)
        .to.equal(appellantInternationalContactDetails.fields.phoneNumber.value);
    });
  });
  describe('get CYAEmailAddress()', () => {
    it('should return Not Provided if there is no email value', () => {
      appellantInternationalContactDetails.fields.phoneNumber = {};
      expect(appellantInternationalContactDetails.CYAEmailAddress).to.equal(userAnswer.NOT_PROVIDED);
    });

    it('should return the email address if an emailaddress value has been set', () => {
      appellantInternationalContactDetails.fields.emailAddress = { value: 'myemailaddress@sscs.com' };
      expect(appellantInternationalContactDetails.CYAEmailAddress)
        .to.equal(appellantInternationalContactDetails.fields.emailAddress.value);
    });
  });

  describe('values()', () => {
    it('should contain a value object', () => {
      appellantInternationalContactDetails.fields.country = { value: 'Iceland' };
      appellantInternationalContactDetails.fields.internationalAddress = { value: 'Some rich text field value address here' };
      appellantInternationalContactDetails.fields.portOfEntry = { value: 'Biggin Hill' };
      appellantInternationalContactDetails.fields.phoneNumber = { value: '0800109756' };
      appellantInternationalContactDetails.fields.emailAddress = { value: 'myemailaddress@sscs.com' };

      const values = appellantInternationalContactDetails.values();
      expect(values).to.eql({
        appellant: {
          contactDetails: {
            country: 'Iceland',
            internationalAddress: 'Some rich text field value address here',
            portOfEntry: 'Biggin Hill',
            phoneNumber: '0800109756',
            emailAddress: 'myemailaddress@sscs.com'
          }
        }
      });
    });

    it('should contain an empty object', () => {
      appellantInternationalContactDetails.fields.country = {};
      appellantInternationalContactDetails.fields.internationalAddress = {};
      appellantInternationalContactDetails.fields.portOfEntry = {};
      appellantInternationalContactDetails.fields.phoneNumber = {};
      appellantInternationalContactDetails.fields.emailAddress = {};
      const values = appellantInternationalContactDetails.values();
      expect(values).to.deep.equal({
        appellant: {
          contactDetails: {
            country: '',
            internationalAddress: '',
            portOfEntry: '',
            phoneNumber: undefined,
            emailAddress: undefined
          }
        }
      });
    });

    it('removes whitespace from before and after the phone number string', () => {
      appellantInternationalContactDetails.fields.country = {};
      appellantInternationalContactDetails.fields.internationalAddress = {};
      appellantInternationalContactDetails.fields.portOfEntry = {};
      appellantInternationalContactDetails.fields.emailAddress = {};
      appellantInternationalContactDetails.fields.phoneNumber = { value: ' 0800109756 ' };
      const phoneNumber = appellantInternationalContactDetails.values().appellant.contactDetails.phoneNumber;
      expect(phoneNumber).to.not.equal(' 0800109756 ');
      expect(phoneNumber).to.equal('0800109756');
    });
  });


  describe('next()', () => {
    it('returns the next step path /appellant-text-reminders', () => {
      expect(appellantInternationalContactDetails.next().step)
        .to.eql(paths.smsNotify.appellantTextReminders);
    });
  });
});

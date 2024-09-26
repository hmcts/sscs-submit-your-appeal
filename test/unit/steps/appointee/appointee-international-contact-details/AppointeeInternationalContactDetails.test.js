const { expect } = require('test/util/chai');
const paths = require('paths');
const { decode } = require('utils/stringUtils');
const AppointeeInternationalContactDetails = require('steps/appointee/appointee-international-contact-details/AppointeeInternationalContactDetails');
const countriesList = require('../../../../../utils/countriesList');
const portOfEntryList = require('../../../../../utils/portOfEntryList');
const userAnswer = require('../../../../../utils/answer');

describe('AppointeeInternationalContactDetails.js', () => {
  let appointeeInternationalContactDetails = null;
  beforeEach(() => {
    appointeeInternationalContactDetails = new AppointeeInternationalContactDetails({
      journey: {
        steps: {
          AppellantName: paths.identity.enterAppellantName
        }
      }
    });
    appointeeInternationalContactDetails.fields = {};
  });

  describe('get path()', () => {
    it('returns path /appointee-international-contact-details', () => {
      expect(AppointeeInternationalContactDetails.path).to.equal(paths.appointee.enterAppointeeInternationalContactDetails);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    beforeEach(() => {
      fields = appointeeInternationalContactDetails.form.fields;
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
        const schema = appointeeInternationalContactDetails.validCountrySchema();
        for (const testCountry of countriesList) {
          const result = schema.validate(decode(testCountry.value));
          expect(result.error).to.eq(null);
        }
      });

      it('rejects non valid countries', () => {
        const schema = appointeeInternationalContactDetails.validCountrySchema();
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
        const schema = appointeeInternationalContactDetails.validPortSchema();
        for (const testPort of portOfEntryList) {
          const result = schema.validate(decode(testPort.value));
          expect(result.error).to.eq(null);
        }
      });

      it('rejects non valid ports of entry', () => {
        const schema = appointeeInternationalContactDetails.validPortSchema();
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

  describe('answers()', () => {
    let answers = null;

    before(() => {
      answers = appointeeInternationalContactDetails.answers()[0];
    });

    it('should return expected section', () => {
      expect(answers.section).to.equal('appointee-details');
    });

    it('should return expected template', () => {
      expect(answers.template).to.equal('answer.html');
    });
  });


  describe('get CYAPhoneNumber()', () => {
    it('should return Not Provided if there is no phoneNumber value', () => {
      appointeeInternationalContactDetails.fields.phoneNumber = {};
      expect(appointeeInternationalContactDetails.CYAPhoneNumber).to.equal(userAnswer.NOT_PROVIDED);
    });

    it('should return the phone number if a phoneNumber value has been set', () => {
      appointeeInternationalContactDetails.fields.phoneNumber = { value: '0800109756' };
      expect(appointeeInternationalContactDetails.CYAPhoneNumber)
        .to.equal(appointeeInternationalContactDetails.fields.phoneNumber.value);
    });
  });
  describe('get CYAEmailAddress()', () => {
    it('should return Not Provided if there is no email value', () => {
      appointeeInternationalContactDetails.fields.phoneNumber = {};
      expect(appointeeInternationalContactDetails.CYAEmailAddress).to.equal(userAnswer.NOT_PROVIDED);
    });

    it('should return the email address if an emailaddress value has been set', () => {
      appointeeInternationalContactDetails.fields.emailAddress = { value: 'myemailaddress@sscs.com' };
      expect(appointeeInternationalContactDetails.CYAEmailAddress)
        .to.equal(appointeeInternationalContactDetails.fields.emailAddress.value);
    });
  });

  describe('values()', () => {
    it('should contain a value object', () => {
      appointeeInternationalContactDetails.fields.country = { value: 'Iceland' };
      appointeeInternationalContactDetails.fields.internationalAddress = { value: 'Some rich text field value address here' };
      appointeeInternationalContactDetails.fields.portOfEntry = { value: 'Biggin Hill' };
      appointeeInternationalContactDetails.fields.phoneNumber = { value: '0800109756' };
      appointeeInternationalContactDetails.fields.emailAddress = { value: 'myemailaddress@sscs.com' };

      const values = appointeeInternationalContactDetails.values();
      expect(values).to.eql({
        appointee: {
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
      appointeeInternationalContactDetails.fields.country = {};
      appointeeInternationalContactDetails.fields.internationalAddress = {};
      appointeeInternationalContactDetails.fields.portOfEntry = {};
      appointeeInternationalContactDetails.fields.phoneNumber = {};
      appointeeInternationalContactDetails.fields.emailAddress = {};
      const values = appointeeInternationalContactDetails.values();
      expect(values).to.deep.equal({
        appointee: {
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
      appointeeInternationalContactDetails.fields.country = {};
      appointeeInternationalContactDetails.fields.internationalAddress = {};
      appointeeInternationalContactDetails.fields.portOfEntry = {};
      appointeeInternationalContactDetails.fields.emailAddress = {};
      appointeeInternationalContactDetails.fields.phoneNumber = { value: ' 0800109756 ' };
      const phoneNumber = appointeeInternationalContactDetails.values().appointee.contactDetails.phoneNumber;
      expect(phoneNumber).to.not.equal(' 0800109756 ');
      expect(phoneNumber).to.equal('0800109756');
    });
  });


  describe('next()', () => {
    it('returns the next step path /enter-appellant-name', () => {
      expect(appointeeInternationalContactDetails.next())
        .to.eql({ nextStep: paths.identity.enterAppellantName });
    });
  });
});

const { expect } = require('test/util/chai');
const paths = require('paths');
const { decode } = require('utils/stringUtils');
const AppellantInternationalContactDetails = require('steps/identity/appellant-international-contact-details/AppellantInternationalContactDetails');
const countriesList = require('utils/countriesList');
const userAnswer = require('utils/answer');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');
const { setPortOfEntries, getPortOfEntries } = require('utils/enumJsonLists');

describe('AppellantInternationalContactDetails.js', () => {
  setPortOfEntries([
    {
      label: 'Aberdeen',
      value: 'Aberdeen',
      trafficType: 'Sea traffic',
      locationCode: 'GB000434'
    },
    {
      label: 'Aberdeen Airport',
      value: 'Aberdeen Airport',
      trafficType: 'Air traffic',
      locationCode: 'GB000411'
    }
  ]);
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

  describe('handler()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('no redirect to /does-not-exist called for iba', () => {
      const superStub = sinon.stub(SaveToDraftStore.prototype, 'handler');
      const req = {
        method: 'GET',
        session: {
          BenefitType: {
            benefitType: benefitTypes.infectedBloodAppeal
          }
        }
      };
      const res = {
        redirect: sinon.spy()
      };
      const next = sinon.spy();
      appellantInternationalContactDetails.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
    it('redirect to /does-not-exist called for non iba', () => {
      const superStub = sinon.stub(SaveToDraftStore.prototype, 'handler');
      const req = {
        method: 'GET',
        session: {
          BenefitType: {
            benefitType: benefitTypes.nationalInsuranceCredits
          }
        }
      };
      const res = {
        redirect: sinon.spy()
      };
      const next = sinon.spy();
      appellantInternationalContactDetails.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    beforeEach(() => {
      fields = appellantInternationalContactDetails.form.fields;
    });

    it('should contain 5 fields', () => {
      expect(Object.keys(fields).length).to.equal(7);
      expect(fields).to.have.all.keys('addressLine1', 'addressLine2', 'townCity', 'country', 'portOfEntry', 'phoneNumber', 'emailAddress');
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

    describe('addressLine1 field', () => {
      beforeEach(() => {
        field = fields.addressLine1;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });

    describe('addressLine2 field', () => {
      beforeEach(() => {
        field = fields.addressLine2;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });

    describe('townCity field', () => {
      beforeEach(() => {
        field = fields.townCity;
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
        for (const testPort of getPortOfEntries()) {
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
      expect(appellantInternationalContactDetails.getPortOfEntryList).to.equal(getPortOfEntries());
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
      appellantInternationalContactDetails.fields.addressLine1 = { value: 'Some address line 1' };
      appellantInternationalContactDetails.fields.addressLine2 = { value: 'Some address line 2' };
      appellantInternationalContactDetails.fields.townCity = { value: 'Some Town or City' };
      appellantInternationalContactDetails.fields.portOfEntry = { value: 'Biggin Hill' };
      appellantInternationalContactDetails.fields.phoneNumber = { value: '0800109756' };
      appellantInternationalContactDetails.fields.emailAddress = { value: 'myemailaddress@sscs.com' };

      const values = appellantInternationalContactDetails.values();
      expect(values).to.eql({
        appellant: {
          contactDetails: {
            country: 'Iceland',
            addressLine1: 'Some address line 1',
            addressLine2: 'Some address line 2',
            townCity: 'Some Town or City',
            portOfEntry: 'Biggin Hill',
            phoneNumber: '0800109756',
            emailAddress: 'myemailaddress@sscs.com'
          }
        }
      });
    });

    it('should contain an empty object', () => {
      appellantInternationalContactDetails.fields.country = {};
      appellantInternationalContactDetails.fields.addressLine1 = {};
      appellantInternationalContactDetails.fields.addressLine2 = {};
      appellantInternationalContactDetails.fields.townCity = {};
      appellantInternationalContactDetails.fields.portOfEntry = {};
      appellantInternationalContactDetails.fields.phoneNumber = {};
      appellantInternationalContactDetails.fields.emailAddress = {};
      const values = appellantInternationalContactDetails.values();
      expect(values).to.deep.equal({
        appellant: {
          contactDetails: {
            country: '',
            addressLine1: '',
            addressLine2: '',
            townCity: '',
            portOfEntry: '',
            phoneNumber: undefined,
            emailAddress: undefined
          }
        }
      });
    });

    it('removes whitespace from before and after the phone number string', () => {
      appellantInternationalContactDetails.fields.country = {};
      appellantInternationalContactDetails.fields.addressLine1 = {};
      appellantInternationalContactDetails.fields.addressLine2 = {};
      appellantInternationalContactDetails.fields.townCity = {};
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

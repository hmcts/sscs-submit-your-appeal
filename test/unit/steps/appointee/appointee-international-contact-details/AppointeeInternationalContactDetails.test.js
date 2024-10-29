const { expect } = require('test/util/chai');
const paths = require('paths');
const { decode } = require('utils/stringUtils');
const AppointeeInternationalContactDetails = require('steps/appointee/appointee-international-contact-details/AppointeeInternationalContactDetails');
const userAnswer = require('utils/answer');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');
const { getCountriesOfResidence, fetchCountriesOfResidence } = require('utils/enumJsonLists');
const superagent = require('superagent');
const config = require('config');

describe('AppointeeInternationalContactDetails.js', () => {
  let superagentGetStub = null;
  let appointeeInternationalContactDetails = null;
  beforeEach(async() => {
    appointeeInternationalContactDetails = new AppointeeInternationalContactDetails({
      journey: {
        steps: {
          AppellantName: paths.identity.enterAppellantName
        }
      }
    });
    appointeeInternationalContactDetails.fields = {};
    const mockCountryResponse = { body: [{ label: 'Italy' }, { label: 'Ivory Coast' }], status: 200 };
    superagentGetStub = sinon.stub(superagent, 'get');
    superagentGetStub.withArgs(`${config.api.url}/api/citizen/countries-of-residence`).resolves(mockCountryResponse);
    await fetchCountriesOfResidence();
  });

  afterEach(() => sinon.restore());

  describe('get path()', () => {
    it('returns path /appointee-international-contact-details', () => {
      expect(AppointeeInternationalContactDetails.path).to.equal(paths.appointee.enterAppointeeInternationalContactDetails);
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
      appointeeInternationalContactDetails.handler(req, res, next);
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
      appointeeInternationalContactDetails.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    beforeEach(() => {
      fields = appointeeInternationalContactDetails.form.fields;
    });

    it('should contain 5 fields', () => {
      expect(Object.keys(fields).length).to.equal(6);
      expect(fields).to.have.all.keys('addressLine1', 'addressLine2', 'townCity', 'country', 'phoneNumber', 'emailAddress');
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
        for (const testCountry of getCountriesOfResidence()) {
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

  describe('get getCountries()', () => {
    it('should return the countryList', () => {
      expect(appointeeInternationalContactDetails.getCountries).to.equal(getCountriesOfResidence());
    });
  });

  describe('values()', () => {
    it('should contain a value object', () => {
      appointeeInternationalContactDetails.fields.country = { value: 'Iceland' };
      appointeeInternationalContactDetails.fields.addressLine1 = { value: 'Some address line 1' };
      appointeeInternationalContactDetails.fields.addressLine2 = { value: 'Some address line 2' };
      appointeeInternationalContactDetails.fields.townCity = { value: 'Some Town or City' };
      appointeeInternationalContactDetails.fields.phoneNumber = { value: '0800109756' };
      appointeeInternationalContactDetails.fields.emailAddress = { value: 'myemailaddress@sscs.com' };

      const values = appointeeInternationalContactDetails.values();
      expect(values).to.eql({
        appointee: {
          contactDetails: {
            addressLine1: 'Some address line 1',
            addressLine2: 'Some address line 2',
            townCity: 'Some Town or City',
            country: 'Iceland',
            phoneNumber: '0800109756',
            emailAddress: 'myemailaddress@sscs.com'
          }
        }
      });
    });

    it('should contain an empty object', () => {
      appointeeInternationalContactDetails.fields.country = {};
      appointeeInternationalContactDetails.fields.addressLine1 = {};
      appointeeInternationalContactDetails.fields.addressLine2 = {};
      appointeeInternationalContactDetails.fields.townCity = {};
      appointeeInternationalContactDetails.fields.phoneNumber = {};
      appointeeInternationalContactDetails.fields.emailAddress = {};
      const values = appointeeInternationalContactDetails.values();
      expect(values).to.deep.equal({
        appointee: {
          contactDetails: {
            country: '',
            addressLine1: '',
            addressLine2: '',
            townCity: '',
            phoneNumber: undefined,
            emailAddress: undefined
          }
        }
      });
    });

    it('removes whitespace from before and after the phone number string', () => {
      appointeeInternationalContactDetails.fields.country = {};
      appointeeInternationalContactDetails.fields.addressLine1 = {};
      appointeeInternationalContactDetails.fields.addressLine2 = {};
      appointeeInternationalContactDetails.fields.townCity = {};
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

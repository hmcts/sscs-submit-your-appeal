/* eslint-disable max-len */

const { expect } = require('test/util/chai');
const AppellantContactDetails = require('steps/identity/appellant-contact-details/AppellantContactDetails');
const paths = require('paths');
const userAnswer = require('utils/answer');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const pcl = require('components/postcodeLookup/controller');

describe('AppellantContactDetails.js', () => {
  let appellantContactDetails = null;

  beforeEach(() => {
    appellantContactDetails = new AppellantContactDetails({
      journey: {
        steps: {
          TextReminders: paths.smsNotify.appellantTextReminders
        }
      },
      session: {}
    });

    appellantContactDetails.fields = {
      firstName: { value: '' },
      lastName: { value: '' },
      addressLine1: { value: '' },
      addressLine2: { value: '' },
      townCity: { value: '' },
      county: { value: '' },
      postCode: { value: '' },
      phoneNumber: {},
      emailAddress: { value: '' }
    };
  });

  describe('get path()', () => {
    it('returns path /enter-appellant-contact-details', () => {
      expect(AppellantContactDetails.path).to.equal(paths.identity.enterAppellantContactDetails);
    });
  });

  describe('get CYAPhoneNumber()', () => {
    it('should return Not Provided if there is no phoneNumber value', () => {
      expect(appellantContactDetails.CYAPhoneNumber).to.equal(userAnswer.NOT_PROVIDED);
    });

    it('should return the phone number if a phoneNumber value has been set', () => {
      appellantContactDetails.fields.phoneNumber.value = '0800109756';
      expect(appellantContactDetails.CYAPhoneNumber).to.equal(appellantContactDetails.fields.phoneNumber.value);
    });
  });

  describe('get CYAEmailAddress()', () => {
    it('should return Not Provided if there is no email value', () => {
      expect(appellantContactDetails.CYAEmailAddress).to.equal(userAnswer.NOT_PROVIDED);
    });

    it('should return the email address if an emailaddress value has been set', () => {
      appellantContactDetails.fields.emailAddress.value = 'myemailaddress@sscs.com';
      expect(appellantContactDetails.CYAEmailAddress).to.equal(appellantContactDetails.fields.emailAddress.value);
    });
  });

  describe('isEnglandOrWalesPostcode', () => {
    describe('postcode checker disabled', () => {
      it('does not check postcode when postcode checker disabled', () => {
        const appellantContactDetailsWithoutPostcodeChecker = proxyquire('steps/identity/appellant-contact-details/AppellantContactDetails', {
          config: { get: () => false }
        });

        const theSession = {};
        const req = { session: theSession };
        const resp = sinon.stub();
        const next = sinon.stub();

        appellantContactDetailsWithoutPostcodeChecker.isEnglandOrWalesPostcode(req, resp, next);

        expect(theSession.invalidPostcode).to.equal(false);
        expect(next).to.have.been.called;
      });
    });


    describe('postcode checker enabled', () => {
      let responseFromPostcodeChecker = null;
      let appellantContactDetailsWithoutPostcodeChecker = null;
      const theSession = {};
      const req = { session: theSession, method: 'POST', body: { postCode: 'S10 2FG' } };

      beforeEach(() => {
        appellantContactDetailsWithoutPostcodeChecker = proxyquire('steps/identity/appellant-contact-details/AppellantContactDetails', {
          config: { get: () => true },
          'utils/postcodeChecker': () => {
            return responseFromPostcodeChecker;
          }
        });
      });

      it('checks postcode and it is valid', done => {
        responseFromPostcodeChecker = Promise.resolve(true);

        appellantContactDetailsWithoutPostcodeChecker.isEnglandOrWalesPostcode(req, {}, () => {
          expect(theSession.invalidPostcode).to.equal(false);
          done();
        });
      });

      it('checks postcode and it is invalid', done => {
        responseFromPostcodeChecker = Promise.resolve(false);

        appellantContactDetailsWithoutPostcodeChecker.isEnglandOrWalesPostcode(req, {}, () => {
          expect(theSession.invalidPostcode).to.equal(true);
          done();
        });
      });

      it('error checking postcode', done => {
        responseFromPostcodeChecker = Promise.reject(new Error());

        appellantContactDetailsWithoutPostcodeChecker.isEnglandOrWalesPostcode(req, {}, () => {
          expect(theSession.invalidPostcode).to.equal(true);
          done();
        });
      });
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = appellantContactDetails.form.fields;
    });

    describe('all field names', () => {
      it('should contain 7 fields', () => {
        expect(Object.keys(fields).length).to.equal(9);
        expect(fields).to.have.all.keys(
          'addressLine1',
          'addressLine2',
          'townCity',
          'county',
          'postCode',
          'phoneNumber',
          'emailAddress',
          'postCodeLookup',
          'postcodeAddress');
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

    describe('county field', () => {
      beforeEach(() => {
        field = fields.county;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });

    describe('postCode field', () => {
      beforeEach(() => {
        field = fields.postCode;
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
      answers = appellantContactDetails.answers()[0];
    });

    it('should return expected section', () => {
      expect(answers.section).to.equal('appellant-details');
    });

    it('should return expected template', () => {
      expect(answers.template).to.equal('answer.html');
    });
  });

  describe('values()', () => {
    it('should contain a value object', () => {
      appellantContactDetails.fields.addressLine1.value = 'First line of my address';
      appellantContactDetails.fields.addressLine2.value = 'Second line of my address';
      appellantContactDetails.fields.townCity.value = 'Town or City';
      appellantContactDetails.fields.county.value = 'County';
      appellantContactDetails.fields.postCode.value = 'Postcode';
      appellantContactDetails.fields.phoneNumber.value = '0800109756';
      appellantContactDetails.fields.emailAddress.value = 'myemailaddress@sscs.com';
      const values = appellantContactDetails.values();
      expect(values).to.eql({
        appellant: {
          contactDetails: {
            addressLine1: 'First line of my address',
            addressLine2: 'Second line of my address',
            townCity: 'Town or City',
            county: 'County',
            postCode: 'Postcode',
            phoneNumber: '0800109756',
            emailAddress: 'myemailaddress@sscs.com'
          }
        }
      });
    });

    it('removes whitespace from before and after the postcode string', () => {
      appellantContactDetails.fields.postCode.value = ' Post code ';
      const postcode = appellantContactDetails.values().appellant.contactDetails.postCode;
      expect(postcode).to.not.equal(' Post code ');
      expect(postcode).to.equal('Post code');
    });

    it('removes whitespace from before and after the phone number string', () => {
      appellantContactDetails.fields.phoneNumber.value = ' 0800109756 ';
      const phoneNumber = appellantContactDetails.values().appellant.contactDetails.phoneNumber;
      expect(phoneNumber).to.not.equal(' 0800109756 ');
      expect(phoneNumber).to.equal('0800109756');
    });
  });

  describe('next()', () => {
    it('returns the next step path /appellant-text-reminders', () => {
      expect(appellantContactDetails.next()).to.eql({ nextStep: paths.smsNotify.appellantTextReminders });
    });
  });

  describe('handler()', () => {
    const pclSpy = sinon.spy(pcl, 'controller');
    const req = { method: 'POST', body: {}, session: {}, query: {} };
    const next = sinon.spy();
    const redirect = sinon.spy();
    const res = { redirect };
    it('call pcl controller once', () => {
      appellantContactDetails.handler(req, res, next);
      expect(pclSpy).to.have.been.calledOnce;
    });
  });
});

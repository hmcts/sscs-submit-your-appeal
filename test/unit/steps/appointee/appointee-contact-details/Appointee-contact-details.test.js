const { expect } = require('test/util/chai');
const AppointeeContactDetails = require(
  'steps/appointee/appointee-contact-details/AppointeeContactDetails'
);
const paths = require('paths');
const userAnswer = require('utils/answer');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const config = require('config');

describe('Appointee-contact-details.js', () => {
  let appointeeContactDetails = null;
  const isPostCodeLookupEnabled = config.postcodeLookup.enabled === 'true';

  beforeEach(() => {
    appointeeContactDetails = new AppointeeContactDetails({
      journey: {
        steps: {
          AppellantName: paths.identity.enterAppellantName
        }
      },
      session: {}
    });

    appointeeContactDetails.fields = {
      firstName: { value: '' },
      lastName: { value: '' },
      addressLine1: { value: '' },
      addressLine2: { value: '' },
      townCity: { value: '' },
      county: { value: '' },
      postCode: { value: '' },
      phoneNumber: {},
      emailAddress: { value: '' },
      postcodeLookup: { value: '' },
      postcodeAddress: { value: '' }
    };
  });

  describe('get path()', () => {
    it('returns path /appointee-contact-details', () => {
      expect(AppointeeContactDetails.path).to.equal(paths.appointee.enterAppointeeContactDetails);
    });
  });

  describe('handler()', () => {
    let pclSpy = '';

    beforeEach(() => {
      pclSpy = sinon.spy(appointeeContactDetails.pcl, 'init');
    });

    afterEach(() => {
      appointeeContactDetails.pcl.init.restore();
    });

    const req = { method: 'GET', body: {}, session: {}, query: {} };
    const next = sinon.spy();
    const redirect = sinon.spy();
    const res = { redirect };
    it('call pcl controller once', () => {
      appointeeContactDetails.req = req;
      appointeeContactDetails.handler(req, res, next);
      expect(pclSpy).to.have.been.calledOnce;
    });
  });

  describe('get CYAPhoneNumber()', () => {
    it('should return Not Provided if there is no phoneNumber value', () => {
      expect(appointeeContactDetails.CYAPhoneNumber).to.equal(userAnswer.NOT_PROVIDED);
    });

    it('should return the phone number if a phoneNumber value has been set', () => {
      appointeeContactDetails.fields.phoneNumber.value = '0800109756';
      expect(appointeeContactDetails.CYAPhoneNumber)
        .to.equal(appointeeContactDetails.fields.phoneNumber.value);
    });

    describe('get CYAEmailAddress()', () => {
      it('should return Not Provided if there is no email value', () => {
        expect(appointeeContactDetails.CYAEmailAddress).to.equal(userAnswer.NOT_PROVIDED);
      });

      it('should return the email address if an emailaddress value has been set', () => {
        appointeeContactDetails.fields.emailAddress.value = 'myemailaddress@sscs.com';
        expect(appointeeContactDetails.CYAEmailAddress)
          .to.equal(appointeeContactDetails.fields.emailAddress.value);
      });
    });
  });

  describe('isEnglandOrWalesPostcode', () => {
    describe('postcode checker disabled', () => {
      it('does not check postcode when postcode checker disabled', () => {
        const appointeeContactDetailsWithoutPostcodeChecker = proxyquire(
          'steps/appointee/appointee-contact-details/AppointeeContactDetails',
          {
            config: { get: () => false }
          });

        const theSession = {};
        const req = { session: theSession };
        const resp = sinon.stub();
        const next = sinon.stub();

        appointeeContactDetailsWithoutPostcodeChecker.isEnglandOrWalesPostcode(req, resp, next);

        expect(theSession.invalidPostcode).to.equal(false);
        expect(next).to.have.been.called;
      });
    });


    describe('postcode checker enabled', () => {
      let responseFromPostcodeChecker = null;
      let appointeeContactDetailsWithoutPostcodeChecker = null;
      const theSession = {};
      const req = { session: theSession, method: 'POST', body: { postCode: 'S10 2FG' } };

      beforeEach(() => {
        appointeeContactDetailsWithoutPostcodeChecker = proxyquire(
          'steps/appointee/appointee-contact-details/AppointeeContactDetails',
          {
            config: { get: () => true },
            'utils/postcodeChecker': () => {
              return responseFromPostcodeChecker;
            }
          });
      });

      it('checks postcode and it is valid', done => {
        responseFromPostcodeChecker = Promise.resolve(true);

        appointeeContactDetailsWithoutPostcodeChecker.isEnglandOrWalesPostcode(req, {}, () => {
          expect(theSession.invalidPostcode).to.equal(false);
          done();
        });
      });

      it('checks postcode and it is invalid', done => {
        responseFromPostcodeChecker = Promise.resolve(false);

        appointeeContactDetailsWithoutPostcodeChecker.isEnglandOrWalesPostcode(req, {}, () => {
          expect(theSession.invalidPostcode).to.equal(true);
          done();
        });
      });

      it('error checking postcode', done => {
        responseFromPostcodeChecker = Promise.reject(new Error());

        appointeeContactDetailsWithoutPostcodeChecker.isEnglandOrWalesPostcode(req, {}, () => {
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
      fields = appointeeContactDetails.form.fields;
    });

    describe('all field names', () => {
      it('should contain dynamic fields', () => {
        const req = { method: 'GET', body: {}, session: {}, query: {} };
        const next = sinon.spy();
        const redirect = sinon.spy();
        const res = { redirect };
        appointeeContactDetails.req = req;
        appointeeContactDetails.handler(req, res, next);
        fields = appointeeContactDetails.form.fields;
        if (isPostCodeLookupEnabled) {
          expect(Object.keys(fields).length).to.equal(3);
          expect(fields).to.have.all.keys(
            'phoneNumber',
            'emailAddress',
            'postcodeLookup');
        } else {
          expect(Object.keys(fields).length).to.equal(7);
          expect(fields).to.have.all.keys(
            'addressLine1',
            'addressLine2',
            'townCity',
            'county',
            'postCode',
            'phoneNumber',
            'emailAddress');
        }
      });
    });

    describe('addressLine1 field', () => {
      if (!isPostCodeLookupEnabled) {
        beforeEach(() => {
          field = fields.addressLine1;
        });

        it('has constructor name FieldDescriptor', () => {
          expect(field.constructor.name).to.eq('FieldDescriptor');
        });

        it('contains validation', () => {
          expect(field.validations.length).to.eq(2);
        });
      }
    });

    describe('addressLine2 field', () => {
      if (!isPostCodeLookupEnabled) {
        beforeEach(() => {
          field = fields.addressLine2;
        });

        it('has constructor name FieldDescriptor', () => {
          expect(field.constructor.name).to.eq('FieldDescriptor');
        });

        it('addressLine2 contains validation', () => {
          expect(field.validations.length).to.eq(1);
        });
      }
    });

    describe('townCity field', () => {
      if (!isPostCodeLookupEnabled) {
        beforeEach(() => {
          field = fields.townCity;
        });

        it('has constructor name FieldDescriptor', () => {
          expect(field.constructor.name).to.eq('FieldDescriptor');
        });

        it('contains validation', () => {
          expect(field.validations.length).to.eq(2);
        });
      }
    });

    describe('county field', () => {
      if (!isPostCodeLookupEnabled) {
        beforeEach(() => {
          field = fields.county;
        });

        it('has constructor name FieldDescriptor', () => {
          expect(field.constructor.name).to.eq('FieldDescriptor');
        });

        it('contains validation', () => {
          expect(field.validations.length).to.eq(2);
        });
      }
    });

    describe('postCode field', () => {
      if (!isPostCodeLookupEnabled) {
        beforeEach(() => {
          field = fields.postCode;
        });

        it('has constructor name FieldDescriptor', () => {
          expect(field.constructor.name).to.eq('FieldDescriptor');
        });

        it('contains validation', () => {
          expect(field.validations).to.not.be.empty;
        });
      }
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
      answers = appointeeContactDetails.answers()[0];
    });

    it('should return expected section', () => {
      expect(answers.section).to.equal('appointee-details');
    });

    it('should return expected template', () => {
      expect(answers.template).to.equal('answer.html');
    });
  });

  describe('values()', () => {
    it('should contain a value object', () => {
      appointeeContactDetails.fields.addressLine1.value = 'First line of my address';
      appointeeContactDetails.fields.addressLine2.value = 'Second line of my address';
      appointeeContactDetails.fields.townCity.value = 'Town or City';
      appointeeContactDetails.fields.county.value = 'County';
      appointeeContactDetails.fields.postCode.value = 'Postcode';
      appointeeContactDetails.fields.phoneNumber.value = '0800109756';
      appointeeContactDetails.fields.emailAddress.value = 'myemailaddress@sscs.com';
      appointeeContactDetails.fields.postcodeLookup.value = 'n29ed';
      appointeeContactDetails.fields.postcodeAddress.value = '200000';

      const values = appointeeContactDetails.values();
      expect(values).to.eql({
        appointee: {
          contactDetails: {
            addressLine1: 'First line of my address',
            addressLine2: 'Second line of my address',
            townCity: 'Town or City',
            county: 'County',
            postCode: 'Postcode',
            postcodeLookup: 'n29ed',
            postcodeAddress: '200000',
            phoneNumber: '0800109756',
            emailAddress: 'myemailaddress@sscs.com'
          }
        }
      });
    });

    it('should contain an empty object', () => {
      appointeeContactDetails.fields.postcodeLookup = undefined;
      appointeeContactDetails.fields.postcodeAddress = undefined;
      const values = appointeeContactDetails.values();
      expect(values).to.deep.equal({
        appointee: {
          contactDetails: {
            addressLine1: '',
            addressLine2: '',
            townCity: '',
            county: '',
            postCode: '',
            postcodeLookup: '',
            postcodeAddress: '',
            phoneNumber: undefined,
            emailAddress: ''
          }
        }
      });
    });

    it('removes whitespace from before and after the postcode string', () => {
      appointeeContactDetails.fields.postCode.value = ' Post code ';
      const postcode = appointeeContactDetails.values().appointee.contactDetails.postCode;
      expect(postcode).to.not.equal(' Post code ');
      expect(postcode).to.equal('Post code');
    });

    it('removes whitespace from before and after the phone number string', () => {
      appointeeContactDetails.fields.phoneNumber.value = ' 0800109756 ';
      const phoneNumber = appointeeContactDetails.values().appointee.contactDetails.phoneNumber;
      expect(phoneNumber).to.not.equal(' 0800109756 ');
      expect(phoneNumber).to.equal('0800109756');
    });
  });

  describe('next()', () => {
    it('returns the next step path /appellant-text-reminders', () => {
      expect(appointeeContactDetails.next())
        .to.eql({ nextStep: paths.identity.enterAppellantName });
    });
  });
});

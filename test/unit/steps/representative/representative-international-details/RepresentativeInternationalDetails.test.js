/* eslint-disable max-len */
const { expect } = require('test/util/chai');
const RepresentativeInternationalDetails = require('steps/representative/representative-international-details/RepresentativeInternationalDetails');
const paths = require('paths');
const userAnswer = require('utils/answer');
const sinon = require('sinon');
const countriesList = require('utils/countriesList');
const { decode } = require('utils/stringUtils');

describe('RepresentativeInternationalDetails.js', () => {
  let representativeInternationalDetails = null;
  const res = { send: sinon.spy() };

  beforeEach(() => {
    representativeInternationalDetails = new RepresentativeInternationalDetails({
      journey: {
        steps: {
          ReasonForAppealing: paths.reasonsForAppealing.reasonForAppealing
        }
      },
      session: {}
    }, res);

    representativeInternationalDetails.fields = {
      name: {
        title: { value: '' },
        first: { value: '' },
        last: { value: '' },
        organisation: { value: '' }
      },
      internationalAddress: { value: '' },
      country: { value: '' },
      phoneNumber: { value: '' },
      emailAddress: { value: '' }
    };
  });

  describe('get path()', () => {
    it('returns path /representative-international-details', () => {
      expect(RepresentativeInternationalDetails.path).to.equal(paths.representative.representativeInternationalDetails);
    });
  });

  describe('get getCYAName()', () => {
    const NAME = 'MR,HARRY-Kane,O`Brian';
    beforeEach(() => {
      representativeInternationalDetails.fields.name.first.value = '';
      representativeInternationalDetails.fields.name.last.value = '';
    });

    beforeEach(() => {
      it('should normalise reps full name with hyphen and apostrophe', () => {
        representativeInternationalDetails.fields.name.title.value = NAME.split(',')[0];
        representativeInternationalDetails.fields.name.first.value = NAME.split(',')[1];
        representativeInternationalDetails.fields.name.last.value = NAME.split(',')[2];
        expect(representativeInternationalDetails.CYAName).to.equal('MR HARRY-Kane O`Brian');
      });
    });

    it('should return Not Provided if firstName or lastName has not been set', () => {
      expect(representativeInternationalDetails.CYAName).to.equal(userAnswer.NOT_PROVIDED);
    });

    it('should return the firstName if only the firstName has been set', () => {
      representativeInternationalDetails.fields.name.first.value = 'FirstName';
      expect(representativeInternationalDetails.CYAName).to.equal('FirstName');
    });

    it('should return the lastName if only the lastName has been set', () => {
      representativeInternationalDetails.fields.name.last.value = 'Lastname';
      expect(representativeInternationalDetails.CYAName).to.equal('Lastname');
    });

    it('should return the full name if both firstName and lastName has been set', () => {
      representativeInternationalDetails.fields.name.first.value = 'FirstName';
      representativeInternationalDetails.fields.name.last.value = 'LastName';
      expect(representativeInternationalDetails.CYAName).to.equal('FirstName LastName');
    });

    it('should return the full name without whitespace before or after the name', () => {
      representativeInternationalDetails.fields.name.first.value = '    FirstName';
      representativeInternationalDetails.fields.name.last.value = 'LastName    ';
      expect(representativeInternationalDetails.CYAName).to.equal('FirstName LastName');
    });

    it('should return the first name without whitespace before or after the name', () => {
      representativeInternationalDetails.fields.name.first.value = ' Firstname ';
      expect(representativeInternationalDetails.CYAName).to.equal('Firstname');
    });

    it('should return the last name without whitespace before or after the name', () => {
      representativeInternationalDetails.fields.name.last.value = '  LastName ';
      expect(representativeInternationalDetails.CYAName).to.equal('LastName');
    });
  });

  describe('get getCountries()', () => {
    it('should return the countryList', () => {
      expect(representativeInternationalDetails.getCountries).to.equal(countriesList);
    });
  });

  describe('get CYAOrganisation()', () => {
    it('should return Not Provided if there is no organisation value', () => {
      expect(representativeInternationalDetails.CYAOrganisation).to.equal(userAnswer.NOT_PROVIDED);
    });

    it('should return the organisation if an organisation value has been set', () => {
      representativeInternationalDetails.fields.name.organisation.value = 'Organisation';
      expect(representativeInternationalDetails.CYAOrganisation).to.equal(representativeInternationalDetails.fields.name.organisation.value);
    });
  });

  describe('get CYAPhoneNumber()', () => {
    it('should return Not Provided if there is no phoneNumber value', () => {
      expect(representativeInternationalDetails.CYAPhoneNumber).to.equal(userAnswer.NOT_PROVIDED);
    });

    it('should return the phone number if a phoneNumber value has been set', () => {
      representativeInternationalDetails.fields.phoneNumber.value = '0800109756';
      expect(representativeInternationalDetails.CYAPhoneNumber).to.equal(representativeInternationalDetails.fields.phoneNumber.value);
    });
  });

  describe('get CYAEmailAddress()', () => {
    it('should return Not Provided if there is no email value', () => {
      expect(representativeInternationalDetails.CYAEmailAddress).to.equal(userAnswer.NOT_PROVIDED);
    });

    it('should return the email address if an emailaddress value has been set', () => {
      representativeInternationalDetails.fields.emailAddress.value = 'myemailaddress@sscs.com';
      expect(representativeInternationalDetails.CYAEmailAddress).to.equal(representativeInternationalDetails.fields.emailAddress.value);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    beforeEach(() => {
      fields = representativeInternationalDetails.form.fields;
    });

    it('should contain dynamic fields', () => {
      expect(Object.keys(fields).length).to.equal(5);
      expect(fields).to.have.all.keys(
        'name',
        'country',
        'internationalAddress',
        'emailAddress',
        'phoneNumber'
      );
    });

    describe('name field', () => {
      beforeEach(() => {
        field = fields.name;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
        expect(field.validations.length).to.eq(7);
      });
    });

    describe('country field', () => {
      beforeEach(() => {
        field = fields.country;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations.length).to.eq(2);
      });

      it('validates all valid countries', () => {
        const schema = representativeInternationalDetails.validCountrySchema();
        for (const testCountry of countriesList) {
          const result = schema.validate(decode(testCountry.value));
          expect(result.error).to.eq(null);
        }
      });

      it('rejects non valid countries', () => {
        const schema = representativeInternationalDetails.validCountrySchema();
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
        expect(field.validations.length).to.eq(1);
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
      answers = representativeInternationalDetails.answers()[0];
    });

    it('should return expected section', () => {
      expect(answers.section).to.equal('representative');
    });

    it('should return expected template', () => {
      expect(answers.template).to.equal('answer.html');
    });
  });

  describe('values()', () => {
    const repName = 'MR,HARRY,POTTER';
    it('should contain a value object with full name in caps', () => {
      representativeInternationalDetails.fields.name.title.value = repName.split(',')[0];
      representativeInternationalDetails.fields.name.first.value = repName.split(',')[1];
      representativeInternationalDetails.fields.name.last.value = repName.split(',')[2];
      representativeInternationalDetails.fields.name.organisation.value = 'Organisation';
      representativeInternationalDetails.fields.internationalAddress.value = 'First line of my address';
      representativeInternationalDetails.fields.country.value = 'Iceland';
      representativeInternationalDetails.fields.phoneNumber.value = '0800109756';
      representativeInternationalDetails.fields.emailAddress.value = 'myemailaddress@sscs.com';
      const values = representativeInternationalDetails.values();
      expect(values).to.eql({
        representative: {
          title: 'MR',
          firstName: 'HARRY',
          lastName: 'POTTER',
          organisation: 'Organisation',
          contactDetails: {
            internationalAddress: 'First line of my address',
            country: 'Iceland',
            phoneNumber: '0800109756',
            emailAddress: 'myemailaddress@sscs.com'
          }
        }
      });
    });

    it('should contain empty object', () => {
      const values = representativeInternationalDetails.values();
      expect(values).to.eql({
        representative: {
          title: '',
          firstName: '',
          lastName: '',
          organisation: '',
          contactDetails: {
            internationalAddress: '',
            country: '',
            phoneNumber: '',
            emailAddress: ''
          }
        }
      });
    });

    it('removes whitespace from before and after the phone number string', () => {
      representativeInternationalDetails.fields.phoneNumber.value = ' 0800109756 ';
      const phoneNumber = representativeInternationalDetails.values().representative.contactDetails.phoneNumber;
      expect(phoneNumber).to.not.equal(' 0800109756 ');
      expect(phoneNumber).to.equal('0800109756');
    });
  });

  describe('next()', () => {
    it('returns the next step path /reason-for-appealing', () => {
      expect(representativeInternationalDetails.next().step).to.eql(paths.reasonsForAppealing.reasonForAppealing);
    });
  });
});

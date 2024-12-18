const { expect } = require('test/util/chai');
const SmsConfirmation = require('steps/sms-notify/sms-confirmation/SmsConfirmation');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const userAnswer = require('utils/answer');

describe('SmsConfirmation.js', () => {
  let smsConfirmation = null;

  beforeEach(() => {
    smsConfirmation = new SmsConfirmation({
      journey: {
        steps: {
          Representative: paths.representative.representative
        }
      }
    });

    smsConfirmation.fields = {
      phoneNumber: {},
      appointeePhoneNumber: {},
      enterMobile: {},
      useSameNumber: {},
      internationalPhoneNumber: {},
      inMainlandUk: { value: 'yes' }
    };
  });

  describe('get path()', () => {
    it('returns path /sms-confirmation', () => {
      expect(SmsConfirmation.path).to.equal('/sms-confirmation');
    });
  });

  describe('get mobileNumber()', () => {
    it('should return enterMobile when the appellantPhoneNumber is an empty string', () => {
      smsConfirmation.fields.phoneNumber.value = '';
      smsConfirmation.fields.enterMobile.value = '07411738663';
      expect(smsConfirmation.mobileNumber).to.eq(smsConfirmation.fields.enterMobile.value);
    });

    it('should return enterMobile when the appellantPhoneNumber is not a mobile', () => {
      smsConfirmation.fields.phoneNumber.value = '01277345672';
      smsConfirmation.fields.enterMobile.value = '07411738663';
      expect(smsConfirmation.mobileNumber).to.eq(smsConfirmation.fields.enterMobile.value);
    });

    it('should return enterMobile, appellantPhoneNumber is a mobile but provides another', () => {
      smsConfirmation.fields.phoneNumber.value = '07411738765';
      smsConfirmation.fields.useSameNumber.value = userAnswer.NO;
      smsConfirmation.fields.enterMobile.value = '07411738371';
      expect(smsConfirmation.mobileNumber).to.eq(smsConfirmation.fields.enterMobile.value);
    });

    it('should return appellantPhoneNumber which is a mobile', () => {
      smsConfirmation.fields.phoneNumber.value = '07411738765';
      smsConfirmation.fields.useSameNumber.value = userAnswer.YES;
      expect(smsConfirmation.mobileNumber).to.eq(smsConfirmation.fields.phoneNumber.value);
    });

    it('should return internationalAppellantPhoneNumber inMainlandUk No when is not a mobile', () => {
      smsConfirmation.fields.inMainlandUk.value = 'no';
      smsConfirmation.fields.internationalPhoneNumber.value = '01277345672';
      smsConfirmation.fields.enterMobile.value = '07411738663';
      smsConfirmation.fields.useSameNumber.value = userAnswer.YES;
      expect(smsConfirmation.mobileNumber).to.eq(smsConfirmation.fields.enterMobile.value);
    });

    it('should return internationalAppellantPhoneNumber inMainlandUk No when which is a mobile', () => {
      smsConfirmation.fields.inMainlandUk.value = 'no';
      smsConfirmation.fields.internationalPhoneNumber.value = '07411738765';
      smsConfirmation.fields.useSameNumber.value = userAnswer.YES;
      expect(smsConfirmation.mobileNumber).to.eq(smsConfirmation.fields.internationalPhoneNumber.value);
    });
  });

  describe('get form()', () => {
    let fields = null;

    before(() => {
      fields = smsConfirmation.form.fields;
    });

    it('should contain 6 fields', () => {
      expect(Object.keys(fields).length).to.equal(6);
      expect(fields).to.have.all.keys(
        'appointeePhoneNumber',
        'enterMobile',
        'useSameNumber',
        'phoneNumber',
        'internationalPhoneNumber',
        'inMainlandUk'
      );
    });

    it('should contain a textField reference called \'enterMobile\'', () => {
      const textField = fields.enterMobile;
      expect(textField.constructor.name).to.equal('FieldDescriptor');
      expect(textField.validations).to.be.empty;
    });

    it('should contain a textField reference called \'useSameNumber\'', () => {
      const textField = fields.useSameNumber;
      expect(textField.constructor.name).to.equal('FieldDescriptor');
      expect(textField.validations).to.be.empty;
    });

    it('should contain a textField reference called \'phoneNumber\'', () => {
      const textField = fields.phoneNumber;
      expect(textField.constructor.name).to.equal('FieldDescriptor');
      expect(textField.validations).to.be.empty;
    });

    it('should contain a textField reference called \'appointeePhoneNumber\'', () => {
      const textField = fields.appointeePhoneNumber;
      expect(textField.constructor.name).to.equal('FieldDescriptor');
      expect(textField.validations).to.be.empty;
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';

    beforeEach(() => {
      smsConfirmation.content = {
        cya: {
          mobileNumber: {
            question
          }
        }
      };

      smsConfirmation.fields = {
        useSameNumber: {},
        phoneNumber: {
          value: '07411333333'
        },
        enterMobile: {
          value: '07411444444'
        },
        inMainlandUk: { value: 'yes' }
      };
    });

    it('should contain a single answer', () => {
      const answers = smsConfirmation.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.textMsgReminders);
      expect(answers[0].url).to.equal(paths.smsNotify.enterMobile);
    });

    it('should use the same number from the appellant details step', () => {
      smsConfirmation.fields.useSameNumber.value = userAnswer.YES;
      const values = smsConfirmation.values();
      expect(values).to.eql({
        smsNotify: {
          useSameNumber: true,
          smsNumber: '07411333333'
        }
      });
    });

    it('should only use the enter mobile number', () => {
      smsConfirmation.fields.useSameNumber.value = userAnswer.NO;
      const values = smsConfirmation.values();
      expect(values).to.eql({
        smsNotify: {
          useSameNumber: false,
          smsNumber: '07411444444'
        }
      });
    });
  });

  describe('next()', () => {
    it('returns the next step path /representative', () => {
      expect(smsConfirmation.next()).to
        .eql({ nextStep: paths.representative.representative });
    });
  });
});

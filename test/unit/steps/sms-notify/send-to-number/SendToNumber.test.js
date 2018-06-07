const { expect } = require('test/util/chai');
const SendToNumber = require('steps/sms-notify/send-to-number/SendToNumber');
const userAnswer = require('utils/answer');
const paths = require('paths');

describe('SendToNumber.js', () => {
  let sendToNumber = null;

  beforeEach(() => {
    sendToNumber = new SendToNumber({
      journey: {
        steps: {
          SmsConfirmation: paths.smsNotify.smsConfirmation,
          EnterMobile: paths.smsNotify.enterMobile
        }
      }
    });

    sendToNumber.fields = {
      useSameNumber: {},
      phoneNumber: {
        value: '07411785336'
      }
    };
  });

  describe('get path()', () => {
    it('returns path /send-to-number', () => {
      expect(SendToNumber.path).to.equal(paths.smsNotify.sendToNumber);
    });
  });

  describe('get phoneNumber()', () => {
    it('should be defined', () => {
      expect(sendToNumber.phoneNumber).to.eq(sendToNumber.fields.phoneNumber.value);
    });
  });

  describe('get form()', () => {
    let fields = null;

    before(() => {
      fields = sendToNumber.form.fields;
    });

    it('should contain 2 fields', () => {
      expect(Object.keys(fields).length).to.equal(2);
      expect(fields).to.have.all.keys('phoneNumber', 'useSameNumber');
    });

    it('should contain a textField reference called \'phoneNumber\'', () => {
      const textField = fields.phoneNumber;
      expect(textField.constructor.name).to.eq('FieldDescriptor');
      expect(textField.validations).to.be.empty;
    });

    it('should contain a textField called useSameNumber', () => {
      const textField = fields.useSameNumber;
      expect(textField.constructor.name).to.eq('FieldDescriptor');
      expect(textField.validations).to.not.be.empty;
    });
  });

  describe('answers()', () => {
    it('should be hidden', () => {
      expect(sendToNumber.answers().hide).to.be.true;
    });
  });

  describe('values()', () => {
    beforeEach(() => {
      sendToNumber.fields = {
        useSameNumber: {}
      };
    });

    it('should set useSameNumber to false', () => {
      sendToNumber.fields.useSameNumber.value = userAnswer.NO;
      const values = sendToNumber.values();
      expect(values).to.eql({ smsNotify: { useSameNumber: false } });
    });

    it('should set useSameNumber to true', () => {
      sendToNumber.fields.useSameNumber.value = userAnswer.YES;
      const values = sendToNumber.values();
      expect(values).to.eql({ smsNotify: { useSameNumber: true } });
    });
  });

  describe('next()', () => {
    it('returns branch object with condition property', () => {
      const branches = sendToNumber.next().branches[0];
      expect(branches).to.have.property('condition');
    });

    it('returns branch object where condition nextStep equals /sms-confirmation', () => {
      const branches = sendToNumber.next().branches[0];
      expect(branches.redirector).to.eql({ nextStep: paths.smsNotify.smsConfirmation });
    });

    it('returns fallback object where nextStep equals /enter-mobile', () => {
      const fallback = sendToNumber.next().fallback;
      expect(fallback).to.eql({ nextStep: paths.smsNotify.enterMobile });
    });
  });
});

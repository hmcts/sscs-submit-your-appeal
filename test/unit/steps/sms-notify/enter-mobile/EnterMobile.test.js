const { expect } = require('test/util/chai');
const EnterMobile = require('steps/sms-notify/enter-mobile/EnterMobile');
const paths = require('paths');

describe('EnterMobile.js', () => {
  let enterMobile = null;

  beforeEach(() => {
    enterMobile = new EnterMobile({
      journey: {
        steps: {
          SmsConfirmation: paths.smsNotify.smsConfirmation
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /enter-mobile', () => {
      expect(EnterMobile.path).to.equal(paths.smsNotify.enterMobile);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = enterMobile.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('enterMobile');
    });

    describe('enterMobile field', () => {
      beforeEach(() => {
        field = fields.enterMobile;
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
    it('should be hidden', () => {
      expect(enterMobile.answers().hide).to.be.true;
    });
  });

  describe('values()', () => {
    const value = '07411435779';

    beforeEach(() => {
      enterMobile.fields = {
        enterMobile: {
          value
        }
      };
    });

    it('should contain a value object', () => {
      const values = enterMobile.values();
      expect(values).to.eql({ smsNotify: { smsNumber: value } });
    });
  });

  describe('next()', () => {
    it('returns the next step path /sms-confirmation', () => {
      expect(enterMobile.next()).to.eql({
        nextStep: paths.smsNotify.smsConfirmation
      });
    });
  });
});

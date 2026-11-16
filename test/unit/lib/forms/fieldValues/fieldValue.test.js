const { expect, sinon } = require('test/util/chai');
const { FieldValue } = require('lib/vendor/one-per-page/src/forms/fieldValue');
const FieldError = require('lib/vendor/one-per-page/src/forms/fieldError');
const { validator } = require('lib/vendor/one-per-page/src/forms/validator');

describe('forms/fieldValue', () => {
  describe('FieldValue', () => {
    describe('#constructor', () => {
      const f = new FieldValue({ id: 'id', name: 'name', value: 'value' });

      it('stores #name', () => {
        expect(f).to.have.property('name', 'name');
      });
      it('stores #value', () => {
        expect(f).to.have.property('value', 'value');
      });
    });

    describe('#serialize', () => {
      it('returns an object representing the field', () => {
        const f = new FieldValue({ name: 'name', value: 'value' });
        expect(f.serialize()).to.eql({ name: 'value' });
      });

      it('returns {} if the field.value is undefined', () => {
        const f = new FieldValue({ name: 'name' });
        expect(f.serialize()).to.eql({});
      });
    });

    describe('#validate', () => {
      it('executes validations against the field', () => {
        const validation = sinon.stub().returns(true);
        const f = new FieldValue({
          name: 'name',
          value: 'value',
          validations: [validator('name', 'No error', validation)]
        });
        f.validate();
        expect(validation).calledWith(f);
      });

      it('stops on the first validation to fail', () => {
        const willFail = validator(
          'name', 'An error',
          sinon.stub().returns(false)
        );
        const willPass = validator(
          'name', 'No error',
          sinon.stub().returns(true)
        );
        const f = new FieldValue({
          name: 'name',
          value: 'value',
          validations: [willFail, willPass]
        });
        f.validate();
        expect(willFail.predicate).calledWith(f);
        expect(willPass.predicate).not.called;
      });
    });

    describe('#errors', () => {
      it('returns [] if the field has not been validated', () => {
        const f = new FieldValue({ name: 'name', value: 'value' });
        expect(f.errors).to.eql([]);
      });

      it('returns any errors returned by validations', () => {
        const willFail = validator('name', 'An error', () => false);
        const willPass = validator('name', 'No error', () => true);
        const f = new FieldValue({
          name: 'name',
          value: 'value',
          validations: [willFail, willPass]
        });
        f.validate();
        expect(f.errors).to.eql(['An error']);
      });
    });

    describe('#mappedErrors', () => {
      it('returns [] if the field has not been validated', () => {
        const f = new FieldValue({ name: 'name', value: 'value' });
        expect(f.mappedErrors).to.eql([]);
      });

      it('returns a FieldError for each error returned by validations', () => {
        const willFail = validator('name', 'An error', () => false);
        const willPass = validator('name', 'No error', () => true);
        const f = new FieldValue({
          name: 'name',
          value: 'value',
          validations: [willFail, willPass]
        });
        f.validate();
        expect(f.mappedErrors).to.eql([new FieldError(f, 'An error')]);
      });
    });
  });
});

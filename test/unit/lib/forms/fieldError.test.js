const { expect } = require('test/util/chai');
const FieldError = require('lib/vendor/one-per-page/src/forms/fieldError');

describe('forms/fieldError', () => {
  describe('FieldError', () => {
    describe('#constructor', () => {
      it('accepts a field and an error message', () => {
        const field = {};
        const message = 'An error';
        const error = new FieldError(field, message);
        expect(error.message).to.eql(message);
        expect(error.field).to.eql(field);
      });
    });

    describe('#id', () => {
      it('returns the fields id', () => {
        const field = { id: 'a-field' };
        const message = 'An error';
        const error = new FieldError(field, message);
        expect(error.id).to.eql(field.id);
      });
    });
  });
});

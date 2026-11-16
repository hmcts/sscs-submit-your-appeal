const { expect, sinon } = require('test/util/chai');
const { FilledForm, filledForm } = require('lib/vendor/one-per-page/src/forms/filledForm');
const FieldError = require('lib/vendor/one-per-page/src/forms/fieldError');
const { text } = require('lib/vendor/one-per-page/src/forms/fields');
const watches = require('lib/vendor/one-per-page/src/util/watches');

describe('forms/filledForm', () => {
  describe('#filledForm', () => {
    it('returns a Form', () => {
      const f = filledForm();
      expect(f).an.instanceof(FilledForm);
    });
  });

  describe('FilledForm', () => {
    it('accepts an object of FieldDescriptors', () => {
      const fields = {
        foo: text.parse('foo', { foo: 'A text value' }),
        bar: text.parse('bar', { bar: 'Another text value' })
      };
      const f = new FilledForm(fields);
      expect(f).to.have.property('fields').that.eql(fields);
    });

    describe('#store', () => {
      const fields = {
        foo: text.parse('foo', { foo: 'A text value' }),
        bar: text.parse('bar', { bar: 'Another text value' })
      };

      beforeEach(() => {
        sinon.spy(fields.foo, 'serialize');
        sinon.spy(fields.bar, 'serialize');
        sinon.spy(watches, 'traverseWatches');
      });
      afterEach(() => {
        fields.foo.serialize.restore();
        fields.bar.serialize.restore();
        watches.traverseWatches.restore();
      });

      it('throws an error if session is not initialized', () => {
        const f = new FilledForm();
        const req = {};
        const shouldThrow = () => f.store('StepName', req);

        expect(shouldThrow).to.throw('Session not initialized');
      });

      it('calls deserialize on each field descriptor', () => {
        const f = new FilledForm(fields);
        const req = { session: {} };

        f.store('StepName', req);
        expect(fields.foo.serialize).calledOnce;
        expect(fields.bar.serialize).calledOnce;
      });

      it('stores the serialized fields in the session', () => {
        const f = new FilledForm(fields);
        const req = { session: {} };

        f.store('StepName', req);

        expect(req.session).has.property('StepName');
        expect(req.session.StepName).has.property('foo', 'A text value');
        expect(req.session.StepName).has.property('bar', 'Another text value');
      });

      it('runs the watches', () => {
        const f = new FilledForm(fields);
        const req = { session: {} };

        f.store('StepName', req);

        expect(watches.traverseWatches).calledOnce;
      });
    });

    describe('#tempStore', () => {
      const fields = {
        foo: text.parse('foo', { foo: 'A text value' }),
        bar: text.parse('bar', { bar: 'Another text value' })
      };

      it('stores the serialized fields in the temp session', () => {
        const f = new FilledForm(fields);
        const req = { session: {} };

        f.tempStore('StepName', req);

        expect(req.session.temp).has.property('StepName');
        expect(req.session.temp.StepName)
          .has.property('foo', 'A text value');
        expect(req.session.temp.StepName)
          .has.property('bar', 'Another text value');
      });
    });

    describe('#validate', () => {
      const isValid = sinon.stub().returns(true);
      const isInvalid = sinon.stub().returns(false);

      it('executes the field validations', () => {
        const f = new FilledForm({
          foo: text.check('no error', isValid).parse('foo', { foo: 'A value' }),
          bar: text.check('no error', isValid).parse('bar', { bar: 'A value' })
        });
        f.validate();

        expect(isValid).calledTwice;
      });

      it('returns true if the validations pass', () => {
        const f = new FilledForm({
          foo: text.check('no error', isValid).parse('foo', { foo: 'A value' }),
          bar: text.check('no error', isValid).parse('bar', { bar: 'A value' })
        });
        expect(f.validate()).to.be.true;
      });

      it('returns false if the validations pass', () => {
        const f = new FilledForm({
          foo: text.check('an error', isInvalid).parse('foo', {}),
          bar: text.check('no error', isValid).parse('bar', { bar: 'A value' })
        });
        expect(f.validate()).to.be.false;
      });
    });

    describe('#validated', () => {
      const isValid = sinon.stub().returns(true);

      const notValidated = text
        .check('no error', isValid)
        .parse('foo', { foo: 'A value' });

      const validated = text
        .check('no error', isValid)
        .parse('foo', { foo: 'A value' });
      validated.validate();

      it('returns false no fields are validated', () => {
        const f = new FilledForm({ foo: notValidated });
        expect(f.validated).to.be.false;
      });
      it('returns true if the any validation has been run', () => {
        const f = new FilledForm({ foo: notValidated, bar: validated });
        expect(f.validated).to.be.true;
      });
    });

    describe('#errors', () => {
      const isValid = sinon.stub().returns(true);
      const isInvalid = sinon.stub().returns(false);
      const errorMessage = 'an error';
      const error = f => new FieldError(f, errorMessage);

      it('returns FieldErrors only for invalid fields', () => {
        const valid = text.check(errorMessage, isValid).parse('bar', {});
        const invalid = text.check(errorMessage, isInvalid).parse('foo', {});
        const f = new FilledForm({ foo: invalid, bar: valid });
        f.validate();

        expect(f.errors).to.eql([error(invalid)]);
      });

      it('returns [] if all fields are valid', () => {
        const valid = text.check(errorMessage, isValid).parse('bar', {});
        const f = new FilledForm({ bar: valid });
        f.validate();

        expect(f.errors).to.eql([]);
      });
    });

    describe('#valid', () => {
      const isValid = sinon.stub().returns(true);
      const isInvalid = sinon.stub().returns(false);
      const errorMessage = 'an error';

      it('returns true if all fields pass validation', () => {
        const valid = text.check(errorMessage, isValid).parse('bar', {});
        const f = new FilledForm({ bar: valid });
        f.validate();

        expect(f.valid).to.eql(true);
      });

      it('returns false if one of the fields fails validation', () => {
        const valid = text.check(errorMessage, isValid).parse('bar', {});
        const invalid = text.check(errorMessage, isInvalid).parse('foo', {});
        const f = new FilledForm({ foo: invalid, bar: valid });
        f.validate();

        expect(f.valid).to.eql(false);
      });
    });

    describe('#isFilled', () => {
      it('returns true if any field has values', () => {
        const filled = text.parse('foo', { foo: 'A Value' });
        const f = new FilledForm({ foo: filled });

        expect(f.isFilled).to.be.true;
      });

      it('returns true if filled from temp', () => {
        const notFilled = text.parse('foo', {});
        const f = new FilledForm({ foo: notFilled }, true);

        expect(f.isFilled).to.be.true;
      });

      it('returns false otherwise', () => {
        const notFilled = text.parse('foo', {});
        const f = new FilledForm({ foo: notFilled });

        expect(f.isFilled).to.be.false;
      });
    });
  });
});

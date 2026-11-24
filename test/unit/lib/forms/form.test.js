const { expect, sinon } = require('test/util/chai');
const { Form, form } = require('lib/vendor/one-per-page/src/forms/form');
const { FilledForm } = require('lib/vendor/one-per-page/src/forms/filledForm');
const { text } = require('lib/vendor/one-per-page/src/forms/fields');

describe('forms/form', () => {
  describe('#form', () => {
    it('returns a Form', () => {
      const f = form();
      expect(f).an.instanceof(Form);
    });
  });

  describe('Form', () => {
    it('accepts an object of FieldDescriptors', () => {
      const fields = { foo: text, bar: text };
      const f = new Form(fields);
      expect(f).to.have.property('fields').that.eql(fields);
    });

    describe('#parse', () => {
      const f = new Form({ foo: text });
      const req = { body: { foo: 'A text value' } };

      beforeEach(() => {
        sinon.spy(text, 'parse');
      });

      afterEach(() => {
        text.parse.restore();
      });

      it('calls field.parse on each field', () => {
        f.parse(req);
        expect(text.parse).calledOnce;
      });

      it('returns a FilledForm', () => {
        const filled = f.parse(req);
        expect(filled).an.instanceof(FilledForm);
      });

      it('parses the values from the body', () => {
        const filled = f.parse(req);
        expect(filled.fields).to.have.property('foo')
          .that.has.property('value', 'A text value');
      });
    });

    describe('#retrieve', () => {
      beforeEach(() => {
        sinon.spy(text, 'deserialize');
      });
      afterEach(() => {
        text.deserialize.restore();
      });

      it('throws if session not setup', () => {
        const f = new Form();
        const req = {};
        const shouldThrow = () => f.retrieve('stepName', req);
        expect(shouldThrow).to.throw('Session not initialized');
      });

      it('calls deserialize on each field descriptor', () => {
        const f = new Form({ foo: text });
        const req = { session: {} };

        f.retrieve('StepName', req);
        expect(text.deserialize).calledOnce;
      });

      it('returns a filled form', () => {
        const f = new Form({ foo: text });
        const req = { session: {} };

        const filled = f.retrieve('StepName', req);
        expect(filled).an.instanceof(FilledForm);
      });

      it('fetches the values from the session', () => {
        const f = new Form({ foo: text, bar: text });
        const req = {
          session: {
            StepName: {
              foo: 'A text value',
              bar: 'Another text value'
            }
          }
        };
        const filled = f.retrieve('StepName', req);

        expect(filled.fields).to.have.property('foo')
          .that.has.property('value', 'A text value');
        expect(filled.fields).to.have.property('bar')
          .that.has.property('value', 'Another text value');
      });

      it('fetches temporary values from the session', () => {
        const f = new Form({ foo: text, bar: text });
        const req = {
          session: {
            temp: {
              StepName: {
                foo: 'A temporary value',
                bar: 'Another temporary value'
              }
            }
          }
        };
        const filled = f.retrieve('StepName', req);

        expect(filled.fields)
          .to.have.property('foo')
          .that.has.property('value', 'A temporary value');
        expect(filled.fields)
          .to.have.property('bar')
          .that.has.property('value', 'Another temporary value');
      });

      it('prefers temporary values over stored session values', () => {
        const f = new Form({ foo: text });
        const req = {
          session: {
            temp: { StepName: { foo: 'A temporary value' } },
            StepName: { foo: 'A stored value' }
          }
        };
        const filled = f.retrieve('StepName', req);

        expect(filled.fields)
          .to.have.property('foo')
          .that.has.property('value', 'A temporary value');
      });
    });
  });
});

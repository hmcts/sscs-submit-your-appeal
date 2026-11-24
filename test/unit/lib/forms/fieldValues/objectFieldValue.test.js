const { expect, sinon } = require('test/util/chai');
const {
  FieldValue,
  ObjectFieldValue
} = require('lib/vendor/one-per-page/src/forms/fieldValue');
const FieldError = require('lib/vendor/one-per-page/src/forms/fieldError');
const { validator } = require('lib/vendor/one-per-page/src/forms/validator');

describe('forms/fieldValue', () => {
  describe('ObjectFieldValue', () => {
    it('maps validators to its child fields', () => {
      const day = new FieldValue({ name: 'day', value: '1' });
      const month = new FieldValue({ name: 'month', value: '12' });
      const year = new FieldValue({ name: 'year', value: '2017' });

      const dayValidator = validator('day', 'A day error', () => true);
      const monthValidator = validator('month', 'A month error', () => true);
      const yearValidator = validator('year', 'A year error', () => true);

      const f = new ObjectFieldValue({
        fields: { day, month, year },
        validations: [dayValidator, monthValidator, yearValidator]
      });

      expect(f.validations).to.eql([]);
      expect(f.day.validations).has.length(1);
      expect(f.month.validations).has.length(1);
      expect(f.year.validations).has.length(1);
    });

    describe('#validate', () => {
      it('passes the parent to any mapped validations', () => {
        const notMapped = validator('child', '', sinon.stub().returns(true));
        const child = new FieldValue({
          name: 'child',
          value: '1',
          validations: [notMapped]
        });

        const mapped = validator('child', '', sinon.stub().returns(true));

        const f = new ObjectFieldValue({
          fields: { child },
          validations: [mapped]
        });
        f.validate();
        expect(mapped.predicate).calledWith(f);
        expect(notMapped.predicate).calledWith(f.child);
      });

      it('won\'t execute the parents validators if child.validate fails', () => {
        const willFail = validator('child', '', sinon.stub().returns(false));
        const wontRun = validator('f', '', sinon.stub().returns(true));

        const child = new FieldValue({ name: 'child', value: '1' });
        const f = new ObjectFieldValue({
          name: 'f',
          fields: { child },
          validations: [wontRun, willFail]
        });
        f.validate();
        expect(f.validate()).to.be.false;
        expect(wontRun.predicate).not.called;
      });
    });

    describe('#mappedErrors', () => {
      it('includes errors from any child fields', () => {
        const willFailNotMapped = validator('child1', 'notMapped', () => false);
        const willFailMapped = validator('child2', 'mapped', () => false);


        const child1 = new FieldValue({
          name: 'child1',
          validations: [willFailNotMapped]
        });
        const child2 = new FieldValue({ name: 'child2' });

        const f = new ObjectFieldValue({
          fields: { child1, child2 },
          validations: [willFailMapped]
        });
        f.validate();
        expect(f.mappedErrors).to.eql([
          new FieldError(f.child1, 'notMapped'),
          new FieldError(f.child2, 'mapped')
        ]);
      });
    });
  });
});

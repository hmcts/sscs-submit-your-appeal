const { expect } = require('test/util/chai');
const paths = require('paths');
const PostcodeChecker = require('steps/start/postcode-checker/PostcodeChecker');

describe('PostcodeChecker.js', () => {
  let postcodeChecker = null;

  beforeEach(() => {
    postcodeChecker = new PostcodeChecker({
      journey: {
        steps: {
          Appointee: paths.identity.areYouAnAppointee,
          InvalidPostcode: paths.start.invalidPostcode
        }
      }
    });

    postcodeChecker.fields = { postcode: {} };
  });

  describe('get path()', () => {
    it('returns path /postcode-check', () => {
      expect(postcodeChecker.path).to.equal(paths.start.postcodeCheck);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = postcodeChecker.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('postcode');
    });

    describe('postcode field', () => {
      beforeEach(() => {
        field = fields.postcode;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations.length > 0).to.equal(true);
      });
    });
  });

  describe('answers()', () => {
    it('should be hidden', () => {
      expect(postcodeChecker.answers().hide).to.equal(true);
    });
  });

  describe('values()', () => {
    it('should...', () => {
      const value = 'TN32 4GT';
      postcodeChecker.fields = { postcode: { value } };
      const values = postcodeChecker.values();
      expect(values).to.eql({ postCodeCheck: value });
    });
  });

  describe('next()', () => {
    it('returns /are-you-an-appointee if postcode is on the list of acceptable postcodes', () => {
      postcodeChecker.fields.postcode.value = 'WV11 2HE';
      expect(postcodeChecker.next().step).to.eql(paths.identity.areYouAnAppointee);
    });

    it('returns /invalid-postcode if postcode is not on the list of acceptable postcodes', () => {
      postcodeChecker.fields.postcode.value = 'SW1P 4DF';
      expect(postcodeChecker.next().step).to.eql(paths.start.invalidPostcode);
    });
  });
});

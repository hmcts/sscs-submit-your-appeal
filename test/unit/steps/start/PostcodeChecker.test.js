const { expect } = require('test/util/chai');
const paths = require('paths');
const proxyquire = require('proxyquire');
const benefitTypes = require('../../../../steps/start/benefit-type/types');
const sinon = require('sinon');
const { SaveToDraftStore } = require('../../../../middleware/draftAppealStoreMiddleware');

describe('PostcodeChecker.js', () => {
  let postcodeChecker = null;
  describe('isGlasgowIncluded() check', () => {
    it('Should return false if Glasgow not in allowedRpcs', () => {
      const PostcodeChecker = proxyquire('steps/start/postcode-checker/PostcodeChecker', {
        config: {
          get: () => 'leicester, notGlasgow, belfast'
        }
      });

      postcodeChecker = new PostcodeChecker({
        journey: {
          steps: {
            Independence: paths.start.independence,
            InvalidPostcode: paths.start.invalidPostcode
          }
        }
      });

      postcodeChecker.fields = { postcode: {} };
      expect(postcodeChecker.isGlasgowIncluded).to.equal(false);
    });

    it('Should return true if Glasgow is in allowedRpcs', () => {
      const PostcodeChecker = proxyquire('steps/start/postcode-checker/PostcodeChecker', {
        config: {
          get: () => 'leicester, notGlasgow, belfast, glasgow'
        }
      });

      postcodeChecker = new PostcodeChecker({
        journey: {
          steps: {
            Independence: paths.start.independence,
            InvalidPostcode: paths.start.invalidPostcode
          }
        }
      });

      postcodeChecker.fields = { postcode: {} };
      expect(postcodeChecker.isGlasgowIncluded).to.equal(true);
    });
  });

  describe('when postcode checker disabled', () => {
    beforeEach(() => {
      const PostcodeChecker = proxyquire('steps/start/postcode-checker/PostcodeChecker', {
        config: {
          get: () => false
        }
      });

      postcodeChecker = new PostcodeChecker({
        journey: {
          steps: {
            Independence: paths.start.independence,
            InvalidPostcode: paths.start.invalidPostcode
          }
        }
      });

      postcodeChecker.fields = { postcode: {} };
    });

    afterEach(() => {
      sinon.restore();
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

    describe('handler()', () => {
      it('redirect to entry called for iba', () => {
        const superStub = sinon.stub(SaveToDraftStore.prototype, 'handler');
        const req = {
          method: 'GET',
          session: {
            BenefitType: {
              benefitType: benefitTypes.infectedBloodAppeal
            }
          }
        };
        const res = {
          redirect: sinon.spy()
        };
        const next = sinon.spy();
        postcodeChecker.handler(req, res, next);
        expect(res.redirect.called).to.eql(true);
        sinon.assert.notCalled(superStub);
      });
      it('no redirect to entry called for non iba', () => {
        const superStub = sinon.stub(SaveToDraftStore.prototype, 'handler');
        const req = {
          method: 'GET',
          session: {
            BenefitType: {
              benefitType: benefitTypes.nationalInsuranceCredits
            }
          }
        };
        const res = {
          redirect: sinon.spy()
        };
        const next = sinon.spy();
        postcodeChecker.handler(req, res, next);
        expect(res.redirect.called).to.eql(false);
        sinon.assert.calledOnce(superStub);
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
      it('returns /independence if postcode is on the list of acceptable postcodes', () => {
        postcodeChecker.fields.postcode.value = 'WV11 2HE';
        expect(postcodeChecker.next().step).to.eql(paths.start.independence);
      });

      it('returns /invalid-postcode if postcode is not on the list of acceptable postcodes', () => {
        postcodeChecker.fields.postcode.value = 'SW1P 4DF';
        expect(postcodeChecker.next().step).to.eql(paths.start.invalidPostcode);
      });
    });
  });
  describe('when postcode checker enabled', () => {
    beforeEach(() => {
      const PostcodeChecker = proxyquire('steps/start/postcode-checker/PostcodeChecker', {
        config: {
          get: () => true
        }
      });

      postcodeChecker = new PostcodeChecker({
        journey: {
          steps: {
            Independence: paths.start.independence,
            InvalidPostcode: paths.start.invalidPostcode
          }
        }
      });

      postcodeChecker.fields = { postcode: {} };
    });

    describe('next()', () => {
      it('next step is /independence', () => {
        expect(postcodeChecker.next().step).to.eql(paths.start.independence);
      });
    });
  });
});

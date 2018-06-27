const { expect } = require('test/util/chai');
const { merge } = require('lodash');
const paths = require('paths');
const proxyquire = require('proxyquire');
const HttpStatus = require('http-status-codes');

describe('BranchForEnglandOrWales.js', () => {
  describe('Is England or Wales Postcode', () => {
    const requireStub = {};
    let branchForEnglandOrWales = null;

    beforeEach(() => {
      /* eslint-disable max-len */
      const BranchForEnglandOrWales = proxyquire('steps/start/postcode-checker/BranchForEnglandOrWales', {
        superagent: requireStub
      });
      /* eslint-disable max-len */
      branchForEnglandOrWales = new BranchForEnglandOrWales('somePostcode', paths.identity.areYouAnAppointee, paths.start.invalidPostcode, paths.errors.internalServerError);
    });

    function setResponse(response) {
      merge(requireStub, {
        get: () => requireStub,
        set: () => requireStub,
        then: handleResponse => {
          handleResponse(response);
          return requireStub;
        },
        catch: () => requireStub
      });
    }

    function setCountryTo(countryName) {
      setResponse({ statusCode: HttpStatus.OK, body: { country: { name: countryName } } });
    }

    it('postcode is in England', () => {
      setCountryTo('England');

      return branchForEnglandOrWales.isEnglandOrWalesPostcode()
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(true);
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('postcode is in Wales', () => {
      setCountryTo('Wales');

      return branchForEnglandOrWales.isEnglandOrWalesPostcode()
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(true);
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('postcode is in Scotland', () => {
      setCountryTo('Scotland');

      return branchForEnglandOrWales.isEnglandOrWalesPostcode()
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(false);
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('postcode is not found', () => {
      setResponse({ responseCode: 404 });

      return branchForEnglandOrWales.isEnglandOrWalesPostcode()
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(false);
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('error getting country', () => {
      const expectedError = 'Some error';

      merge(requireStub, {
        get: () => requireStub,
        set: () => requireStub,
        then: () => requireStub,
        catch: handleError => {
          handleError(expectedError);
        }
      });

      return branchForEnglandOrWales.isEnglandOrWalesPostcode()
        .catch(error => {
          expect(error).to.equal(expectedError);
        });
    });
  });
});

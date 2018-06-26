const { expect } = require('test/util/chai');
const paths = require('paths');
const proxyquire = require('proxyquire');

describe.only('BranchForEnglandOrWales.js', () => {
  describe('Is England or Wales Postcode', () => {
    const requireStub = {};
    let branchForEnglandOrWales = null;

    beforeEach(() => {
      /* eslint-disable max-len */
      const BranchForEnglandOrWales = proxyquire('steps/start/postcode-checker/BranchForEnglandOrWales', {
        request: requireStub
      });
      /* eslint-disable max-len */
      branchForEnglandOrWales = new BranchForEnglandOrWales('somePostcode', paths.Appointee, paths.InvalidPostcode, paths.Error500);
    });

    function setCountryTo(countryName) {
      requireStub.get = (args, handleResponse) => {
        const response = JSON.stringify({ country: { name: countryName } });
        handleResponse(undefined, '', response);
      };
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

    it('error getting country', () => {
      const expectedError = 'Some error';

      requireStub.get = (args, handlreResponse) => {
        handlreResponse(expectedError);
      };

      return branchForEnglandOrWales.isEnglandOrWalesPostcode()
        .catch(error => {
          expect(error).to.equal(expectedError);
        });
    });
  });
});

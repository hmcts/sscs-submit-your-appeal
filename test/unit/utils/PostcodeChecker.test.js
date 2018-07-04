const { expect } = require('test/util/chai');
const { merge } = require('lodash');
const proxyquire = require('proxyquire');
const HttpStatus = require('http-status-codes');

describe('PostcodeChecker.js', () => {
  describe('Is England or Wales Postcode', () => {
    const requireStub = {};
    let postcodeChecker = null;

    beforeEach(() => {
      /* eslint-disable max-len */
      postcodeChecker = proxyquire('utils/postcodeChecker', {
        superagent: requireStub
      });
      /* eslint-disable max-len */
    });

    function setResponse(response) {
      merge(requireStub, {
        get: () => requireStub,
        ok: () => requireStub,
        then: handleResponse => {
          handleResponse(response);
          return requireStub;
        },
        catch: () => requireStub
      });
    }

    function setRegionalCenterTo(regionalCentre) {
      setResponse({ status: HttpStatus.OK, body: { regionalcentre: regionalCentre } });
    }

    it('postcode is in England', () => {
      setRegionalCenterTo('London');

      return postcodeChecker('CM15 8DL')
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(true);
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('postcode is in Wales', () => {
      setRegionalCenterTo('Cardiff');

      return postcodeChecker('CM15 8DL')
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(true);
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('postcode is in Scotland', () => {
      setRegionalCenterTo('Glasgow');

      return postcodeChecker('CM15 8DL')
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(false);
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('postcode starts with BT so is in Northern Island', () => {
      return postcodeChecker('BT1 2AB')
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(false);
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('allow postcode that are not found', () => {
      setResponse({ status: 404 });

      return postcodeChecker('CM15 8DL', true)
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(true);
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('do not allow postcode that are not found', () => {
      setResponse({ status: 404 });

      return postcodeChecker('CM15 8DL', false)
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

      return postcodeChecker('CM15 8DL')
        .catch(error => {
          expect(error).to.equal(expectedError);
        });
    });
  });
});

const { expect, sinon } = require('test/util/chai');
const { merge } = require('lodash');
const proxyquire = require('proxyquire');
const HttpStatus = require('http-status-codes');

describe('PostcodeChecker.js', () => {
  describe('Is England or Wales Postcode', () => {
    const requireStub = {};
    const getStub = sinon.stub();
    let postcodeChecker = null;

    beforeEach(() => {
      /* eslint-disable max-len */
      postcodeChecker = proxyquire('utils/postcodeChecker', {
        superagent: requireStub
      });
      /* eslint-disable max-len */

      getStub.returns(requireStub);
    });

    afterEach(() => {
      getStub.reset();
    });

    function setResponse(response) {
      merge(requireStub, {
        get: getStub,
        ok: () => requireStub,
        then: handleResponse => {
          handleResponse(response);
          return requireStub;
        },
        catch: () => requireStub
      });
    }

    function setRegionalCenterTo(regionalCentreValue) {
      setResponse({ status: HttpStatus.OK, body: { regionalCentre: regionalCentreValue } });
    }

    function buildExpectedUrl(outcode) {
      return `http://localhost:8080/regionalcentre/${outcode}`;
    }

    it('postcode is in England', () => {
      setRegionalCenterTo('London');

      return postcodeChecker('AB1 2CD')
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(true);
          expect(getStub).to.have.been.calledWith(buildExpectedUrl('AB1'));
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('postcode is in Wales', () => {
      setRegionalCenterTo('Cardiff');

      return postcodeChecker('AB1 2CD')
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(true);
          expect(getStub).to.have.been.calledWith(buildExpectedUrl('AB1'));
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('postcode is in Scotland', () => {
      setRegionalCenterTo('Glasgow');

      return postcodeChecker('AB1 2CD')
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(false);
          expect(getStub).to.have.been.calledWith(buildExpectedUrl('AB1'));
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('postcode starts with BT so is in Northern Island', () => {
      return postcodeChecker('BT1 2AB')
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(false);
          expect(getStub).not.to.have.been.called;
        });
    });

    it('allow postcode that are not found', () => {
      setResponse({ status: 404 });

      return postcodeChecker('AB1 2CD', true)
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(true);
          expect(getStub).to.have.been.calledWith(buildExpectedUrl('AB1'));
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('do not allow postcode that are not found', () => {
      setResponse({ status: 404 });

      return postcodeChecker('AB1 2CD', false)
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(false);
          expect(getStub).to.have.been.calledWith(buildExpectedUrl('AB1'));
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

      return postcodeChecker('AB1 2CD')
        .catch(error => {
          expect(error).to.equal(expectedError);
        });
    });
  });
});

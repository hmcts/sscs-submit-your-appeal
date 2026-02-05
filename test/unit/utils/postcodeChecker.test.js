const { expect, sinon } = require('test/util/chai');
const { merge } = require('lodash');
const proxyquire = require('proxyquire');
const HttpStatus = require('http-status-codes');

describe('PostcodeChecker.js', () => {
  const requireStub = {};
  const getStub = sinon.stub();
  const configGetStub = sinon.stub();
  const configStub = { get: configGetStub };
  let postcodeChecker = null;

  function setupPostcodeChecker(allowedRPCs) {
    configGetStub.withArgs('api.url').returns('http://localhost:8080');
    configGetStub
      .withArgs('postcodeChecker.endpoint')
      .returns('/regionalcentre');
    configGetStub.withArgs('postcodeChecker.allowedRpcs').returns(allowedRPCs);

    postcodeChecker = proxyquire('utils/postcodeChecker', {
      superagent: requireStub,
      config: configStub
    });

    getStub.returns(requireStub);
  }

  afterEach(() => {
    getStub.reset();
    configGetStub.reset();
  });

  function setResponse(response) {
    merge(requireStub, {
      get: getStub,
      retry: () => requireStub,
      ok: () => requireStub,
      then: (handleResponse) => {
        handleResponse(response);
        return requireStub;
      },
      catch: () => requireStub
    });
  }

  function setRegionalCenterTo(regionalCentreValue) {
    setResponse({
      status: HttpStatus.OK,
      body: { regionalCentre: regionalCentreValue }
    });
  }

  function buildExpectedUrl(outcode) {
    return `http://localhost:8080/regionalcentre/${outcode}`;
  }

  describe('can set allowed RPC from property', () => {
    it('matched multiple RPCs', () => {
      setupPostcodeChecker('birmingham, london');
      setRegionalCenterTo('London');

      return postcodeChecker('AB1 2CD')
        .then((isEnglandOrWalesPostcode) => {
          expect(isEnglandOrWalesPostcode).to.equal(true);
          expect(getStub).to.have.been.calledWith(buildExpectedUrl('AB1'));
        })
        .catch((error) => {
          expect.fail(error);
        });
    });

    it('matched single RPCs and case', () => {
      setupPostcodeChecker('London');
      setRegionalCenterTo('London');

      return postcodeChecker('AB1 2CD')
        .then((isEnglandOrWalesPostcode) => {
          expect(isEnglandOrWalesPostcode).to.equal(true);
          expect(getStub).to.have.been.calledWith(buildExpectedUrl('AB1'));
        })
        .catch((error) => {
          expect.fail(error);
        });
    });
  });

  describe('Is England or Wales Postcode', () => {
    beforeEach(() => {
      setupPostcodeChecker('london');
    });

    it('postcode is in England', () => {
      setRegionalCenterTo('London');

      return postcodeChecker('AB1 2CD')
        .then((isEnglandOrWalesPostcode) => {
          expect(isEnglandOrWalesPostcode).to.equal(true);
          expect(getStub).to.have.been.calledWith(buildExpectedUrl('AB1'));
        })
        .catch((error) => {
          expect.fail(error);
        });
    });

    it('postcode is in Scotland', () => {
      setRegionalCenterTo('Glasgow');

      return postcodeChecker('AB1 2CD')
        .then((isEnglandOrWalesPostcode) => {
          expect(isEnglandOrWalesPostcode).to.equal(false);
          expect(getStub).to.have.been.calledWith(buildExpectedUrl('AB1'));
        })
        .catch((error) => {
          expect.fail(error);
        });
    });

    it('postcode starts with BT so is in Northern Island', () => {
      return postcodeChecker('BT1 2AB').then((isEnglandOrWalesPostcode) => {
        expect(isEnglandOrWalesPostcode).to.equal(false);
        expect(getStub).not.to.have.been.called;
      });
    });

    it('allow postcode that are not found', () => {
      setResponse({ status: 404 });

      return postcodeChecker('AB1 2CD', true)
        .then((isEnglandOrWalesPostcode) => {
          expect(isEnglandOrWalesPostcode).to.equal(true);
          expect(getStub).to.have.been.calledWith(buildExpectedUrl('AB1'));
        })
        .catch((error) => {
          expect.fail(error);
        });
    });

    it('do not allow postcode that are not found', () => {
      setResponse({ status: 404 });

      return postcodeChecker('AB1 2CD', false)
        .then((isEnglandOrWalesPostcode) => {
          expect(isEnglandOrWalesPostcode).to.equal(false);
          expect(getStub).to.have.been.calledWith(buildExpectedUrl('AB1'));
        })
        .catch((error) => {
          expect.fail(error);
        });
    });

    it('do not blank postcodes', () => {
      return postcodeChecker('')
        .then((isEnglandOrWalesPostcode) => {
          expect(isEnglandOrWalesPostcode).to.equal(false);
          expect(getStub).not.to.have.been.called;
        })
        .catch((error) => {
          expect.fail(error);
        });
    });

    it('error getting country', () => {
      const expectedError = 'Some error';

      merge(requireStub, {
        get: () => requireStub,
        set: () => requireStub,
        retry: () => requireStub,
        then: () => requireStub,
        catch: (handleError) => {
          handleError(expectedError);
        }
      });

      return postcodeChecker('AB1 2CD').catch((error) => {
        expect(error).to.equal(expectedError);
      });
    });
  });
});

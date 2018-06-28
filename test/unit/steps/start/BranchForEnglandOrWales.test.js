const { expect } = require('test/util/chai');
const { merge } = require('lodash');
const paths = require('paths');
const proxyquire = require('proxyquire');
const HttpStatus = require('http-status-codes');
const sinon = require('sinon');

describe('BranchForEnglandOrWales.js', () => {
  describe('Is England or Wales Postcode', () => {
    const requireStub = {};
    const branchRedirectStub = sinon.stub();
    const redirectStub = sinon.stub();
    let branchForEnglandOrWales = null;

    beforeEach(() => {
      /* eslint-disable max-len */
      const BranchForEnglandOrWales = proxyquire('steps/start/postcode-checker/BranchForEnglandOrWales', {
        superagent: requireStub,
        '@hmcts/one-per-page': {
          branch: () => {
            return { redirect: branchRedirectStub };
          }
        },
        '@hmcts/one-per-page/flow': {
          redirectTo: () => {
            return { redirect: redirectStub };
          }
        }
      });
      /* eslint-disable max-len */
      branchForEnglandOrWales = new BranchForEnglandOrWales('somePostcode', paths.identity.areYouAnAppointee, paths.start.invalidPostcode, paths.errors.internalServerError);
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

      return branchForEnglandOrWales.isEnglandOrWalesPostcode()
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(true);
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('postcode is in Wales', () => {
      setRegionalCenterTo('Cardiff');

      return branchForEnglandOrWales.isEnglandOrWalesPostcode()
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(true);
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('postcode is in Scotland', () => {
      setRegionalCenterTo('Glasgow');

      return branchForEnglandOrWales.isEnglandOrWalesPostcode()
        .then(isEnglandOrWalesPostcode => {
          expect(isEnglandOrWalesPostcode).to.equal(false);
        }).catch(error => {
          expect.fail(error);
        });
    });

    it('postcode is not found', () => {
      setResponse({ status: 404 });

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

    it('next step is /are-you-an-appointee', () => {
      expect(branchForEnglandOrWales.step).to.eql(paths.identity.areYouAnAppointee);
    });

    describe('redirect', () => {
      let isEnglandOrWalesStub = null;
      beforeEach(() => {
        isEnglandOrWalesStub = sinon.stub(branchForEnglandOrWales, 'isEnglandOrWalesPostcode');

        branchRedirectStub.reset();
        redirectStub.reset();
      });

      afterEach(() => {
        isEnglandOrWalesStub.restore();
      });

      it('when postcode check returns redirect to expected pages', () => {
        isEnglandOrWalesStub.returns(new Promise(resolve => resolve(true)));

        const req = {};
        const resp = {};
        return branchForEnglandOrWales.redirect(req, resp)
          .then(() => {
            expect(branchRedirectStub).to.have.been.calledWith(req, resp);
          });
      });

      it('when postcode check errors goto error page', () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        isEnglandOrWalesStub.returns(new Promise((resolve, reject) => reject('Error')));

        const req = {};
        const resp = {};

        return branchForEnglandOrWales.redirect(req, resp)
          .then(() => {
            expect(redirectStub).to.have.been.calledWith(req, resp);
            expect(branchRedirectStub).not.to.have.been.called;
          });
      });
    });
  });
});

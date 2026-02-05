const { expect } = require('test/util/chai');
const paths = require('paths');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('BranchForEnglandOrWales.js', () => {
  describe('Is England or Wales Postcode', () => {
    const branchRedirectStub = sinon.stub();
    const redirectStub = sinon.stub();
    let branchForEnglandOrWales = null;

    beforeEach(() => {
      const BranchForEnglandOrWales = proxyquire(
        'steps/start/postcode-checker/BranchForEnglandOrWales',
        {
          'lib/vendor/one-per-page': {
            branch: () => {
              return { redirect: branchRedirectStub };
            }
          },
          'lib/vendor/one-per-page/flow': {
            redirectTo: () => {
              return { redirect: redirectStub };
            }
          }
        }
      );

      branchForEnglandOrWales = new BranchForEnglandOrWales(
        'somePostcode',
        paths.identity.areYouAnAppointee,
        paths.start.invalidPostcode,
        paths.errors.internalServerError
      );
    });

    it('next step is /are-you-an-appointee', () => {
      expect(branchForEnglandOrWales.step).to.eql(
        paths.identity.areYouAnAppointee
      );
    });

    describe('redirect', () => {
      let isEnglandOrWalesStub = null;
      beforeEach(() => {
        isEnglandOrWalesStub = sinon.stub(
          branchForEnglandOrWales,
          'isEnglandOrWalesPostcode'
        );

        branchRedirectStub.reset();
        redirectStub.reset();
      });

      afterEach(() => {
        isEnglandOrWalesStub.restore();
      });

      it('when postcode check returns redirect to expected pages', () => {
        isEnglandOrWalesStub.returns(new Promise((resolve) => resolve(true)));

        const req = {};
        const resp = {};
        return branchForEnglandOrWales.redirect(req, resp).then(() => {
          expect(branchRedirectStub).to.have.been.calledWith(req, resp);
        });
      });

      // prettier-ignore
      it('when postcode check errors goto error page', () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        isEnglandOrWalesStub.returns(new Promise((resolve, reject) => reject('Error')));

        const req = {};
        const resp = {};

        return branchForEnglandOrWales.redirect(req, resp).then(() => {
          expect(redirectStub).to.have.been.calledWith(req, resp);
          expect(branchRedirectStub).not.to.have.been.called;
        });
      });
    });
  });
});

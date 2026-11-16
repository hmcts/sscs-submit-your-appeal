const { expect, sinon } = require('test/util/chai');
const Stop = require('lib/vendor/one-per-page/src/flow/stop');

describe('flow/Stop', () => {
  describe('#redirect', () => {
    it('redirects to the given step', () => {
      const fakeStep = { path: '/foo' };
      const fakeRes = { redirect: sinon.stub() };
      new Stop(fakeStep).redirect({}, fakeRes);
      expect(fakeRes.redirect).calledOnce;
      expect(fakeRes.redirect).calledWith(fakeStep.path);
    });
  });

  describe('#step', () => {
    it('returns the nextStep', () => {
      const step = { path: '/foo' };
      const redirector = new Stop(step);
      expect(redirector.step).to.eql(step);
    });
  });
});

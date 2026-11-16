const { expect, sinon } = require('test/util/chai');
const Redirector = require('lib/vendor/one-per-page/src/flow/redirector');

describe('flow/Redirector', () => {
  describe('#if', () => {
    it('controls whether you redirect to this goTo', () => {
      const fakeStep = { path: '/foo' };
      const fakeRes = { redirect: sinon.stub() };
      new Redirector(fakeStep).if(() => false)
        .redirect({}, fakeRes);
      expect(fakeRes.redirect).to.not.be.called;
    });
  });

  describe('#redirect', () => {
    it('redirects to the given step', () => {
      const fakeStep = { path: '/foo' };
      const fakeRes = { redirect: sinon.stub() };
      new Redirector(fakeStep).redirect({}, fakeRes);
      expect(fakeRes.redirect).calledOnce;
      expect(fakeRes.redirect).calledWith(fakeStep.path);
    });
  });

  describe('#step', () => {
    it('returns the nextStep', () => {
      const step = { path: '/foo' };
      const redirector = new Redirector(step);
      expect(redirector.step).to.eql(step);
    });
  });
});

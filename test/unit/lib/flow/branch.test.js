const { expect, sinon } = require('test/util/chai');
const Branch = require('lib/vendor/one-per-page/src/flow/branch');
const Redirector = require('lib/vendor/one-per-page/src/flow/redirector');
const Conditional = require('lib/vendor/one-per-page/src/flow/conditional');

describe('flow/Branch', () => {
  describe('#constructor', () => {
    it('throws if only one branch given', () => {
      const fakeRedirector = { redirect: sinon.stub() };
      const onlyOneBranch = () => new Branch(fakeRedirector);
      expect(onlyOneBranch).to.throw('Branch needs atleast two paths');
    });

    it('throws if no branches given', () => {
      const noBranches = () => new Branch();
      expect(noBranches).to.throw('Branch needs atleast two paths');
    });

    it('throws if the last branch is a Conditional', () => {
      const fakeRedirector = { redirect: sinon.stub() };
      const conditional = new Conditional(fakeRedirector, () => true);
      const noFallback = () => new Branch(conditional, conditional);

      expect(noFallback).to.throw('The last path must not be conditional');
    });

    it('throws if the first n-1 branches are not Conditional', () => {
      const fakeRedirector = { redirect: sinon.stub() };
      const noConditionals = () => new Branch(fakeRedirector, fakeRedirector);

      expect(noConditionals)
        .to.throw('All but the last path must be conditional');
    });
  });

  describe('#redirect', () => {
    const willFail = new Conditional({ redirect: sinon.stub() }, () => false);
    const willPass = new Conditional({ redirect: sinon.stub() }, () => true);
    const fallback = new Redirector({ path: '/foo' });
    sinon.stub(fallback, 'redirect');

    beforeEach(() => {
      willFail.redirector.redirect.reset();
      willPass.redirector.redirect.reset();
      fallback.redirect.reset();
    });

    it('redirects to the first branch whose check passes', () => {
      new Branch(willPass, fallback).redirect({}, {});
      expect(willPass.redirector.redirect).calledOnce;
      expect(willFail.redirector.redirect).not.called;
      expect(fallback.redirect).not.called;
    });

    it('does not call redirect of conditionals whose checks fail', () => {
      new Branch(willFail, willPass, fallback).redirect({}, {});
      expect(willPass.redirector.redirect).calledOnce;
      expect(willFail.redirector.redirect).not.called;
      expect(fallback.redirect).not.called;
    });

    it('calls the fallback if all branches fail', () => {
      new Branch(willFail, fallback).redirect({}, {});
      expect(willFail.redirector.redirect).not.called;
      expect(fallback.redirect).calledOnce;
    });
  });

  describe('#step', () => {
    const willFail = new Conditional({ step: sinon.stub() }, () => false);
    const willPass = new Conditional({ step: sinon.stub() }, () => true);
    const fallback = new Redirector(sinon.stub());

    beforeEach(() => {
      willFail.step.reset();
      willPass.step.reset();
      fallback.step.reset();
    });

    it('returns the fallback.step if no conditionals pass', () => {
      const step = new Branch(willFail, fallback).step;
      expect(step).to.eql(fallback.step);
    });

    it('returns the step of the first conditional to pass', () => {
      const step = new Branch(willFail, willPass, fallback).step;
      expect(step).to.eql(willPass.step);
    });
  });
});

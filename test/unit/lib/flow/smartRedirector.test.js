const { expect, sinon } = require('test/util/chai');
const SmartRedirector = require('lib/vendor/one-per-page/src/flow/smartRedirector');

describe('flow/SmartRedirector', () => {
  describe('#redirect', () => {
    const fakeFlowControl = { last: sinon.stub() };
    const fakeJourney = { instance: sinon.stub() };
    const fakeStep = { path: '/foo', flowControl: fakeFlowControl };
    const fakeRes = { redirect: sinon.stub() };
    const fakeReq = { journey: fakeJourney };

    beforeEach(() => {
      fakeFlowControl.last.reset();
      fakeJourney.instance.reset();
      fakeRes.redirect.reset();
    });

    it('walks the tree to redirect to the next incomplete step', () => {
      const incompleteStep = { path: '/incomplete' };
      fakeJourney.instance.returns(fakeStep);
      fakeFlowControl.last.returns(incompleteStep);

      new SmartRedirector(fakeStep).redirect(fakeReq, fakeRes);

      expect(fakeRes.redirect).calledOnce;
      expect(fakeRes.redirect).calledWith(incompleteStep.path);
    });

    it('throws if the step doesnt have a flowControl', () => {
      const noFlowControl = { name: 'NoFlow' };
      fakeJourney.instance.returns(noFlowControl);

      const callingRedirect = () => new SmartRedirector(fakeStep)
        .redirect(fakeReq, fakeRes);

      expect(callingRedirect).to.throw(/NoFlow does not have a flowControl/);
    });
  });
});

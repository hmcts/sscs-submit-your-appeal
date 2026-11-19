const { expect, sinon } = require('test/util/chai');
const destroySession = require('lib/vendor/one-per-page/src/session/destroySession');

describe('session/destroySession', () => {
  it('calls req.session.destroy() to destroy a session', done => {
    const req = {
      session: { destroy: sinon.stub() },
      on: sinon.stub().callsArg(1)
    };
    const res = {};
    const next = () => {
      expect(req.session.destroy).calledOnce;
      done();
    };

    destroySession(req, res, next);
  });

  describe('#session', () => {
    it('throws an error if session is not initialized', () => {
      const noSessionInReq = () => destroySession({}, {}, {});
      expect(noSessionInReq).to.throw('Session not initialized');
    });
  });
});

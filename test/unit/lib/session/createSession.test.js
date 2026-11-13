const { expect, sinon } = require('test/util/chai');
const createSession = require('lib/vendor/one-per-page/src/session/createSession');

describe('session/createSession', () => {
  it('calls req.session.generate to create a session', done => {
    const req = { session: { generate: sinon.stub() } };
    const assertions = () => {
      expect(req.session.generate).calledOnce;
      done();
    };

    createSession(req, {}, assertions);
  });
});

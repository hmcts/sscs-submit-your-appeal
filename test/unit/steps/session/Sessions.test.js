const Sessions = require('steps/session/Sessions');
const { expect } = require('test/util/chai');
const { stub } = require('sinon');
const paths = require('paths');

describe('Sessions.js', () => {
  const res = stub();
  const sessions = {
    session: 'sya-session'
  };
  const req = {
    sessionStore: {
      all: stub().callsArgWith(0, null, sessions)
    }
  };
  let sessionsClass = null;
  res.send = stub();

  beforeEach(() => {
    sessionsClass = new Sessions({ journey: {} });
  });

  describe('get path()', () => {
    it('returns path /sessions', () => {
      expect(Sessions.path).to.equal(paths.session.sessions);
    });
  });

  describe('handler', () => {
    it('calls res.send()', () => {
      sessionsClass.handler(req, res);
      const sendSession = JSON.stringify(sessions, null, 2);
      res.send.should.have.been.calledWith(sendSession);
    });
  });
});

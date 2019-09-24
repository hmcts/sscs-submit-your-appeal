const { expect, sinon } = require('test/util/chai');
const SignOut = require('steps/idam/sign-out/SignOut');
const idam = require('middleware/idam');
const paths = require('paths');
const moment = require('moment');
const content = require('steps/idam/sign-out/content.en.json');

describe('SignOut.js', () => {
  describe('get path()', () => {
    let signOut = null;
    beforeEach(() => {
      signOut = new SignOut({
        journey: {
          steps: {}
        }
      });
    });
    it('returns path /exit', () => {
      expect(SignOut.path).to.equal(paths.idam.signOut);
    });

    it('clears cookies', () => {
      // mocks and spies
      const res = {
        clearCookie: (cookieName, options) => {
          return {
            name: cookieName,
            ops: options
          };
        }
      };

      const req = {
        hostname: 'hmcts.net'
      };

      const resMock = sinon.mock(res);
      resMock.expects('clearCookie').once().withArgs('__auth-token', {
        path: '/',
        domain: 'hmcts.net',
        httpOnly: true,
        secure: true
      });
      resMock.expects('clearCookie').once().withArgs('__state', {
        path: '/',
        domain: 'hmcts.net',
        httpOnly: true,
        secure: true
      });

      const next = sinon.spy();

      // method under test
      SignOut.clearCookies(req, res, next);

      // expectations and verifications
      expect(next).to.have.been.calledOnce;
      resMock.verify();
    });

    it('expects middleware', () => {
      const authenticateMock = sinon.stub(idam, 'authenticate');
      expect(signOut.middleware[0]).to.equal(authenticateMock);
    });

    it('expects get a MRN date with getMRNDate', () => {
      signOut.journey = {
        visitedSteps: [
          {
            name: 'MRNDate',
            valid: true
          }
        ],
        values: {
          mrn: {
            date: '19-07-2019'
          }
        }
      };
      const theDate = moment(signOut.journey.values.mrn.date, 'DD-MM-YYYY')
        .add('30', 'days')
        .format('DD MMMM YYYY');
      expect(signOut.getMRNDate()).to.equal(content.body.para2.replace('[mrn-date]', theDate));
    });
  });
});

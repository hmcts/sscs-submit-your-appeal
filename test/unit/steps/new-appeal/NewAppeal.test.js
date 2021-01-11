const {
  expect
} = require('test/util/chai');
const paths = require('paths');
const NewAppeal = require('steps/new-appeal/NewAppeal');
const sinon = require('sinon');

describe('NewAppeal.js', () => {
  let newAppeal = null;

  beforeEach(() => {
    newAppeal = new NewAppeal({
      journey: {
        steps: {
          BenefitType: paths.start.benefitType
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /draft-appeals', () => {
      expect(NewAppeal.path).to.equal(paths.newAppeal);
    });
  });

  describe('next()', () => {
    it('should redirect to Benefit Type', () => {
      newAppeal.req = {
        session: {}
      };
      expect(newAppeal.next()).to.eql({
        nextStep: paths.start.benefitType
      });
    });
  });

  describe('When resetJourney is called', () => {
    const saveF = sinon.spy();

    const req = {
      session: {
        cookie: 'cookie',
        entryPoint: 'entry',
        isUserSessionRestored: true,
        drafts: {
          101: {
            key: 'value'
          }
        },
        HaveAMRN: 'yes',
        AppellantName: 'my name',
        save() {
          saveF();
        }
      }
    };

    it('should call redirect to check your appeal when draft in body', () => {
      newAppeal.resetJourney(req);
      expect(req.session.entryPoint).to.eql('entry');
      expect(req.session.isUserSessionRestored).to.eql(true);
      expect(req.session.HaveAMRN).to.eql(undefined);
      expect(req.session.AppellantName).to.eql(undefined);
      expect(saveF.called).to.eql(true);
    });
  });

  describe('When handler is called', () => {
    const req = {
      session: {
        isUserSessionRestored: true,
        drafts: {
          101: {
            key: 'value'
          }
        }
      }
    };
    const redirect = sinon.spy();
    const res = {
      redirect,
      sendStatus: sinon.spy()
    };
    it('should call redirect to check your appeal when draft in body', () => {
      newAppeal.handler(req, res);
      expect(redirect.called).to.eql(false);
    });
  });
});

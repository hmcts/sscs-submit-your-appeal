const sinon = require('sinon');
const { expect } = require('test/util/chai');
const Base64 = require('js-base64').Base64;
const draftAppealStoreMiddleware = require('middleware/draftAppealStoreMiddleware');
const logger = require('logger');
const paths = require('paths');
const nock = require('nock');

// eslint-disable-next-line func-names
describe('middleware/draftAppealStoreMiddleware', () => {
  const res = {};
  const next = sinon.spy();
  let loggerSpy = '';
  let objectAssignSpy = '';
  const apiUrl = 'http://mockapi.com';

  nock(apiUrl)
    .defaultReplyHeaders({
      'Content-Type': 'application/json'
    })
    .put('/drafts')
    .reply(200);

  nock(apiUrl)
    .defaultReplyHeaders({
      'Content-Type': 'application/json'
    })
    .get('/drafts')
    .reply(200, { benefitType: true });

  beforeEach(() => {
    loggerSpy = sinon.spy(logger, 'trace');
    objectAssignSpy = sinon.spy(Object, 'assign');
    draftAppealStoreMiddleware.setFeatureFlag(true);
  });

  afterEach(() => {
    loggerSpy.resetHistory();
    next.resetHistory();
    logger.trace.restore();
    Object.assign.restore();
  });

  after(() => {
    nock.restore();
    nock.cleanAll();
  });

  describe('saveToDraftStore, no values trace call', () => {
    const req = {
      session: {
        foo: 'bar',
        cookie: '__cookie__',
        expires: '__expires__'
      },
      idam: 'test_user',
      cookies: { '__auth-token': 'xxx' }
    };

    it('should submit the draft to the API', () => {
      draftAppealStoreMiddleware.saveToDraftStore(req, res, next);
      expect(loggerSpy).to.have.been.calledOnce;
    });
  });

  describe('saveToDraftStore, no values next call', () => {
    const req = {
      session: {
        foo: 'bar',
        cookie: '__cookie__',
        expires: '__expires__'
      },
      idam: 'test_user',
      cookies: { '__auth-token': 'xxx' }
    };

    it('should submit the draft to the API', () => {
      loggerSpy.resetHistory();
      draftAppealStoreMiddleware.setFeatureFlag(true);
      draftAppealStoreMiddleware.saveToDraftStore(req, res, next);
      expect(loggerSpy).to.have.been.calledOnce;
    });
  });

  describe('saveToDraftStore api call', () => {
    const req = {
      journey: { values: { BenefitType: 'PIP' }, settings: { apiDraftUrl: `${apiUrl}/drafts` } },
      idam: 'test_user',
      cookies: { '__auth-token': 'xxx' }
    };
    it('Expected Successfully posted a draft:', async () => {
      await draftAppealStoreMiddleware.saveToDraftStore(req, res, next);
      expect(loggerSpy).to.have.been.calledTwice;
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('restoreUserState from url', () => {
    const req = {
      journey: { settings: { apiDraftUrl: '' } },
      cookies: { '__auth-token': 'xxxx' },
      idam: 'test_user',
      query: { state: Base64.encodeURI('{"foo":"bar"}') },
      session: {}
    };

    it('should not restore not logged in user session from state ', async () => {
      await draftAppealStoreMiddleware.restoreUserState(req, res, next);
      expect(objectAssignSpy).to.have.been.calledTwice;
    });
  });


  describe('restoreUserState from api', () => {
    const req = {
      journey: { values: { BenefitType: 'PIP' }, settings: { apiDraftUrl: `${apiUrl}/drafts` } },
      idam: 'test_user',
      cookies: { '__auth-token': 'xxx' },
      session: {},
      query: {}
    };

    it('Expected Successfully get a draft:', async () => {
      await draftAppealStoreMiddleware.restoreUserState(req, res, next);
      expect(objectAssignSpy).to.have.been.calledTwice;
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('restoreUserSession', () => {
    describe('RestoreFromDraftStore', () => {
      it('Expected Middleware count:', () => {
        const restoreFromDraftStore = new draftAppealStoreMiddleware.RestoreFromDraftStore({
          journey: {
            steps: {
              BenefitType: paths.start.benefitType
            }
          }
        });
        expect(restoreFromDraftStore.middleware).to.have.length(3);
      });
    });

    describe('RestoreUserState', () => {
      it('Expected Middleware count:', () => {
        const restoreUserState = new draftAppealStoreMiddleware.RestoreUserState({
          journey: {
            steps: {
              BenefitType: paths.start.benefitType
            }
          }
        });
        expect(restoreUserState.middleware).to.have.length(5);
      });
    });

    describe('SaveToDraftStore', () => {
      it('Expected Middleware count:', () => {
        const saveToDraftStore = new draftAppealStoreMiddleware.SaveToDraftStore({
          journey: {
            steps: {
              BenefitType: paths.start.benefitType
            }
          }
        });
        expect(saveToDraftStore.middleware).to.have.length(10);
      });
    });
  });

  describe('SaveToDraftStore Continue Text', () => {
    it('continueText to be Save and continue', () => {
      const saveToDraftStore = new draftAppealStoreMiddleware.SaveToDraftStore({
        journey: {
          steps: {
            BenefitType: paths.start.benefitType
          }
        }
      });
      saveToDraftStore.req.idam = true;
      expect(saveToDraftStore.continueText).to.eql('Save and continue');
    });
    it('continueText to be Save and continue', () => {
      const saveToDraftStore = new draftAppealStoreMiddleware.SaveToDraftStore({
        journey: {
          steps: {
            BenefitType: paths.start.benefitType
          }
        }
      });
      expect(saveToDraftStore.continueText).to.eql('Continue');
    });
  });

  describe('SaveToDraftStore Valid', () => {
    it('valid true', () => {
      const saveToDraftStore = new draftAppealStoreMiddleware.SaveToDraftStore({
        journey: {
          steps: {
            BenefitType: paths.start.benefitType
          },
          noValidate: true
        }
      });
      expect(saveToDraftStore.valid).to.eql(true);
    });
    it('valid false', () => {
      const saveToDraftStore = new draftAppealStoreMiddleware.SaveToDraftStore({
        journey: {
          steps: {
            BenefitType: paths.start.benefitType
          }
        }
      });
      saveToDraftStore.fields = {};
      expect(saveToDraftStore.valid).to.eql(undefined);
    });
  });
});
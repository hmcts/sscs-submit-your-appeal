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
  let loggerExceptionSpy = '';
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
    loggerExceptionSpy = sinon.spy(logger, 'exception');
    objectAssignSpy = sinon.spy(Object, 'assign');
    draftAppealStoreMiddleware.setFeatureFlag(true);
  });

  afterEach(() => {
    loggerSpy.resetHistory();
    loggerExceptionSpy.resetHistory();
    next.resetHistory();
    logger.trace.restore();
    logger.exception.restore();
    Object.assign.restore();
  });

  after(() => {
    nock.restore();
    nock.cleanAll();
  });

  describe('removeRevertInvalidSteps', () => {
    const journey = {};
    journey.visitedSteps = [{ name: 'step1', valid: true }, { name: 'step1', valid: false }];
    const callBack = sinon.spy();

    it('keep initial steps', () => {
      draftAppealStoreMiddleware.removeRevertInvalidSteps(journey, callBack);
      // eslint-disable-next-line max-len
      expect(journey.visitedSteps).to.eql([{ name: 'step1', valid: true }, { name: 'step1', valid: false }]);
    });

    it('use only valid steps', () => {
      let tempValues = [];
      draftAppealStoreMiddleware.removeRevertInvalidSteps(journey, () => {
        tempValues = [...journey.visitedSteps];
      });
      expect(tempValues).to.eql([{ name: 'step1', valid: true }]);
    });
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
      journey: {
        visitedSteps: [ { benefitType: '', valid: false } ]
      },
      idam: 'test_user',
      cookies: { '__auth-token': 'xxx' }
    };

    it('should submit the draft to the API', () => {
      draftAppealStoreMiddleware.saveToDraftStore(req, res, next);
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('saveToDraftStore api call', () => {
    const req = {
      journey: { values: { BenefitType: 'PIP' },
        visitedSteps: [ { benefitType: '', valid: true } ],
        settings: { apiDraftUrl: `${apiUrl}/drafts` } },
      idam: 'test_user',
      cookies: { '__auth-token': 'xxx' }
    };
    it('Expected Successfully posted a draft:', async() => {
      await draftAppealStoreMiddleware.saveToDraftStore(req, res, next);
      expect(loggerSpy).to.have.been.calledTwice;
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('saveToDraftStore api failed call', () => {
    const req = {
      journey: { values: { BenefitType: 'PIP' },
        visitedSteps: [ { benefitType: '', valid: true } ],
        settings: { apiDraftUrl: `${apiUrl}/` } },
      idam: 'test_user',
      cookies: { '__auth-token': 'xxx' }
    };
    it('Expected Successfully posted a draft:', async() => {
      await draftAppealStoreMiddleware.saveToDraftStore(req, res, next);
      expect(loggerExceptionSpy).to.have.been.calledOnce;
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('restoreUserState failed next call', () => {
    const req = {
      journey: { settings: { apiDraftUrl: '' } },
      cookies: { '__auth-token': 'xxxx' },
      query: { state: Base64.encodeURI('{"foo":"bar"}') },
      session: {}
    };

    it('should not restore not logged in user session from state ', async() => {
      await draftAppealStoreMiddleware.restoreUserState(req, res, next);
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

    it('should not restore not logged in user session from state ', async() => {
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

    it('Expected Successfully get a draft:', async() => {
      await draftAppealStoreMiddleware.restoreUserState(req, res, next);
      expect(objectAssignSpy).to.have.been.calledTwice;
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('Extend Class functionality tests', () => {
    class restoreFromDraftStorClass extends draftAppealStoreMiddleware.RestoreFromDraftStore {
      next() {
        sinon.spy();
      }
    }

    const restoreFromDraftStore = new restoreFromDraftStorClass({
      journey: {
        steps: {
          BenefitType: paths.start.benefitType
        }
      }
    });
    class restoreUserStateClass extends draftAppealStoreMiddleware.RestoreUserState {
      next() {
        sinon.spy();
      }
    }
    const restoreUserState = new restoreUserStateClass({
      journey: {
        steps: {
          BenefitType: paths.start.benefitType
        }
      }
    });

    class saveToDraftStoreClass extends draftAppealStoreMiddleware.SaveToDraftStore {
      next() {
        sinon.spy();
      }
    }

    const saveToDraftStore = new saveToDraftStoreClass({
      journey: {
        steps: {
          BenefitType: paths.start.benefitType
        }
      }
    });
    // eslint-disable-next-line max-len
    class saveToDraftStoreAnotherClass extends draftAppealStoreMiddleware.SaveToDraftStoreAddAnother {
      next() {
        sinon.spy();
      }
      field() {
        sinon.spy();
      }
    }

    const saveToDraftStoreAnother = new saveToDraftStoreAnotherClass({
      journey: {
        steps: {
          BenefitType: paths.start.benefitType
        }
      }
    });

    // eslint-disable-next-line max-len
    class saveToDraftStoreCYAClass extends draftAppealStoreMiddleware.SaveToDraftStoreCYA {
      next() {
        sinon.spy();
      }
      field() {
        sinon.spy();
      }
    }

    const saveToDraftStoreCYA = new saveToDraftStoreCYAClass({
      journey: {
        steps: {
          BenefitType: paths.start.benefitType
        }
      }
    });

    describe('RestoreFromDraftStore', () => {
      it('Expected Middleware count:', () => {
        expect(restoreFromDraftStore.middleware).to.have.length(3);
      });

      it('isUserLoggedIn returns true', () => {
        restoreFromDraftStore.req.idam = true;
        expect(restoreFromDraftStore.isUserLoggedIn).to.eql(true);
      });
      
      it('isUserLoggedIn returns true', () => {
        restoreFromDraftStore.req.idam = false;
        expect(restoreFromDraftStore.isUserLoggedIn).to.eql(false);
      });
    });

    describe('RestoreUserState', () => {
      it('Expected Middleware count:', () => {
        expect(restoreUserState.middleware).to.have.length(5);
      });
    });

    describe('SaveToDraftStore', () => {
      it('Expected Middleware count:', () => {
        expect(saveToDraftStore.middleware).to.have.length(10);
      });
    });

    describe('saveToDraftStoreCYA', () => {
      it('Expected Middleware count:', () => {
        expect(saveToDraftStoreCYA.middleware).to.have.length(11);

        it('isUserLoggedIn returns false', () => {
          expect(saveToDraftStoreCYA.isUserLoggedIn).to.eql(false);
        });
        it('isUserLoggedIn returns true', () => {
          saveToDraftStoreCYA.req.idam = true;
          expect(saveToDraftStoreCYA.isUserLoggedIn).to.eql(true);
        });
      });
    });

    describe('SaveToDraftStore Continue Text', () => {
      it('continueText to be Save and continue', () => {
        saveToDraftStore.req.idam = true;
        expect(saveToDraftStore.continueText).to.eql('Save and continue');
      });
      it('continueText to be Save and continue', () => {
        saveToDraftStore.req.idam = false;
        expect(saveToDraftStore.continueText).to.eql('Continue');
      });

      it('isUserLoggedIn returns false', () => {
        expect(saveToDraftStore.isUserLoggedIn).to.eql(false);
      });
      it('isUserLoggedIn returns true', () => {
        saveToDraftStore.req.idam = true;
        expect(saveToDraftStore.isUserLoggedIn).to.eql(true);
      });
    });

    describe('SaveToDraftStoreAnother Continue Text', () => {
      it('continueText to be Save and continue', () => {
        saveToDraftStoreAnother.req.idam = true;
        expect(saveToDraftStoreAnother.continueText).to.eql('Save and continue');
      });
      it('continueText to be Save and continue', () => {
        saveToDraftStoreAnother.req.idam = false;
        expect(saveToDraftStoreAnother.continueText).to.eql('Continue');
      });

      it('isUserLoggedIn returns false', () => {
        expect(saveToDraftStoreAnother.isUserLoggedIn).to.eql(false);
      });
      it('isUserLoggedIn returns true', () => {
        saveToDraftStoreAnother.req.idam = true;
        expect(saveToDraftStoreAnother.isUserLoggedIn).to.eql(true);
      });
    });
  });
});
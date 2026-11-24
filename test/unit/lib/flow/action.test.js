const Action = require('lib/vendor/one-per-page/src/flow/action');
const { expect, sinon } = require('test/util/chai');
const { Defer } = require('lib/vendor/one-per-page/src/util/promises');
const logger = require('@log4js-node/log4js-api');

describe('flow/action', () => {
  const actionStub = sinon.stub();
  const nextStub = {
    redirect: sinon.stub(),
    step: sinon.stub()
  };
  const req = {};
  const res = { send: sinon.stub() };

  beforeEach(() => {
    sinon.stub(logger, 'getLogger');
    actionStub.reset();
    nextStub.redirect.reset();
    nextStub.step.reset();
    res.send.reset();
  });

  afterEach(() => {
    logger.getLogger.restore();
  });

  describe('#then', () => {
    it('sets the actions nextFlow to the given flow', () => {
      const action = new Action(actionStub);
      expect(action.nextFlow).undefined;

      action.then(nextStub);
      expect(action.nextFlow).eql(nextStub);
    });
  });

  describe('#onFailure', () => {
    it('sets the actions errorFlow to the given flow', () => {
      const action = new Action(actionStub);
      expect(action.errorFlow).undefined;

      action.onFailure(nextStub);
      expect(action.errorFlow).eql(nextStub);
    });
  });

  describe('#redirect', () => {
    it('executes the action given to it', () => {
      const action = new Action(actionStub).then(nextStub);
      action.redirect(req, res);

      expect(actionStub).calledOnce;
      expect(actionStub).calledWith(req, res);
    });

    it('calls the next redirector in it\'s chain', () => {
      const action = new Action(actionStub).then(nextStub);
      const promise = action.redirect(req, res);
      return promise.then(() => expect(nextStub.redirect).calledOnce);
    });

    it('waits for if the action returns a promise', () => {
      const defer = new Defer();
      actionStub.returns(defer);

      const action = new Action(actionStub).then(nextStub);
      const promise = action.redirect(req, res);
      expect(nextStub.redirect).not.called;

      defer.resolve();
      return promise.then(() => expect(nextStub.redirect).calledOnce);
    });

    it('calls next with an error if no nextFlow is given', () => {
      const next = sinon.stub();
      return new Action(actionStub)
        .redirect(req, res, next)
        .then(() =>
          expect(next).calledWith(sinon.match(/No flow chained to action/))
        );
    });

    it('calls the error redirector if the action throws', () => {
      const action = new Action(actionStub)
        .onFailure(nextStub);
      actionStub.throws(new Error('I failed'));

      return action
        .redirect(req, res)
        .then(() => expect(nextStub.redirect).calledOnce);
    });
    it('calls the error redirector if the promise fails', () => {
      const action = new Action(actionStub)
        .onFailure(nextStub);
      actionStub.returns(Promise.reject(new Error('I failed')));

      return action
        .redirect(req, res)
        .then(() => expect(nextStub.redirect).calledOnce);
    });
  });
});

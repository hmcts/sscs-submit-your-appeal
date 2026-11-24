const loadStepContent = require('lib/vendor/one-per-page/src/i18n/loadStepContent');
const loadStepContentMiddleware = require('lib/vendor/one-per-page/src/middleware/loadStepContent');
const { expect, sinon } = require('test/util/chai');

describe('middleware/loadStepContent', () => {
  beforeEach(() => {
    sinon.stub(loadStepContent, 'loadStepContent');
  });

  afterEach(() => {
    loadStepContent.loadStepContent.restore();
  });

  it('calls the loadStepContent and then calls done', done => {
    loadStepContent.loadStepContent.resolves();
    const middleware = loadStepContentMiddleware();
    middleware({}, {}, () => {
      expect(loadStepContent.loadStepContent.calledOnce).to.eql(true);
      done();
    });
  });

  it('calls next with error if not able to load content', done => {
    const theError = new Error();
    loadStepContent.loadStepContent.rejects(theError);
    const middleware = loadStepContentMiddleware();
    middleware({}, {}, error => {
      expect(loadStepContent.loadStepContent.calledOnce).to.eql(true);
      expect(error).to.eql('Unable to load content Error');
      done();
    });
  });
});

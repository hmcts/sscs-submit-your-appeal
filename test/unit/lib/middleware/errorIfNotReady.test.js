const { expect } = require('test/util/chai');
const { middlewareTest } = require('test/util/middlewareTest');
const errorIfNotReady = require('lib/vendor/one-per-page/src/middleware/errorIfNotReady');

describe('middleware/errorIfNotReady', () => {
  const readyStep = {
    get name() {
      return 'ReadyStep';
    },
    ready() {
      return Promise.resolve('I\'m ready');
    }
  };
  const notReadyStep = {
    get name() {
      return 'NotReadyStep';
    },
    ready() {
      return Promise.reject(new Error('Not ready'));
    }
  };

  it('fails if the step is not ready', () => {
    const shouldFail = middlewareTest()
      .use(errorIfNotReady(notReadyStep))
      .run();
    return expect(shouldFail).to.be.rejectedWith(/NotReadyStep not ready/);
  });

  it('passes if the step is ready', () => {
    const willPass = middlewareTest()
      .use(errorIfNotReady(readyStep))
      .run();
    return expect(willPass).fulfilled;
  });
});

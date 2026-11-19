const { expect } = require('test/util/chai');
const {
  supertest,
  testApp,
  wrapWithResponseAssertions
} = require('test/util/supertest');
const { journey } = require('lib/vendor/one-per-page/src/flow');
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const Page = require('lib/vendor/one-per-page/src/steps/Page');

describe('errors/errorPages', () => {
  const defaultOptions = { session: { secret: 'foo' } };
  const options = (...overrides) => {
    const foo = Object.assign(
      {},
      defaultOptions,
      ...overrides
    );
    return foo;
  };

  const customNotFound = {
    notFound: {
      template: 'errors/error.html',
      title: 'some not found title',
      message: 'some not found message',
      nextSteps: ['1', '2', 3]
    }
  };

  const customServerError = {
    serverError: {
      template: 'errors/error.html',
      title: 'some server error title',
      message: 'some server error meessage',
      error: 'some server error'
    }
  };

  const testEndpointWithExpectedResponseAndText = (
    app, path, expectedResponse, expectedText) => {
    return wrapWithResponseAssertions(supertest(app)
      .get(path)).expect(expectedResponse)
      .html($ => {
        return expect($('body').text()).to.contain(expectedText);
      });
  };

  describe('bind', () => {
    describe('404 Not found', () => {
      describe('default page', () => {
        const app = journey(testApp(), options());

        it('should contain default header', () => {
          return testEndpointWithExpectedResponseAndText(
            app, '/some-random-page', NOT_FOUND, 'Page not found');
        });

        it('should contain default body', () => {
          return testEndpointWithExpectedResponseAndText(
            app, '/some-random-page', NOT_FOUND,
            'could be because you\'ve followed a broken or outdated link'
          );
        });

        describe('should contain default steps', () => {
          it('should include go to previous', () => {
            return testEndpointWithExpectedResponseAndText(
              app, '/some-random-page', NOT_FOUND, 'go to the previous page');
          });

          it('should include go home', () => {
            return testEndpointWithExpectedResponseAndText(
              app, '/some-random-page', NOT_FOUND, 'go home');
          });
        });
      });

      describe('custom page', () => {
        const app = journey(testApp(), options({ errorPages: customNotFound }));

        it('should contain custom header', () => {
          return testEndpointWithExpectedResponseAndText(
            app, '/some-random-page', NOT_FOUND, customNotFound.notFound.title);
        });

        it('should contain custom body', () => {
          return testEndpointWithExpectedResponseAndText(
            app, '/some-random-page',
            NOT_FOUND, customNotFound.notFound.message);
        });

        it('should contain custom steps', () => {
          return testEndpointWithExpectedResponseAndText(
            app, '/some-random-page',
            NOT_FOUND, customNotFound.notFound.nextSteps[2]);
        });
      });
    });

    describe('500 Server error', () => {
      const failurePage = class extends Page {
        get name() {
          return 'TestPage';
        }
        handler(/* req, res */) {
          throw new Error('an error occurred :(');
        }
      };

      describe('default page', () => {
        const app = journey(testApp(), options({ steps: [failurePage] }));
        it('should contain default header', () => {
          return testEndpointWithExpectedResponseAndText(
            app, failurePage.path,
            INTERNAL_SERVER_ERROR, 'Sorry, we\'re having technical problems');
        });

        it('should contain default body', () => {
          return testEndpointWithExpectedResponseAndText(
            app, failurePage.path,
            INTERNAL_SERVER_ERROR,
            [
              'Sorry, we\'re having technical problems',
              'Please try again in a few minutes.'
            ].join('\n')
          );
        });

        it('should not show error message', () => {
          return wrapWithResponseAssertions(supertest(app)
            .get(failurePage.path))
            .expect(INTERNAL_SERVER_ERROR)
            .html($ => {
              return expect($('body').text()).to.not.contain('an error occurred :(');
            });
        });
      });

      describe('custom page', () => {
        const app = journey(testApp(), options({
          steps: [failurePage],
          errorPages: customServerError
        }));

        it('should contain default header', () => {
          return testEndpointWithExpectedResponseAndText(
            app, failurePage.path,
            INTERNAL_SERVER_ERROR, customServerError.serverError.title);
        });

        it('should contain default body', () => {
          return testEndpointWithExpectedResponseAndText(
            app, failurePage.path,
            INTERNAL_SERVER_ERROR, customServerError.serverError.message);
        });

        it('should not show error message', () => {
          return wrapWithResponseAssertions(supertest(app)
            .get(failurePage.path))
            .expect(INTERNAL_SERVER_ERROR)
            .html($ => {
              return expect($('body').text()).to.not.contain('an error occurred :(');
            });
        });
      });
    });
  });
});

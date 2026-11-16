const { testStep, shouldNotSetCookie } = require('test/util/supertest');
const ExitPoint = require('lib/vendor/one-per-page/src/steps/ExitPoint');

describe('steps/ExitPoint', () => {
  const customExitPoint = class extends ExitPoint {
    get template() {
      return 'page_views/simplePage';
    }
  };

  describe('GET', () => {
    it('destroys a session and cookie is not set', () => {
      return testStep(customExitPoint)
        .get()
        .expect(200)
        .expect(shouldNotSetCookie(/session/));
    });
  });

  describe('POST', () => {
    it('returns 405 (Method not allowed)', () => {
      return testStep(customExitPoint)
        .post()
        .expect(405);
    });
  });
});

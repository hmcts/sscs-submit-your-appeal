const { expect } = require('test/util/chai');
const RequestIbcAppealForm = require('steps/policy-pages/request-ibc-appeal-form/RequestIbcAppealForm');
const paths = require('paths');

describe('RequestIbcAppealForm.js', () => {
  describe('get path()', () => {
    it('returns path /request-ibc-appeal-form', () => {
      expect(RequestIbcAppealForm.path).to.equal(paths.policy.requestIbcAppealForm);
    });
  });
});

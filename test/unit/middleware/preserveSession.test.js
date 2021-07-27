const modulePath = 'middleware/preserveSession';
const preserveSessionTest = require(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('sets session to temporary req.sess', () => {
    const next = sinon.stub();
    const req = { session: { key: 'value' } };
    preserveSessionTest(req, {}, next);
    expect(next.calledOnce).to.eql(true);
    expect(req.sess).to.eql(req.session);
  });
});
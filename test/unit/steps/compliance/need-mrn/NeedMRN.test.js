const { expect } = require('test/util/chai');
const paths = require('paths');
const NeedMRN = require('steps/compliance/need-mrn/NeedMRN');

describe('NeedMRN.js', () => {
  // TODO replace dummy content
  it('returns path /some-dummy-page-slug', () => {
    expect(NeedMRN.path).to.equal(paths.compliance.needMRN);
  });
});

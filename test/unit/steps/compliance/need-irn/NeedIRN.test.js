const { expect } = require('test/util/chai');
const paths = require('paths');
const NeedIRN = require('steps/compliance/need-irn/NeedIRN');

describe('NeedIRN.js', () => {
  it('returns path /need-an-irn', () => {
    expect(NeedIRN.path).to.equal(paths.compliance.needIRN);
  });
});

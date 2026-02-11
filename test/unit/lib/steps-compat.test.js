const { expect } = require('chai');

const vendoredSteps = require('lib/vendor/one-per-page/src/steps/index.js');
const aliased = require('lib/vendor/one-per-page');
const vendoredForms = require('lib/vendor/one-per-page/src/forms/index.js');

describe('one-per-page vendored implementation', () => {
  it('vendored steps module exports expected keys', () => {
    expect(Object.keys(vendoredSteps).sort()).to.eql(
      [
        'AddAnother',
        'BaseStep',
        'EntryPoint',
        'ExitPoint',
        'Interstitial',
        'Page',
        'Question',
        'Redirect'
      ].sort()
    );
  });

  it('aliased package exposes forms utilities', () => {
    // aliased package should include 'form' and other form utilities
    expect(aliased.form).to.exist;
    expect(Object.keys(vendoredForms)).to.include.members([
      'form',
      'text',
      'nonEmptyText'
    ]);
  });
});

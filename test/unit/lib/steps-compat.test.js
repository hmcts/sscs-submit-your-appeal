require('module-alias/register');
const { expect } = require('chai');

describe('one-per-page vendored implementation', () => {
  it('vendored steps module exports expected keys', () => {
    const vendoredSteps = require('lib/vendor/one-per-page/src/steps/index.js');

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
    const aliased = require('lib/vendor/one-per-page');
    const vendoredForms = require('lib/vendor/one-per-page/src/forms/index.js');

    // aliased package should include 'form' and other form utilities
    expect(aliased.form).to.exist;
    expect(Object.keys(vendoredForms)).to.include.members([
      'form',
      'text',
      'nonEmptyText'
    ]);
  });
});

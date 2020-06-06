const { expect } = require('test/util/chai');
const languages = require('steps/hearing/arrangements/languages');
const signLanguages = require('steps/hearing/arrangements/signLanguages');

describe('languages.js', () => {
  it('should return an array', () => {
    expect(languages).to.be.an('array');
  });
});

describe('signLanguages.js', () => {
  it('should return an array', () => {
    expect(signLanguages).to.be.an('array');
  });
});

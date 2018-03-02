const { expect } = require('test/util/chai');
const languages = require('steps/hearing/arrangements/languages');

describe('languages.js', () => {

    it('should return an array', () => {
        expect(languages).to.be.an('array');
    });

});

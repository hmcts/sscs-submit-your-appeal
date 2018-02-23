const { expect } = require('test/util/chai');
const sections = require('steps/check-your-appeal/sections');

describe('sections.js', () => {

    it('should return an object', () => {
        expect(sections).to.be.an('object');
    });

});

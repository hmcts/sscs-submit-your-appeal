const { expect } = require('test/util/chai');
const selectors = require('steps/check-your-appeal/selectors');

describe('steps.js', () => {

    it('should return an object', () => {
        expect(selectors).to.be.an('object');
    });

});

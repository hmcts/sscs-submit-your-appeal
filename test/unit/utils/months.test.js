const { expect } = require('test/util/chai');
const months = require('utils/months');

describe('months.js', () => {

    it('should return an array', () => {
        expect(months).to.be.an('array');
    });

});

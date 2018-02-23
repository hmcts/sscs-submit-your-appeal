const { expect } = require('test/util/chai');
const steps = require('steps');

describe('steps.js', () => {

    it('should return an array', () => {
        expect(steps).to.be.an('array');
    });

});

const { expect } = require('test/util/chai');
const { titleise } = require('utils/stringUtils');

describe('stringUtils.js', () => {

    describe('titleise', () => {

        it('should titleise a string from hello to Hello', () => {
            expect(titleise('hello')).to.equal('Hello');
        });

        it('should return an empty string when undefined is passed', () => {
            expect(titleise(undefined)).to.equal('');
        });

        it('should return an empty string when being passed one', () => {
            const str = '';
            expect(titleise(str)).to.equal(str);
        });

    });

});

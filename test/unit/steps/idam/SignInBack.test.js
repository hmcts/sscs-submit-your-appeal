const {
    expect
} = require('test/util/chai');
const SignInBack = require('steps/idam/sign-in-back/SignInBack');
const paths = require('paths');

describe.only('SignInBack.js', () => {
    let signInBack = null;

    beforeEach(() => {
        signInBack = new SignInBack({
            journey: {
                steps: {
                    IdamRedirect: paths.start.idamRedirect
                }
            }
        });
    });

    describe('get path()', () => {
        it('returns path /sign-in-back', () => {
            expect(signInBack.path).to.equal(paths.idam.signInBack);
        });
    });


});

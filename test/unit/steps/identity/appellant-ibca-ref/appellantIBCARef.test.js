const AppellantIBCARef = require('steps/identity/appellant-ibca-ref/AppellantIBCARef');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('AppellantIBCARef.js', () => {
    let appellantIBCARef = null;

    beforeEach(() => {
        appellantIBCARef = new AppellantIBCARef({
            journey: {
                req: { session: { Appointee: { isAppointee: 'no' } } },
                steps: {
                    AppellantContactDetails: paths.identity.enterAppellantContactDetails,
                    SameAddress: paths.appointee.sameAddress
                }
            }
        })

        appellantIBCARef.fields = {};
    });

    describe('get path()', () => {
        it('returns the path /enter-appellant-ibca-ref', () => {
            expect(AppellantIBCARef.path).to.equal(paths.identity.enterAppellantIBCARef);
        });
    });

});
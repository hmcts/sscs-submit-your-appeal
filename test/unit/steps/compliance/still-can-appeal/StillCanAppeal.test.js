const { expect } = require('test/util/chai');
const paths = require('paths');
const StillCanAppeal = require('steps/compliance/still-can-appeal/StillCanAppeal');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('StillCanAppeal', () => {
  let stillCanAppeal = null;

  beforeEach(() => {
    stillCanAppeal = new StillCanAppeal({
      journey: {
        steps: {
          Appointee: paths.identity.areYouAnAppointee
        }
      }
    });
  });

  it('get path /still-can-appeal', () => {
    expect(stillCanAppeal.path).to.equal(paths.compliance.stillCanAppeal);
  });

  it('next returns the next step path /are-you-an-appointee', () => {
    expect(stillCanAppeal.next()).to.eql({ nextStep: paths.identity.areYouAnAppointee });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      expect(stillCanAppeal.middleware).to.be.an('array');
      expect(stillCanAppeal.middleware).to.have.length(6);
      expect(stillCanAppeal.middleware).to.include(checkWelshToggle);
    });
  });
});

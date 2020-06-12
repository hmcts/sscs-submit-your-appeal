const { expect } = require('test/util/chai');
const SameAddress = require('steps/appointee/same-address/SameAddress');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('answers() and values()', () => {
  let sameAddress = null;

  beforeEach(() => {
    sameAddress = new SameAddress({
      journey: {
        steps: {}
      }
    });

    sameAddress.fields = {
      isAddressSameAsAppointee: {}
    };
  });

  it('should say Yes when value is yes', () => {
    sameAddress.fields.isAddressSameAsAppointee.value = 'yes';
    const answers = sameAddress.answers();
    expect(answers.answer).to.equal('Yes');
  });

  it('should say No when value is no', () => {
    sameAddress.fields.isAddressSameAsAppointee.value = 'no';
    const answers = sameAddress.answers();
    expect(answers.answer).to.equal('No');
  });

  it('should contain null as the value', () => {
    sameAddress.fields.isAddressSameAsAppointee.value = '';
    const values = sameAddress.values();
    expect(values).to.eql({ appellant: { isAddressSameAsAppointee: null } });
  });

  it('should contain true as the value', () => {
    sameAddress.fields.isAddressSameAsAppointee.value = 'no';
    const values = sameAddress.values();
    expect(values).to.eql({ appellant: { isAddressSameAsAppointee: false } });
  });

  it('should contain false as the value', () => {
    sameAddress.fields.isAddressSameAsAppointee.value = 'yes';
    const values = sameAddress.values();
    expect(values).to.eql({ appellant: { isAddressSameAsAppointee: true } });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      expect(sameAddress.middleware).to.be.an('array');
      expect(sameAddress.middleware).to.have.length(11);
      expect(sameAddress.middleware).to.include(checkWelshToggle);
    });
  });
});

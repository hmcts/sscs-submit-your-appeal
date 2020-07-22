const { expect } = require('test/util/chai');
const SameAddress = require('steps/appointee/same-address/SameAddress');
const i18next = require('i18next');

describe('answers() and values()', () => {
  let sameAddress = null;
  const question = 'A Question';

  beforeEach(() => {
    sameAddress = new SameAddress({
      journey: {
        steps: {}
      }
    });

    sameAddress.content = {
      cya: {
        isAddressSameAsAppointee: {
          question,
          yes: 'Yes',
          no: 'No'
        }
      }
    };

    sameAddress.fields = {
      isAddressSameAsAppointee: {}
    };
  });

  describe('English', () => {
    it('should say \'Yes\' when value is yes (English)', () => {
      sameAddress.fields.isAddressSameAsAppointee.value = 'yes';
      const answers = sameAddress.answers();
      expect(answers.answer).to.equal('Yes');
    });

    it('should say \'No\' when value is no (English)', () => {
      sameAddress.fields.isAddressSameAsAppointee.value = 'no';
      const answers = sameAddress.answers();
      expect(answers.answer).to.equal('No');
    });
  });

  describe('Welsh', () => {
    beforeEach(() => {
      i18next.changeLanguage('cy');
    });

    afterEach(() => {
      i18next.changeLanguage('en');
    });

    it('should say \'Ydy\' when value is yes (Welsh)', () => {
      sameAddress.content.cya.isAddressSameAsAppointee.yes = 'Ydy';
      sameAddress.fields.isAddressSameAsAppointee.value = 'yes';
      const answers = sameAddress.answers();
      expect(answers.answer).to.equal('Ydy');
    });

    it('should say \'Nac ydy\' when value is no (Welsh)', () => {
      sameAddress.content.cya.isAddressSameAsAppointee.no = 'Nac ydy';
      sameAddress.fields.isAddressSameAsAppointee.value = 'no';
      const answers = sameAddress.answers();
      expect(answers.answer).to.equal('Nac ydy');
    });
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
});

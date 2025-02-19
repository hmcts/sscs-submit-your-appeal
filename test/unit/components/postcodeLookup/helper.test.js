const { expect } = require('test/util/chai');
const {
  buildConcatenatedAddress,
  cleanLine
} = require('components/postcodeLookup/helper');

describe('Components/helper.js', () => {
  describe('cleanLine()', () => {
    it('cleanLine space null', () => {
      const result = cleanLine('  null space');
      expect(result).to.eq('space');
    });
    it('cleanLine null space', () => {
      const result = cleanLine('null space');
      expect(result).to.eq('space');
    });
    it('cleanLine undefined', () => {
      const result = cleanLine('undefined space');
      expect(result).to.eq('space');
    });
    it('cleanLine trim', () => {
      const result = cleanLine(' space ');
      expect(result).to.eq('space');
    });
    it('cleanLine comma', () => {
      const result = cleanLine(',space');
      expect(result).to.eq('space');
    });
  });

  describe('buildConcatenatedAddress()', () => {
    let defaultDPA = '';
    beforeEach(() => {
      defaultDPA = {
        DPA: {
          UPRN: '200206013',
          UDPRN: '15487017',
          ADDRESS: 'ROYALTY LOUNGE, 118, HIGH ROAD, LONDON, N2 9ED',
          ORGANISATION_NAME: 'ROYALTY LOUNGE',
          BUILDING_NUMBER: '118',
          THOROUGHFARE_NAME: 'HIGH ROAD',
          POST_TOWN: 'LONDON',
          POSTCODE: 'N2 9ED'
        }
      };
    });

    it('ORGANISATION_NAME && ORGANISATION_NAME', () => {
      expect(buildConcatenatedAddress(defaultDPA)).to.eql({
        line1: 'ROYALTY LOUNGE',
        line2: '118 , HIGH ROAD',
        town: 'LONDON',
        county: 'LONDON',
        postCode: 'N2 9ED'
      });
    });

    it('BUILDING_NUMBER && SUB_BUILDING_NAME', () => {
      defaultDPA.DPA.BUILDING_NUMBER = 12;
      defaultDPA.DPA.SUB_BUILDING_NAME = 'sub name';
      expect(buildConcatenatedAddress(defaultDPA)).to.eql({
        line1: 'ROYALTY LOUNGE',
        line2: '12 sub name , HIGH ROAD',
        town: 'LONDON',
        county: 'LONDON',
        postCode: 'N2 9ED'
      });
    });

    it('BUILDING_NUMBER && SUB_BUILDING_NAME && BUILDING_NAME', () => {
      defaultDPA.DPA.BUILDING_NUMBER = 12;
      defaultDPA.DPA.SUB_BUILDING_NAME = 'sub name';
      defaultDPA.DPA.BUILDING_NAME = 'building name';
      expect(buildConcatenatedAddress(defaultDPA)).to.eql({
        line1: 'ROYALTY LOUNGE',
        line2: '12 sub name building name, HIGH ROAD',
        town: 'LONDON',
        county: 'LONDON',
        postCode: 'N2 9ED'
      });
    });

    it('PO_BOX_NUMBER', () => {
      defaultDPA.DPA.PO_BOX_NUMBER = 12;
      defaultDPA.DPA.ORGANISATION_NAME = 'undefined';
      expect(buildConcatenatedAddress(defaultDPA)).to.eql({
        line1: '12, 118',
        line2: 'HIGH ROAD',
        town: 'LONDON',
        county: 'LONDON',
        postCode: 'N2 9ED'
      });
    });

    it('BUILDING_NAME && THOROUGHFARE_NAME && !BUILDING_NUMBER', () => {
      defaultDPA.DPA.BUILDING_NAME = 'BUILDING_NAME';
      defaultDPA.DPA.BUILDING_NUMBER = 'undefined';
      defaultDPA.DPA.ORGANISATION_NAME = 'undefined';
      expect(buildConcatenatedAddress(defaultDPA)).to.eql({
        line1: 'BUILDING_NAME',
        line2: 'HIGH ROAD',
        town: 'LONDON',
        county: 'LONDON',
        postCode: 'N2 9ED'
      });
    });

    it('BUILDING_NAME && THOROUGHFARE_NAME && !BUILDING_NUMBER', () => {
      defaultDPA.DPA.BUILDING_NAME = 'BUILDING_NAME';
      defaultDPA.DPA.BUILDING_NUMBER = 'BUILDING_NUMBER';
      defaultDPA.DPA.ORGANISATION_NAME = 'undefined';
      expect(buildConcatenatedAddress(defaultDPA)).to.eql({
        line1: 'BUILDING_NUMBER, BUILDING_NAME',
        line2: 'HIGH ROAD',
        town: 'LONDON',
        county: 'LONDON',
        postCode: 'N2 9ED'
      });
    });
  });
});

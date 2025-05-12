

const NoRepresentativeDetails = require('steps/representative/no-representative-details/NoRepresentativeDetails');
const { expect } = require('test/util/chai');
const paths = require('paths');

describe('NoRepresentativeDetails.js', () => {
  let noRepresentativeDetails = null;

  beforeEach(() => {
    noRepresentativeDetails = new NoRepresentativeDetails({
      journey: {
        steps: {
          ReasonForAppealing: paths.reasonsForAppealing.reasonForAppealing
        }
      }
    });

    noRepresentativeDetails.fields = {
      otherReasonForAppealing: {}
    };
  });

  describe('get path()', () => {
    it('returns path /no-representative-details', () => {
      expect(noRepresentativeDetails.path).to.equal(
        paths.representative.noRepresentativeDetails
      );
    });
  });

  describe('get form()', () => {
    let fields = null;

    before(() => {
      fields = noRepresentativeDetails.form.fields;
    });

    it('should contain 0 fields', () => {
      expect(Object.keys(fields).length).to.equal(0);
    });
  });

  describe('answers()', () => {
    it('should be hidden', () => {
      const answers = noRepresentativeDetails.answers();
      expect(answers.hide).to.equal(true);
    });
  });

  describe('values()', () => {
    it('should contain a value object', () => {
      const values = noRepresentativeDetails.values();
      expect(values).to.eql({ representative: { hasRepresentative: false } });
    });
  });

  describe('next()', () => {
    it('returns the next step path /sending-evidence', () => {
      const nextStep = noRepresentativeDetails.next().step;
      expect(nextStep).to.eq(paths.reasonsForAppealing.reasonForAppealing);
    });
  });
});

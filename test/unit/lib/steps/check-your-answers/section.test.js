const { expect } = require('test/util/chai');
const {
  section,
  Section
} = require('lib/vendor/one-per-page/src/steps/check-your-answers/section');
const { answer } = require('lib/vendor/one-per-page/src/steps/check-your-answers/answer');

const completeAnswer = answer({ fields: { valid: true, url: '/good' } });
const incompleteAnswer = answer({ fields: { valid: false, url: '/bad' } });

describe('steps/check-your-answers/section', () => {
  it('returns a Section', () => {
    expect(section('foo')).to.be.an.instanceof(Section);
  });

  describe('#filterAnswers', () => {
    const s = section('foo');
    const fooAnswer = answer({}, { section: 'foo' });
    const barAnswer = answer({}, { section: 'bar' });

    it('sets this.answers to answers with the correct section id', () => {
      s.answers = [];
      s.filterAnswers([ fooAnswer ]);
      expect(s.answers).to.eql([fooAnswer]);
    });

    it('filters out answers that are declared for other sections', () => {
      s.answers = [];
      s.filterAnswers([ barAnswer ]);
      expect(s.answers).to.eql([]);
    });
  });

  describe('#completedAnswers', () => {
    const s = section('foo');

    it('returns an array of completed answers', () => {
      s.answers = [completeAnswer, incompleteAnswer];
      expect(s.completedAnswers).to.eql([completeAnswer]);
    });

    it('returns [] if no answer complete', () => {
      s.answers = [incompleteAnswer];
      expect(s.completedAnswers).to.eql([]);
    });
  });

  describe('#incomplete', () => {
    const s = section('foo');

    it('returns true if any answers aren\'t complete', () => {
      s.answers = [incompleteAnswer];
      expect(s.incomplete).to.be.true;
    });

    it('returns false if all answers are complete', () => {
      s.answers = [completeAnswer];
      expect(s.incomplete).to.be.false;
    });

    it('returns false if no answers', () => {
      s.answers = [];
      expect(s.incomplete).to.be.false;
    });
  });

  describe('#atLeast1Completed', () => {
    const s = section('foo');

    it('returns true if 1 answer is complete', () => {
      s.answers = [completeAnswer, incompleteAnswer];
      expect(s.atLeast1Completed).to.be.true;
    });

    it('returns false if all answers aren\'t complete', () => {
      s.answers = [incompleteAnswer];
      expect(s.atLeast1Completed).to.be.false;
    });

    it('returns false if no answers', () => {
      s.answers = [];
      expect(s.atLeast1Completed).to.be.false;
    });
  });

  describe('#continueUrl', () => {
    const s = section('foo');

    it('returns the url of the first incomplete step', () => {
      const otherIncomplete = answer({}, { url: '/foo' });
      s.answers = [incompleteAnswer, otherIncomplete];
      expect(s.continueUrl).to.eql(incompleteAnswer.url);

      s.answers = [otherIncomplete, incompleteAnswer];
      expect(s.continueUrl).to.eql(otherIncomplete.url);
    });

    it('returns "" if no answer is incomplete', () => {
      s.answers = [completeAnswer];
      expect(s.continueUrl).to.eql('');
    });

    it('returns "" if no answers given', () => {
      s.answers = [];
      expect(s.continueUrl).to.eql('');
    });
  });
});

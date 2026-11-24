const { expect } = require('test/util/chai');
const Question = require('lib/vendor/one-per-page/src/steps/Question');
const {
  form,
  text
} = require('lib/vendor/one-per-page/src/forms');
const { goTo } = require('lib/vendor/one-per-page/src/flow');
const { traverseWatches } = require('lib/vendor/one-per-page/src/util/watches');

describe('util/watches', () => {
  const SimpleQuestion = class extends Question {
    get form() {
      return form({ name: text });
    }

    get template() {
      return 'question_views/simpleQuestion';
    }

    next() {
      return goTo({ path: '/next-step' });
    }
  };

  const SimpleQuestion2 = class extends Question {
    get watches() {
      return {
        'SimpleQuestion.name': (previousValue, currentValue, remove) => {
          remove('SimpleQuestion2.name');
        }
      };
    }

    get form() {
      return form({ name: text });
    }

    get template() {
      return 'question_views/simpleQuestion';
    }

    next() {
      return goTo({ path: '/next-step' });
    }
  };

  const SimpleQuestion3 = class extends Question {
    get watches() {
      return {
        'SimpleQuestion2.name': (previousValue, currentValue, remove) => {
          remove('SimpleQuestion3.name');
        }
      };
    }

    get form() {
      return form({ name: text });
    }

    get template() {
      return 'question_views/simpleQuestion';
    }

    next() {
      return goTo({ path: '/next-step' });
    }
  };

  it('triggers watch and removes data from session', () => {
    const journey = {
      steps: [SimpleQuestion, SimpleQuestion2, SimpleQuestion3],
      instance: Step => new Step({ journey })
    };

    const previousSession = {
      'SimpleQuestion.name': 'simple question name',
      'SimpleQuestion2.name': 'simple question two name',
      'SimpleQuestion3.name': 'simple question three name'
    };

    const session = {
      'SimpleQuestion.name': 'simple question name change',
      'SimpleQuestion2.name': 'simple question two name',
      'SimpleQuestion3.name': 'simple question three name'
    };

    traverseWatches(journey, previousSession, session);

    expect(Object.prototype.hasOwnProperty.call(session, 'SimpleQuestion2.name'))
      .to
      .eql(false);
    expect(Object.prototype.hasOwnProperty.call(session, 'SimpleQuestion3.name'))
      .to
      .eql(false);
  });
});

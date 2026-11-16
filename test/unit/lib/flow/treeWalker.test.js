const {
  expect,
  sinon
} = require('test/util/chai');
const Question = require('lib/vendor/one-per-page/src/steps/Question');
const BaseStep = require('lib/vendor/one-per-page/src/steps/BaseStep');
const Redirect = require('lib/vendor/one-per-page/src/steps/Redirect');
const {
  stopHere,
  ifCompleteThenContinue,
  continueToNext,
  validateThenStopHere,
  stopHereIfNextIsInvalid
} = require('lib/vendor/one-per-page/src/flow');
const {
  form,
  text
} = require('lib/vendor/one-per-page/src/forms');
const { goTo } = require('lib/vendor/one-per-page/src/flow');
const RequestBoundJourney = require('lib/vendor/one-per-page/src/flow/RequestBoundJourney');
const callsites = require('callsites');
const Joi = require('joi');

const Step = class extends BaseStep {
  handler() { /* intentionally empty */
  }
};

describe('flow/flowControl', () => {
  describe('TreeWalker', () => {
    {
      const A = class extends Question {
        get form() {
          return form({ a: text });
        }

        get flowControl() {
          return ifCompleteThenContinue(this);
        }

        next() {
          return goTo(this.journey.steps.B);
        }
      };
      const B = class extends Question {
        get form() {
          return form({ b: text });
        }

        get flowControl() {
          return ifCompleteThenContinue(this);
        }

        next() {
          return goTo(this.journey.steps.C);
        }
      };
      const C = class extends Step {
        get flowControl() {
          return stopHere(this);
        }
      };
      const steps = {
        A,
        B,
        C
      };
      const req = {
        session: {
          A: { a: 'Step A' },
          B: { b: 'Step B' }
        }
      };
      const res = {};

      it('#walk returns an array of the steps', () => {
        const journey = new RequestBoundJourney(req, res, steps, {});
        const a = journey.instance(A);

        const results = a.flowControl.walk();
        expect(results)
          .to
          .eql([a, journey.instance(B), journey.instance(C)]);
      });

      it('#map returns the result of the block you give it', () => {
        const journey = new RequestBoundJourney(req, res, steps, {});
        const a = journey.instance(A);

        const names = a.flowControl.map(step => step.name);
        expect(names)
          .to
          .eql(['A', 'B', 'C']);
      });
    }

    {
      const A = class extends Question {
        get form() {
          return form({ a: text });
        }

        get flowControl() {
          return ifCompleteThenContinue(this);
        }

        next() {
          return goTo(this.journey.steps.B);
        }
      };
      const B = class extends Question {
        get form() {
          return form({ b: text });
        }

        get flowControl() {
          return ifCompleteThenContinue(this);
        }

        next() {
          return goTo(this.journey.steps.C);
        }
      };
      const C = class extends Question {
        get form() {
          return form({ c: text });
        }

        get flowControl() {
          return ifCompleteThenContinue(this);
        }

        next() {
          return goTo(this.journey.steps.A);
        }
      };
      const steps = {
        A,
        B,
        C
      };
      const req = {
        session: {
          A: { a: 'Step A' },
          B: { b: 'Step B' },
          C: { c: 'Step C' }
        }
      };
      const res = {};

      it('protects against infinite loops', () => {
        const journey = new RequestBoundJourney(req, res, steps, {});
        const a = journey.instance(A);

        const looseLoop = () => a.flowControl.walk();
        expect(looseLoop)
          .to
          .throw(/possible infinite loop/);
      });
    }

    {
      const maxCallStack = 100;
      const steps = [];
      const req = {
        session: { LoopingStep: { a: 'Val from session' } },
        journey: {
          steps,
          instance(stepNo) {
            return steps[stepNo];
          }
        }
      };
      const res = {};

      class LoopingStep extends Question {
        get form() {
          return form({ a: text });
        }

        get flowControl() {
          return ifCompleteThenContinue(this);
        }

        next() {
          return goTo(this.nextNo);
        }
      }

      steps[0] = new LoopingStep(req, res);
      steps[0].nextNo = 1;

      for (let i = 1; i < maxCallStack; i++) {
        steps[i] = new LoopingStep(req, res);
        steps[i].nextNo = i + 1;
      }
      steps[maxCallStack] = new class extends Question {
        get flowControl() {
          return stopHere(this);
        }
      }(req, res);

      it('reuses stack frames to prevent stack overflow', () => {
        const currentStackSize = callsites().length;
        const stackSizes = steps[0].flowControl
          .map(() => callsites().length)
          .map(realSize => realSize - currentStackSize);
        expect(stackSizes)
          .to
          .satisfy(
            sizes => sizes.every(size => size === stackSizes[0]),
            'call stack size to remain constant'
          );
      });
    }
  });

  {
    const session = { TestStep: { a: 'A value' } };
    const nextStep = { flowControl: stopHere() };
    const req = {
      session,
      journey: {
        instance() {
          return nextStep;
        }
      }
    };
    const res = {};

    describe('#stopHere', () => {
      const step = {};
      const s = stopHere(step);
      const block = sinon.stub()
        .returns(step);

      const results = s.iterate(block, []);

      it('ends the walking and returns the results', () => {
        expect(results)
          .to
          .eql([step]);
      });

      it('executes the given block', () => {
        expect(block)
          .to
          .be
          .calledWith(step);
      });
    });

    describe('#ifCompleteThenContinue', () => {
      const step = new class TestStep extends Question {
        get form() {
          return form({
            a: text.joi('required', Joi.string()
              .required())
          });
        }

        get flowControl() {
          return validateThenStopHere(this);
        }

        next() {
          return { step: '' };
        }
      }(req, res);

      const block = sinon.stub()
        .returns(step);
      const result = step.flowControl.iterate(block, []);

      it('validates the step', () => {
        expect(step.fields.validated).to.be.true;
      });

      it('executes the given block with the step', () => {
        expect(block)
          .calledWith(step);
      });

      it('returns the results', () => {
        expect(result)
          .to
          .eql([step]);
      });
    });

    describe('#ifCompleteThenContinue', () => {
      const step = new class TestStep extends Question {
        get form() {
          return form({
            a: text.joi('required', Joi.string()
              .required())
          });
        }

        get flowControl() {
          return ifCompleteThenContinue(this);
        }

        next() {
          return { step: '' };
        }
      }(req, res);

      const block = sinon.stub()
        .returns(step);
      const result = step.flowControl.iterate(block, []);

      it('returns the next TreeWalker if valid', () => {
        expect(result)
          .to
          .eql(nextStep.flowControl);
      });

      it('executes the given block with the step', () => {
        expect(block)
          .calledWith(step);
      });

      it('returns the results if not valid', () => {
        session.TestStep = {};
        const _results = step.flowControl.iterate(block, []);
        expect(_results)
          .to
          .eql([step]);
      });
    });

    describe('#continueToNext', () => {
      const step = new class TestStep extends Redirect {
        get flowControl() {
          return continueToNext(this);
        }

        next() {
          return { step: '' };
        }
      }(req, res);

      const block = sinon.stub()
        .returns(step);
      const result = step.flowControl.iterate(block, []);

      it('returns the next TreeWalker', () => {
        expect(result)
          .to
          .eql(nextStep.flowControl);
      });
    });
  }

  describe('#stopHereIfNextIsInvalid', () => {
    const nextStep = { flowControl: { iterate: sinon.stub() } };
    const req = {
      journey: {
        instance() {
          return nextStep;
        }
      }
    };
    const res = {};

    const step = new class TestStep extends Redirect {
      get flowControl() {
        return stopHereIfNextIsInvalid(this);
      }

      next() {
        return { step: '' };
      }
    }(req, res);
    const block = s => s;

    beforeEach(() => {
      nextStep.flowControl.iterate.reset();
    });

    it('iterates the next steps treewalker', () => {
      nextStep.flowControl.iterate.returns([]);
      step.flowControl.iterate(block, []);
      expect(nextStep.flowControl.iterate)
        .calledWith(block, []);
    });

    it('continues the chain if the next step returns a treewalker', () => {
      const expectedFlowControl = stopHere(nextStep);
      nextStep.flowControl.iterate.returns(expectedFlowControl);
      const returnedTreeWalker = step.flowControl.iterate(block, []);
      expect(returnedTreeWalker)
        .to
        .eql(expectedFlowControl);
    });

    it('returns results up to it if the next steps returns results', () => {
      nextStep.flowControl.iterate.returns([nextStep]);
      const visitedSteps = step.flowControl.iterate(block, []);
      expect(visitedSteps)
        .to
        .eql([step]);
    });

    it('throws if the next steps flowControl returns something mental', () => {
      nextStep.flowControl.iterate.returns('A string');
      const willThrow = () => step.flowControl.iterate(block, []);
      expect(willThrow)
        .to
        .throw(/Expected results or TreeWalker/);
    });
  });
});

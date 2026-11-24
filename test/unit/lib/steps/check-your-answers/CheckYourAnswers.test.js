const { expect, sinon } = require('test/util/chai');
const CheckYourAnswers = require('lib/vendor/one-per-page/src/steps/check-your-answers/CheckYourAnswers');
const { answer } = require('lib/vendor/one-per-page/src/steps/check-your-answers/answer');
const { section } = require('lib/vendor/one-per-page/src/steps/check-your-answers/section');
const { form, text } = require('lib/vendor/one-per-page/src/forms');
const { goTo } = require('lib/vendor/one-per-page/src/flow');
const { testStep } = require('test/util/supertest');
const Question = require('lib/vendor/one-per-page/src/steps/Question');
const path = require('path');

describe('steps/CheckYourAnswers', () => {
  it('defines a default #path', () => {
    const req = { journey: {} };
    const res = {};
    expect((new CheckYourAnswers(req, res)).path).to.eql('/check-your-answers');
  });

  describe('GET', () => {
    {
      const Name = class extends Question {
        get form() {
          return form({ firstName: text, lastName: text });
        }
        next() {
          return goTo(this.journey.steps.TemplatedAnswer);
        }
      };
      const TemplatedAnswer = class extends Question {
        answers() {
          return answer(this, { template: 'fixtures/templated.answer.html' });
        }
        next() {
          return goTo(this.journey.steps.Gender);
        }
      };
      const Gender = class extends Question {
        get form() {
          return form({ gender: text });
        }
        answers() {
          return answer(this, { question: 'Your gender' });
        }
        next() {
          return goTo(this.journey.steps.CheckYourAnswers);
        }
      };
      const steps = { Name, Gender, CheckYourAnswers, TemplatedAnswer };
      const session = {
        entryPoint: Name.name,
        Name: { firstName: 'Michael', lastName: 'Allen' },
        Gender: { gender: 'Male' }
      };


      it('renders an answer for each answered question in the journey', () => {
        return testStep(CheckYourAnswers)
          .withSession(session)
          .withSetup(req => {
            req.journey.steps = steps;
          })
          .withViews(path.join(__dirname, './fixtures'))
          .get()
          .html($ => Promise.all([
            expect($('#Name .question').text()).to.contain('Name'),
            expect($('#Name .answer').text()).to.contain('Michael Allen'),
            expect($('#TemplatedAnswer .html').text()).to.contain('Rendered template'),
            expect($('#Gender .question').text()).to.contain('Your gender'),
            expect($('#Gender .answer').text()).to.contain('Male')
          ]));
      });

      it('requires that a session exists', () => {
        return testStep(CheckYourAnswers)
          .get()
          .expect(302)
          .expect('Location', '/');
      });
    }


    it('responds with 500 if an answer fails to render', () => {
      const TemplateFails = class extends Question {
        answers() {
          return {
            render() {
              return Promise.reject(new Error('Failed to render'));
            }
          };
        }
        next() {
          return goTo(this.journey.steps.CheckYourAnswers);
        }
      };

      const steps = { TemplateFails, CheckYourAnswers };
      const session = { entryPoint: TemplateFails.name };

      return testStep(CheckYourAnswers)
        .withSession(session)
        .withSetup(req => {
          req.journey.steps = steps;
        })
        .get()
        .expect(500);
    });

    it('sections answers', () => {
      const NoSection = class extends Question {
        answers() {
          return answer(this, { answer: 'Default Answer' });
        }
        next() {
          return goTo(this.journey.steps.Sectioned);
        }
      };
      const Sectioned = class extends Question {
        answers() {
          return answer(this, {
            answer: 'Sectioned Answer',
            section: 'a'
          });
        }
        next() {
          return goTo(this.journey.steps.MultiSectioned);
        }
      };
      const MultiSectioned = class extends Question {
        answers() {
          return [
            answer(this, {
              id: 'multi-1',
              question: 'MultiSection Question 1',
              answer: 'MultiSectioned Answer 1',
              section: 'a'
            }),
            answer(this, {
              id: 'multi-2',
              question: 'MultiSection Question 2',
              answer: 'MultiSectioned Answer 2',
              section: 'b'
            })
          ];
        }
        next() {
          return goTo(this.journey.steps.CYA);
        }
      };
      const CYA = class extends CheckYourAnswers {
        get name() {
          return 'CheckYourAnswers';
        }
        sections() {
          return [
            section('a', { title: 'Section A' }),
            section('b', { title: 'Section B' })
          ];
        }
      };

      const steps = { NoSection, Sectioned, MultiSectioned, CYA };
      const session = { entryPoint: NoSection.name };

      return testStep(CYA)
        .withSession(session)
        .withSetup(req => {
          req.journey.steps = steps;
        })
        .withViews(path.join(__dirname, './fixtures'))
        .get()
        .html($ => Promise.all([
          expect($('#a #Sectioned .answer').text()).to.contain('Sectioned Answer'),
          expect($('#a #multi-1 .answer').text()).to.contain('MultiSectioned Answer 1'),
          expect($('#b #multi-2 .answer').text()).to.contain('MultiSectioned Answer 2'),
          expect($('#default #NoSection .answer').text()).to.contain('Default Answer')
        ]));
    });
  });

  describe('#sections', () => {
    it('defaults to []', () => {
      const req = { journey: {} };
      const res = {};
      const cya = new CheckYourAnswers(req, res);
      expect(cya.sections()).to.eql([]);
    });
  });

  describe('#complete', () => {
    const req = { journey: { completeUpTo: sinon.stub() } };
    const res = {};
    const cya = new CheckYourAnswers(req, res);
    const completeSection = { incomplete: false };
    const incompleteSection = { incomplete: true };

    beforeEach(() => {
      req.journey.completeUpTo.reset();
    });

    it('returns false if no sections', () => {
      // At least 1 section is expected in a journey
      expect(cya.complete).to.be.false;
    });

    it('returns false if the journey is not complete', () => {
      req.journey.completeUpTo.returns(false);
      cya._sections = [completeSection];
      expect(cya.complete).to.be.false;
    });

    it('returns true if all sections are complete', () => {
      req.journey.completeUpTo.returns(true);
      cya._sections = [completeSection];
      expect(cya.complete).to.be.true;
    });

    it('returns false if any section is incomplete', () => {
      cya._sections = [completeSection, incompleteSection];
      expect(cya.complete).to.be.false;
    });
  });

  describe('#incomplete', () => {
    const req = { journey: { completeUpTo: sinon.stub() } };
    const res = {};
    const cya = new CheckYourAnswers(req, res);
    const incompleteSection = { incomplete: true };
    const completeSection = { incomplete: false };

    beforeEach(() => {
      req.journey.completeUpTo.reset();
    });

    it('returns false if no sections', () => {
      req.journey.completeUpTo.returns(true);
      expect(cya.incomplete).to.be.false;
    });

    it('returns true if any section is incomplete', () => {
      req.journey.completeUpTo.returns(true);
      cya._sections = [incompleteSection, completeSection];
      expect(cya.incomplete).to.be.true;
    });

    it('returns true if the journey is not complete', () => {
      req.journey.completeUpTo.returns(false);
      cya._sections = [completeSection];
      expect(cya.incomplete).to.be.true;
    });

    it('returns false if all sections are complete', () => {
      req.journey.completeUpTo.returns(true);
      cya._sections = [completeSection];
      expect(cya.incomplete).to.be.false;
    });
  });

  describe('#continueUrl', () => {
    it('calls req.journey.continueUrl', () => {
      const req = { journey: { continueUrl: sinon.stub() } };
      const res = {};
      const cya = new CheckYourAnswers(req, res);
      req.journey.continueUrl.returns('/foo');

      expect(cya.continueUrl).to.eql('/foo');
      expect(req.journey.continueUrl).calledOnce;
    });
  });

  describe('#valid', () => {
    const req = { journey: {} };
    const res = {};

    it('returns false if no statementOfTruth set', () => {
      return new CheckYourAnswers(req, res).ready()
        .then(cya => {
          cya.parse();
          cya.validate();
          expect(cya.valid).to.be.false;
        });
    });
  });
});

const { expect, sinon } = require('test/util/chai');
const { testStep } = require('test/util/supertest');
const Question = require('lib/vendor/one-per-page/src/steps/Question');
const { section } = require('lib/vendor/one-per-page/src/steps/check-your-answers/section');
const { form, text } = require('lib/vendor/one-per-page/src/forms');
const { goTo } = require('lib/vendor/one-per-page/src/flow');
const { METHOD_NOT_ALLOWED } = require('http-status-codes');
const Joi = require('joi');

describe('steps/Question', () => {
  describe('#next', () => {
    const req = { journey: {} };
    const res = {};
    const step = new class extends Question {}(req, res);

    it('expects next to be implemented', () => {
      return expect(() => step.next()).to.throw(/No next\(\) defined/);
    });
  });

  {
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

    describe('GET', () => {
      it('renders the page on GET', () => {
        return testStep(SimpleQuestion)
          .withSetup(req => req.session.generate())
          .get()
          .html(document => {
            return expect(document.querySelector('h1').textContent).to.contain('Question 1');
          });
      });

      it('sends a response on GET when request is an ajax', () => {
        const fieldsResponse = {
          name: {
            id: 'name',
            name: 'name',
            validations: []
          }
        };
        return testStep(SimpleQuestion)
          .withSetup(req => {
            req.headers['X-Requested-With'] = 'XMLHttpRequest';
            req.session.generate();
          })
          .get()
          .text(response => {
            expect(response).to.equal(JSON.stringify(fieldsResponse));
          });
      });

      it('loads fields from the session', () => {
        return testStep(SimpleQuestion)
          .withSetup(req => {
            req.session.generate();
            req.session.SimpleQuestion = { name: 'Michael Allen' };
          })
          .get()
          .html(document => {
            return expect(document.querySelector('#name').value).to.equal('Michael Allen');
          });
      });

      it('validates stored values and renders any errors', () => {
        const errorMessage = 'Error message';
        const returnIsInvalid = sinon.stub().returns(false);
        const InvalidQuestion = class extends SimpleQuestion {
          get form() {
            return form({ name: text.check(errorMessage, returnIsInvalid) });
          }
        };
        return testStep(InvalidQuestion)
          .withSession({ temp: { InvalidQuestion: { name: 'Invalid value' } } })
          .get()
          .html(document => {
            return expect(document.querySelector('.error-message').textContent).to.contain(errorMessage);
          });
      });
    });

    describe('POST', () => {
      const postRequest = testStep(SimpleQuestion)
        .withSetup(req => req.session.generate())
        .withField('name', 'Michael Allen')
        .post();

      it('saves answers in the session', () => {
        return postRequest.session(session => {
          expect(session).to.contain.key('SimpleQuestion');
          expect(session.SimpleQuestion).to.contain.key('name');
          expect(session.SimpleQuestion.name).to.eql('Michael Allen');
        });
      });

      it('redirects to the next step', () => {
        return postRequest.expect(302).expect('Location', '/next-step');
      });

      describe('is invalid', () => {
        const errorMessage = 'Error message';
        const returnIsInvalid = sinon.stub().returns(false);
        const InvalidQuestion = class extends SimpleQuestion {
          get form() {
            return form({ name: text.check(errorMessage, returnIsInvalid) });
          }
        };
        it('redirects to GET', () => {
          return testStep(InvalidQuestion)
            .withSetup(req => req.session.generate())
            .withField('name', 'Invalid Answer')
            .post()
            .expect(302)
            .expect('Location', InvalidQuestion.path);
        });
      });

      describe('is valid', () => {
        const returnIsValid = sinon.stub().returns();
        const ValidQuestion = class extends SimpleQuestion {
          static get path() {
            return '/next-step';
          }
          get form() {
            return form({ name: text.check('no error', returnIsValid) });
          }
        };

        it('redirects to the next step if valid', () => {
          const response = testStep(ValidQuestion)
            .withSetup(req => req.session.generate())
            .withField('name', 'valid answer')
            .post();
          return response.expect(302).expect('Location', '/next-step');
        });
      });
    });

    const notAllowedMethods = ['put', 'delete', 'patch'];

    notAllowedMethods.forEach(method => {
      describe(method.toUpperCase(), () => {
        it('returns 405 (METHOD_NOT_ALLOWED)', () => {
          return testStep(SimpleQuestion)
            .withSetup(req => req.session.generate())
            .withField('name', 'Michael Allen')
            .execute(method)
            .expect(METHOD_NOT_ALLOWED);
        });
      });
    });

    describe('#values', () => {
      it('returns all of form field values', () => {
        const NameStep = class extends SimpleQuestion {
          static get path() {
            return '/next-step';
          }
          get form() {
            return form({ name: text });
          }
        };
        const req = {
          journey: {},
          session: { NameStep: { name: 'John' } }
        };
        const res = {};
        const step = new NameStep(req, res);
        step.retrieve().validate();

        const _values = step.values();
        expect(_values).to.be.an('object');
        expect(_values).to.have.property('name', 'John');
      });

      it('doesn\'t include ref fields', () => {
        const Name = class extends SimpleQuestion {
          static get path() {
            return '/next-step';
          }
          get form() {
            return form({ name: text.ref(this.journey.steps.Name, 'name') });
          }
        };
        const req = {
          journey: { steps: { Name } },
          session: { Name: { name: 'John' } }
        };
        const res = {};
        const step = new Name(req, res);
        step.retrieve().validate();

        const _values = step.values();
        expect(_values).to.be.an('object');
        expect(_values).to.not.have.property('name', 'John');
      });
    });

    describe('#answers', () => {
      it('returns a default answer', () => {
        const NameStep = class extends SimpleQuestion {
          static get path() {
            return '/next-step';
          }
          get form() {
            return form({ name: text });
          }
        };
        const req = {
          journey: {},
          session: { NameStep: { name: 'John' } }
        };
        const res = {};
        const step = new NameStep(req, res);
        step.retrieve().validate();

        const _answers = step.answers();
        expect(_answers).to.be.an('object');
        expect(_answers).to.have.property('url', '/next-step');
        expect(_answers).to.have.property('question', 'Name step');
        expect(_answers).to.have.property('answer', 'John');
        expect(_answers).to.have.property('section', section.default.id);
        expect(_answers).to.have.property('complete', true);
      });
    });
  }

  {
    const NameStep = class extends Question {
      static get path() {
        return '/name';
      }

      get form() {
        return form({
          name: text.joi(
            'error message',
            Joi.string().required()
          )
        });
      }

      template() { /* intentionally blank */ }
      next() { /* intentionally blank */ }
    };

    describe('#retrieve', () => {
      it('calls fields.retrieve with the bound request', () => {
        const req = {
          journey: { NameStep },
          session: { NameStep: { name: 'Michael' } }
        };
        const step = new NameStep(req, {});
        step.retrieve();
        expect(step.fields.name.value).to.eql('Michael');
      });
    });

    describe('#parse', () => {
      it('calls fields.parse with the bound request', () => {
        const req = {
          journey: { NameStep },
          body: { name: 'Michael' }
        };
        const step = new NameStep(req, {});
        step.parse();
        expect(step.fields.name.value).to.eql('Michael');
      });
    });

    describe('#store', () => {
      it('calls fields.store with the bound request', () => {
        const req = {
          journey: { NameStep },
          body: { name: 'Michael' },
          session: {}
        };
        const step = new NameStep(req, {});
        step.parse();
        step.store();
        expect(req.session.NameStep.name).to.eql('Michael');
      });
    });

    describe('#validate', () => {
      it('validates the questions fields', () => {
        const req = { body: { name: 'Michael' } };
        const step = new NameStep(req, {});
        step.parse();

        expect(step.fields.validated).to.be.false;
        step.validate();
        expect(step.fields.validated).to.be.true;
      });
    });

    describe('#valid', () => {
      it('returns true if the questions fields are valid', () => {
        const req = { body: { name: 'Michael' } };
        const step = new NameStep(req, {});
        step.parse();
        step.validate();
        expect(step.valid).to.be.true;
      });

      it('returns false if the questions fields are invalid', () => {
        const req = { body: {} };
        const step = new NameStep(req, {});
        step.parse();
        step.validate();
        expect(step.valid).to.be.false;
      });
    });
  }
});
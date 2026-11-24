const { expect } = require('test/util/chai');
const { testApp } = require('test/util/supertest');
const { answer } = require('lib/vendor/one-per-page/src/steps/check-your-answers/answer');
const { section } = require('lib/vendor/one-per-page/src/steps/check-your-answers/section');
const { text } = require('lib/vendor/one-per-page/src/forms');
const path = require('path');

describe('steps/check-your-answers/answer', () => {
  describe('#answer', () => {
    const values = {
      firstName: 'John',
      lastName: 'Smith'
    };
    const req = { session: { RefStep: { aRef: 'ShouldNotBeOutput' } } };
    const RefStep = { name: 'RefStep' };
    const firstName = text.parse('firstName', values);
    const lastName = text.parse('lastName', values);
    const ref = text.ref(RefStep, 'aRef').parse('aRef', values, req);

    const fields = { firstName, lastName, ref };
    const fakeStep = { name: 'AboutYou', path: '/name', fields };

    it('returns an object', () => {
      const a = answer(fakeStep, {});
      expect(a).to.be.an('object');
    });

    it('contains the given step', () => {
      const a = answer(fakeStep, {});
      expect(a.step).to.eql(fakeStep);
    });

    describe('.section', () => {
      it('can be explicitly set', () => {
        expect(answer(fakeStep, { section: 'foo' }).section).to.eql('foo');
      });

      it('defaults to the default section id', () => {
        expect(answer(fakeStep, {}).section).to.eql(section.default.id);
      });
    });

    describe('.template', () => {
      it('can be set explicitly', () => {
        const ans = answer(fakeStep, { template: 'foo.bar.template.html' });
        expect(ans.template).to.eql('foo.bar.template.html');
      });

      it('defaults to false', () => {
        const ans = answer(fakeStep, {});
        expect(ans.template).to.eql(false);
      });

      it('throws if answer given', () => {
        const shouldFail = () => answer(fakeStep, {
          template: 'foo.template.html',
          answer: 'Foo'
        });
        expect(shouldFail).to.throw(/Provide answer and question or template/);
      });

      it('throws if question given', () => {
        const shouldFail = () => answer(fakeStep, {
          template: 'foo.template.html',
          question: 'Foo'
        });
        expect(shouldFail).to.throw(/Provide answer and question or template/);
      });
    });

    describe('.question', () => {
      it('can be set explicitly', () => {
        const ans = answer(fakeStep, { question: 'Your details' });
        expect(ans.question).to.eql('Your details');
      });

      it('falls back to class name', () => {
        const question = answer({ name: 'Name', fields }).question;
        expect(question).to.eql('Name');
      });

      it('falls back to "No question defined"', () => {
        const question = answer({ fields }).question;
        expect(question).to.eql('No question defined');
      });

      it('falls back to "No question defined"', () => {
        const question = answer({ name: '', fields }).question;
        expect(question).to.eql('No question defined');
      });

      it('titleises class names', () => {
        const question = answer({ name: 'AboutTheMarriage', fields }).question;
        expect(question).to.eql('About the marriage');
      });
    });

    describe('.answer', () => {
      it('can be set explicitly', () => {
        const _answer = answer(fakeStep, { answer: 'An answer' }).answer;
        expect(_answer).to.eql('An answer');
      });

      it('falls back to step.fields concated (ignoring refs)', () => {
        const _answer = answer(fakeStep, {}).answer;
        expect(_answer).to.eql('John Smith');
      });
    });

    describe('.url', () => {
      it('can be set explicitly', () => {
        const url = answer(fakeStep, { url: '/foo/bar' }).url;
        expect(url).to.eql('/foo/bar');
      });

      it('falls back to step.path', () => {
        const url = answer(fakeStep).url;
        expect(url).to.eql('/name');
      });
    });

    describe('.complete', () => {
      it('is false if step.fields.valid not defined', () => {
        const complete = answer({ name: 'Name', fields: {} }).complete;
        expect(complete).to.be.false;
      });

      it('is false if step.fields.valid is false', () => {
        const complete = answer({ fields: { valid: false } }).complete;
        expect(complete).to.be.false;
      });

      it('is true if step.fields.valid is true', () => {
        const complete = answer({ fields: { valid: true } }).complete;
        expect(complete).to.be.true;
      });
    });
  });

  describe('answer.render', () => {
    const values = {
      firstName: 'John',
      lastName: 'Smith'
    };
    const firstName = text.parse('firstName', values);
    const lastName = text.parse('lastName', values);

    const fakeStep = {
      name: 'AboutYou',
      path: '/name',
      dirname: path.resolve(__dirname, './fixtures/'),
      fields: { firstName, lastName },
      get locals() {
        return { fields: fakeStep.fields };
      }
    };
    const app = testApp([fakeStep.dirname]);

    it('resolves to the given answer if no template given', () => {
      const ans = answer(fakeStep, {});
      return expect(ans.render(app)).eventually.eql(ans);
    });

    it('can render html', () => {
      return new Promise((resolve, reject) => {
        app.render('name.answer.html', fakeStep.locals, (error, html) => {
          if (error) {
            reject(error);
          } else {
            resolve(html);
          }
        });
      });
    });

    it('resolves with an extra html parameter if template path given', () => {
      const ans = answer(fakeStep, { template: 'name.answer.html' });
      return ans.render(app).then(rendered => {
        expect(rendered.html).to.eql([
          '<span class="firstName">John</span>',
          '<span class="lastName">Smith</span>',
          ''
        ].join('\n'));
      });
    });

    it('rejects if the template cannot be located', () => {
      const ans = answer(fakeStep, { template: 'missing.template.html' });
      const templateMissingMessage = `Failed to locate ${ans.template}`;

      return expect(ans.render(app)).rejectedWith(templateMissingMessage);
    });

    it('rejects if the rendering fails', () => {
      const ans = answer(fakeStep, { template: 'broken.answer.html' });
      return expect(ans.render(app)).rejectedWith(/Template render error/);
    });
  });
});

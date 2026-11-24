const { expect, sinon } = require('test/util/chai');
const proxyquire = require('proxyquire');
const path = require('path');
const fsUtils = require('lib/vendor/one-per-page/src/util/fs');

sinon.spy(fsUtils, 'fileExists');
const views = sinon.stub();
const app = { get: views };
const resolveTemplate = proxyquire(
  'lib/vendor/one-per-page/src/middleware/resolveTemplate',
  { '../util/fs': fsUtils }
);

const viewsRoot = path.resolve(__dirname, '../../../views/resolveTemplate');

const resolveTest = (step, viewFolders = []) => {
  views.returns(viewFolders);
  return new Promise((resolve, reject) => {
    const req = {
      currentStep: step,
      app
    };
    const res = {};
    const next = error => {
      if (error) reject(error);
      resolve(req, res);
    };
    resolveTemplate(req, res, next);
  });
};

describe('middleware/resolveTemplate', () => {
  beforeEach(() => {
    views.reset();
    fsUtils.fileExists.resetHistory();
  });

  it('skips if the step already has a template defined', () => {
    const step = { template: 'foo/bar.html' };
    return Promise.all([
      expect(resolveTest(step)).fulfilled,
      expect(fsUtils.fileExists).to.not.be.called
    ]);
  });

  it('terminates request if step has no name and no dirname', () => {
    const step = {};
    const notAStepError = 'req.currentStep is not a Step';
    return expect(resolveTest(step)).rejectedWith(notAStepError);
  });

  it('terminates request if no templates found', () => {
    const step = { name: 'TotallyShouldntExistStep', dirname: '/nowhere' };
    return expect(resolveTest(step)).rejectedWith(/No templates found/);
  });

  it('only resolves templates in views if no step.dirname', () => {
    const templateFolder = path.resolve(viewsRoot, 'viewsStepName_test');
    const template = path.resolve(templateFolder, 'StepName.html');
    const step = { name: 'StepName' };

    return resolveTest(step, [templateFolder])
      .then(() => expect(step.template).to.eql(template));
  });

  it('resolves template.html if no step.name', () => {
    const templateFolder = path.resolve(viewsRoot, 'ordering_test');
    const template = path.resolve(templateFolder, 'template.html');
    const step = { dirname: templateFolder };

    return resolveTest(step, [templateFolder])
      .then(() => expect(step.template).to.eql(template));
  });

  {
    const tests = [
      {
        test: 'resolves StepName.template.html',
        folder: 'stepNameTemplate_test',
        template: 'StepName.template.html'
      }, {
        test: 'resolves StepName.html',
        folder: 'stepName_test',
        template: 'StepName.html'
      }, {
        test: 'resolves template.html',
        folder: 'template_test',
        template: 'template.html'
      }, {
        test: 'prefers StepName.html over StepName.template.html',
        folder: 'ordering2_test',
        template: 'StepName.html'
      }, {
        test: 'prefers StepName.template.html over template.html',
        folder: 'ordering3_test',
        template: 'StepName.template.html'
      }, {
        test: 'prefers StepName.html over template.html',
        folder: 'ordering_test',
        template: 'StepName.html'
      }
    ];

    tests.forEach(({ test, folder, template }) => {
      it(test, () => {
        const templateFolder = path.resolve(viewsRoot, folder);
        const templateFile = path.resolve(templateFolder, template);
        const step = { dirname: templateFolder, name: 'StepName' };

        return resolveTest(step)
          .then(() => expect(step.template).to.eql(templateFile));
      });
    });
  }

  {
    const tests = [
      {
        test: 'resolves StepName.template.html from views',
        folder: 'stepNameTemplate_test',
        template: 'StepName.template.html'
      }, {
        test: 'resolves StepName.html from views',
        folder: 'stepName_test',
        template: 'StepName.html'
      }, {
        test: 'prefers StepName.html over StepName.template.html from views',
        folder: 'ordering2_test',
        template: 'StepName.html'
      }
    ];

    tests.forEach(({ test, folder, template }) => {
      it(test, () => {
        const templateFolder = path.resolve(viewsRoot, folder);
        const templateFile = path.resolve(templateFolder, template);
        const step = { dirname: viewsRoot, name: 'StepName' };

        return resolveTest(step, [templateFolder])
          .then(() => expect(step.template).to.eql(templateFile));
      });
    });
  }
});

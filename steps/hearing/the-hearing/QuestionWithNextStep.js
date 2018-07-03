const { Question } = require('@hmcts/one-per-page');
const { expectImplemented } = require('@hmcts/one-per-page/src/errors/expectImplemented');
// eslint-disable-next-line max-len
const { ifCompleteAndNotForceShowThenContinue } = require('@hmcts/one-per-page/src/flow/treeWalker');

class QuestionWithRequiredNextStep extends Question {
  constructor(...args) {
    super(...args);
    expectImplemented(this, 'requiredNextSteps');
  }

  get flowControl() {
    return ifCompleteAndNotForceShowThenContinue(this);
  }

  get middleware() {
    return [
      ...super.middleware, (req, res, next) => {
        if (req.method.toLowerCase() === 'post') {
          this.journey.forceShow = this.requiredNextSteps();
        }
        next();
      }
    ];
  }
}

module.exports = QuestionWithRequiredNextStep;

const { defined } = require('../../util/checks');

class Section {
  constructor(id, { title } = {}) {
    this.title = title;
    this.id = id;
    this.answers = [];
  }

  filterAnswers(answers) {
    this.answers = answers.filter(({ section }) => section === this.id);
    return this;
  }

  get completedAnswers() {
    return this.answers.filter(answer => answer.complete && !answer.hide);
  }

  get incomplete() {
    return this.answers.some(answer => !answer.complete);
  }

  get atLeast1Completed() {
    return this.answers.some(answer => answer.complete && !answer.hide);
  }

  get continueUrl() {
    const nextStep = this.answers.find(answer => !answer.complete);
    return defined(nextStep) ? nextStep.url : '';
  }
}

const section = (...args) => new Section(...args);
section.default = section('default', { title: 'Other details' });

module.exports = { Section, section };

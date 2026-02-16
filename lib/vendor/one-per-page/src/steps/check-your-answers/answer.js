const { defined } = require('../../util/checks');
const { RefValue } = require('../../forms/fieldValue');
const { section } = require('./section');
const path = require('path');
const { fallback } = require('../../util/promises');
const { fileExists } = require('../../util/fs');

const resolveTemplate = (name, directories) => {
  const templatePaths = directories.map(dir => path.join(dir, name));
  return fallback(templatePaths.map(fileExists));
};

const getAnswer = (step, { answer }) => {
  if (defined(answer)) {
    return answer;
  }

  if (defined(step.fields)) {
    return Object.values(step.fields)
      .filter(field => !(field instanceof RefValue))
      .map(field => field.value)
      .join(' ');
  }

  return '';
};

const titleise = string => {
  if (string.length < 1) {
    return 'No question defined';
  }
  const firstChar = string[0].toUpperCase();
  const rest = string.slice(1)
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();

  return `${firstChar}${rest}`;
};

const getQuestion = (step, { question }) => {
  if (defined(question)) {
    return question;
  }
  return defined(step.name) ? titleise(step.name) : 'No question defined';
};

const getSection = args => {
  if (defined(args.section)) {
    return args.section;
  }
  return section.default.id;
};

const getUrl = (step, { url }) => {
  if (defined(url)) {
    return url;
  }
  return step.path;
};

const getComplete = step => {
  if (defined(step.fields) && defined(step.fields.valid)) {
    return step.fields.valid;
  }
  return false;
};

const getId = (step, { id }) => {
  if (defined(id)) {
    return id;
  }
  if (defined(step) && defined(step.name)) {
    return step.name;
  }
  return 'no-id';
};

const getHide = ({ hide = false }) => hide;

// template: false indicates that no template should be rendered.
const getTemplate = ({
  template = false,
  answer = false,
  question = false
}) => {
  if ((answer && template) || (question && template)) {
    throw new Error('Provide answer and question or template, not both');
  }
  return template;
};

class Answer {
  constructor(step, args = {}) {
    this.id = getId(step, args);
    this.section = getSection(args);
    this.question = getQuestion(step, args);
    this.answer = getAnswer(step, args);
    this.url = getUrl(step, args);
    this.complete = getComplete(step);
    this.hide = getHide(args);
    this.template = getTemplate(args);
    this.step = step;
  }

  render(app) {
    if (typeof this.template === 'string') {
      const directories = [
        this.step.dirname,
        ...app.get('views')
      ];
      return resolveTemplate(this.template, directories).then(
        resolvedPath => new Promise((resolve, reject) => {
          app.render(resolvedPath, this.step.locals, (error, html) => {
            if (error) {
              reject(new Error(error));
            }
            this.html = html;
            resolve(this);
          });
        }),
        () => Promise.reject(new Error(`Failed to locate ${this.template}`))
      );
    }
    return Promise.resolve(this);
  }
}

const answer = (step, args = {}) => new Answer(step, args);

module.exports = { answer, Answer };

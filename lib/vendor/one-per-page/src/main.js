const BaseStep = require('./steps/BaseStep');
const Page = require('./steps/Page');
const Question = require('./steps/Question');
const EntryPoint = require('./steps/EntryPoint');
const ExitPoint = require('./steps/ExitPoint');
const Redirect = require('./steps/Redirect');

const requireSession = require('./session/requireSession');

const { field, form, checkboxField } = require('./forms');

const { goTo, branch, journey } = require('./flow');

const { parseBool }  = require('./util');

module.exports = {
  EntryPoint,
  ExitPoint,
  Redirect,
  BaseStep,
  Page,
  Question,
  journey,
  middleware: { requireSession },
  field,
  checkboxField,
  form,
  goTo,
  branch,
  parseBool
};

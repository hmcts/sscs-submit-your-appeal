/* eslint-disable func-names */
import $ from 'jquery';
import fieldTemplates from '@hmcts/look-and-feel/templates/look-and-feel/components/fields.njk';
import errorSummary from '@hmcts/look-and-feel/templates/look-and-feel/components/errors.njk';
import { flatten } from 'lodash';

class AddReason {
  constructor() {
    this.counter = 0;
    this.formId = 'dynamic-form';
    this.textboxId = 'item.whatYouDisagreeWith';
    this.textareaId = 'item.reasonForAppealing';
    this.textboxField = '';
    this.textareaField = '';
    this.errorSummary = '';
    this.items = [];

    $('.add-another-add-link').before(`<div id="${this.formId}"></div>`);

    this.removeDisplayList();
    this.setUpTemplateComponents();
    this.getValues();
  }

  removeDisplayList() {
    if ($('.add-another-list').length) {
      $('.add-another-list').remove();
    }
  }

  buildForm() {
    const values = this.items.map((item, index) => {
      const obj = {};
      const fields = Object.keys(item.fields);
      obj.index = index;
      $.each(fields, (i, field) => {
        obj[field] = {
          value: item.fields[field].value
        };
      });
      return obj;
    });

    $.each(values, (i, value) => {
      if (i > 0) {
        this.counter += 1;
      }
      this.addFields(value.whatYouDisagreeWith, value.reasonForAppealing);
    });
  }

  getValues() {
    return $.ajax({
      type: 'GET',
      url: '/reason-for-appealing',
      success: response => {
        const fieldValues = Object.values(response.items.fields);
        if (fieldValues.length > 0) {
          this.items = fieldValues;
          this.buildForm();
        } else {
          this.addFields();
        }
        this.addAnother();
        this.onSubmit();
      }
    });
  }

  setUpTemplateComponents() {
    fieldTemplates.getExported((error, components) => {
      this.textboxField = components.textbox;
      this.textareaField = components.textarea;
    });
    errorSummary.getExported((error, components) => {
      this.errorSummary = components.errorSummary;
    });
  }

  addFields(whatFieldDetails, reasonFieldDetails) {
    const nullObj = {
      errors: null,
      value: null
    };
    const opts = {
      whatYouDisagreeWith: whatFieldDetails || nullObj,
      reasonForAppealing: reasonFieldDetails || nullObj
    };
    const whatYouDisagreeWithField = this.buildWhatYouDisagreeWithField(
      [],
      opts.whatYouDisagreeWith.value
    );
    const reasonForAppealingField = this.buildReasonForAppealingField(
      [],
      opts.reasonForAppealing.value
    );
    $(`#${this.formId}`).append(`<div id="items-${this.counter}" class="items-container">`);
    $(`#items-${this.counter}`)
      .append(whatYouDisagreeWithField.val)
      .append(reasonForAppealingField.val);
  }

  buildErrorSummary(errors) {
    return this.errorSummary({
      validated: true,
      valid: false,
      errors
    });
  }

  buildWhatYouDisagreeWithField(errors, value) {
    return this.textboxField({
      id: this.textboxId,
      errors: errors || [],
      value: value || ''
    }, 'What you disagree with');
  }

  buildReasonForAppealingField(errors, value) {
    return this.textareaField({
      id: this.textareaId,
      errors: errors || [],
      value: value || ''
    }, 'Why you disagree with it', null, false, 'You can write as much as you want');
  }

  onSubmit() {
    const self = this;

    $('form').submit(function(event) {
      event.preventDefault();
      const containers = $('.items-container');
      const answers = [];

      $.each(containers, index => {
        answers.push(self.buildAnswers(index));
      });

      const promiseSequence = funcs =>
        funcs.reduce((promise, func) => promise
          .then(result => func().then(Array.prototype.concat.bind(result))),
        Promise.resolve([]));

      const posts = answers.map((answer, index) => (
        () => (
          $.ajax({
            type: 'POST',
            url: `/reason-for-appealing/item-${index}`,
            // eslint-disable-next-line id-blacklist
            data: answer,
            success: response => {
              if (response.validationErrors.length > 0) {
                self.handleValidationError(index, response.validationErrors);
              } else if ($(`#items-${index}`).children().hasClass('form-group-error')) {
                $(`#items-${index} .form-group`)
                  .removeClass('form-group-error')
                  .children()
                  .remove('.error-message');
              }
            }
          })
        ))
      );

      return promiseSequence(posts)
        .then(responses => {
          const validationErrors = responses.filter(response => response.validationErrors);
          const actualErrors = validationErrors.filter(error => error.validationErrors.length > 0);
          if (actualErrors.length === 0) {
            // eslint-disable-next-line no-invalid-this
            this.submit();
          } else {
            self.handleErrorSummary(validationErrors);
          }
        });
    });
  }

  handleErrorSummary(fieldErrors) {
    const errorSummaryList = fieldErrors.map((fieldError, index) => (
      // eslint-disable-next-line arrow-body-style
      fieldError.validationErrors.map(validationError => ({
        id: `items-${index}`,
        message: validationError.errors[0]
      }))
    ));
    const summary = this.buildErrorSummary(flatten(errorSummaryList));
    $('.error-summary').remove();
    $('.column-two-thirds').prepend(summary.val);
  }

  handleValidationError(index, validationErrors) {
    const whatYouDisagreeWith = validationErrors[0];
    const reasonForAppealing = validationErrors[1];
    const errorTextbox = this.buildWhatYouDisagreeWithField(
      whatYouDisagreeWith.errors,
      whatYouDisagreeWith.value
    );
    const errorTextArea = this.buildReasonForAppealingField(
      reasonForAppealing.errors,
      reasonForAppealing.value
    );
    $(`#items-${index}`).empty()
      .append(errorTextbox.val)
      .append(errorTextArea.val);
  }

  buildAnswers(index) {
    const whatYouDisagreeWith = $(`#items-${index} #item\\.whatYouDisagreeWith`).val();
    const reasonForAppealing = $(`#items-${index} #item\\.reasonForAppealing`).val();
    return {
      'item.whatYouDisagreeWith': whatYouDisagreeWith,
      'item.reasonForAppealing': reasonForAppealing
    };
  }

  addAnother() {
    $('.add-another-add-link').click(event => {
      event.preventDefault();
      this.counter += 1;
      this.addFields();
    });
  }

  static startAddReason() {
    return (window.location.pathname === '/reason-for-appealing');
  }
}

export default AddReason;

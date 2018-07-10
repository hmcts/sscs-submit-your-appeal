/* eslint-disable max-lines */
/* eslint-disable func-names */
import $ from 'jquery';
import fieldTemplates from '@hmcts/look-and-feel/templates/look-and-feel/components/fields.njk';
import errorSummary from '@hmcts/look-and-feel/templates/look-and-feel/components/errors.njk';
import { flatten, includes } from 'lodash';
import content from './../../steps/reasons-for-appealing/reason-for-appealing/content.en';

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
    const hasNoReasonsError = $(`.error-summary-list:contains(${content.listError})`).length;
    // eslint-disable-next-line arrow-body-style
    const values = this.items.map((item, index) => ({
      index,
      whatYouDisagreeWith: {
        value: item['item.whatYouDisagreeWith'].trim(),
        errors: index === 0 && hasNoReasonsError ? [content.listError] : []
      },
      reasonForAppealing: {
        value: item['item.reasonForAppealing'].trim(),
        errors: index === 0 && hasNoReasonsError ? [content.listError] : []
      }
    }));

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
        const fieldValues = this.getFieldValues(response.items.fields);
        if (fieldValues.length > 0) {
          // eslint-disable-next-line arrow-body-style
          this.items = fieldValues.map(value => ({
            'item.whatYouDisagreeWith': value.fields.whatYouDisagreeWith.value,
            'item.reasonForAppealing': value.fields.reasonForAppealing.value
          }));
          this.buildForm();
        } else {
          this.addFields();
        }
        this.addAnother();
        this.onSubmit();
      }
    });
  }

  getFieldValues(items) {
    const removeKeys = [
      'id',
      'name',
      'validations'
    ];
    for (const key in items) {
      if (includes(removeKeys, key)) delete items[key];
    }
    return Object.values(items);
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
      opts.whatYouDisagreeWith.errors || [],
      opts.whatYouDisagreeWith.value
    );
    const reasonForAppealingField = this.buildReasonForAppealingField(
      opts.reasonForAppealing.errors || [],
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
      id: `${this.textboxId}-${this.counter}`,
      errors: errors || [],
      value: value || ''
    }, 'What you disagree with');
  }

  buildReasonForAppealingField(errors, value) {
    return this.textareaField({
      id: `${this.textareaId}-${this.counter}`,
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
      let firstItemValid = true;
      let otherErrors = false;
      let deleteItems = [];

      // Creates an array of answers to post
      $.each(containers, index => {
        answers.push(self.buildAnswers(index));
      });

      // Removes any element of the answers array that needs to be deleted
      // Creates the array of ajax to delete the items
      const itemsToDelete = self.itemsToDelete(answers);
      if (itemsToDelete.length > 0) {
        itemsToDelete.sort((a, b) => b - a);
        $.each(itemsToDelete, (index, itemIndex) => {
          answers.splice(itemIndex, 1);
        });

        deleteItems = itemsToDelete.map(itemIndex => (
          () => (
            $.ajax({
              type: 'GET',
              url: `/reason-for-appealing/item-${itemIndex}/delete`
            })
          )
        ));
      }
      // Creates the array of ajax to post the items
      const postItems = answers.map((answer, index) => (
        () => (
          $.ajax({
            type: 'POST',
            url: `/reason-for-appealing/item-${index}`,
            // eslint-disable-next-line id-blacklist
            data: answer,
            error: errorResponse => {
              const resJson = errorResponse.responseJSON;
              if (resJson.validationErrors.length > 0) {
                if (index === 0) {
                  firstItemValid = false;
                  self.handleValidationError(index, resJson.validationErrors);
                } else if (self.isMinCharacterError(resJson.validationErrors)) {
                  otherErrors = true;
                  self.handleValidationError(index, resJson.validationErrors);
                }
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
      // Puts the promises in sequence rather than parellel
      const promiseSequence = funcs =>
        funcs.reduce((promise, func) => promise
          .then(result => func().then(Array.prototype.concat.bind(result))),
        Promise.resolve([]));

      // Call the ajax promises, deleting the items first and then posting
      return promiseSequence([...deleteItems, ...postItems])
        .then(responses => {
          const validationErrors = responses.filter(response => response.validationErrors);
          const actualErrors = validationErrors.filter(error => error.validationErrors.length > 0);
          if (actualErrors.length === 0 || (firstItemValid && !otherErrors)) {
            $('.error-summary').remove();
            // eslint-disable-next-line no-invalid-this
            this.submit();
          } else {
            self.handleErrorSummary(validationErrors);
          }
        });
    });
  }

  itemsToDelete(answers) {
    const itemsToDelete = [];
    $.each(answers, (index, answer) => {
      if (
        answer['item.whatYouDisagreeWith'] !== '' && answer['item.reasonForAppealing'] !== ''
      ) {
        return true;
      }
      itemsToDelete.push(index);
      return true;
    });
    return itemsToDelete;
  }

  isMinCharacterError(validationErrors) {
    const errors = validationErrors.map(error => error.errors[0]);
    const contentErrors = Object.values(content.fields).map(field => field.error.notEnough);
    let hasError = false;
    $.each(errors, (index, error) => {
      hasError = includes(contentErrors, error);
      return !hasError;
    });
    return hasError;
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
    const whatYouDisagreeWith = $(`#items-${index} #item\\.whatYouDisagreeWith-${index}`).val();
    const reasonForAppealing = $(`#items-${index} #item\\.reasonForAppealing-${index}`).val();
    return {
      'item.whatYouDisagreeWith': whatYouDisagreeWith || '',
      'item.reasonForAppealing': reasonForAppealing || ''
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

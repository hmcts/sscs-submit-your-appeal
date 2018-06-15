import $ from 'jquery';
const fieldTemplates = require('../../dist/nunjucks/look-and-feel/components/fields.njk');

// sort asset fields.njk
// get content


class AddReason {

  constructor() {
    this.counter = 0;
    this.formId = 'dynamic-form';
    this.textboxId = 'item.whatYouDisagreeWith';
    this.textareaId = 'item.reasonForAppealing';
    this.textboxField = '';
    this.textareaField = '';
    this.items = [];

    $('.add-another-add-link').before(`<div id="${this.formId}"></div>`);

    this.removeDisplayList();
    this.setUpFields();
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
        this.counter ++;
      }
      this.addFields(value.whatYouDisagreeWith, value.reasonForAppealing);
    });
  }

  getValues() {
    return $.ajax({
      type: 'GET',
      url: '/reason-for-appealing',
      success: response => {
        const fieldValues = Object.values(response);
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

  setUpFields() {
    fieldTemplates.getExported((error, components) => {
      this.textboxField = components.textbox;
      this.textareaField = components.textarea;
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
    const that = this;
    $('form').submit(function(event) {
      event.preventDefault();
      const containers = $('.items-container');
      let answers = [];

      $.each(containers, (index) => {
        answers.push(that.buildAnswers(index));
      });

      const promiseSequence = funcs =>
        funcs.reduce((promise, func) =>
          promise.then(result => func().then(Array.prototype.concat.bind(result))),
        Promise.resolve([]));

      const posts = answers.map((answer, index) => () => {
        return $.ajax({
          type: 'POST',
          url: `/reason-for-appealing/item-${index}`,
          data: answer,
          success: response => {
            if (response.validationErrors.length > 0) {
              that.handleValidationError(index, response.validationErrors);
            } else {
              if ($(`#items-${index}`).children().hasClass('form-group-error')) {
                $(`#items-${index} .form-group`)
                  .removeClass('form-group-error')
                  .children()
                  .remove('.error-message');
              }
            }
          }
        });
      });

      return promiseSequence(posts)
        .then(responses => {
          const fieldErrors = responses.filter(response => {
            const errors = response.validationErrors;
            return errors && errors.length > 0;
          });

          if (fieldErrors.length === 0) {
           this.submit();
          }
        });
    });
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
      this.counter ++;
      this.addFields();
    });
  }

  render() {
    // this method is pointless
    console.info('yo! render!');
  }
  static startAddReason() {
    return (window.location.pathname === '/reason-for-appealing');
  }
}

export default AddReason;

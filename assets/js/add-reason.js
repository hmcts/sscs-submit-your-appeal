const nunjucks = require('nunjucks');
const request = require('superagent');
// todo: how on Earth do I define correctly this path for both dev and prod? Ben, heeelp... !
// ps: this works but doesn't strike me as very robust
const fields = require('../../dist/nunjucks/look-and-feel/components/fields.njk');
// const formElements = require('../../dist/nunjucks/formElements.njk');
import $ from 'jquery';

// get the results that have already been posted
// post results When click continue
// Validation????

class AddReason {

  constructor() {
    // todo increment the counter. Probably the simplest it's to read the dom of the list of the reasons already entered,
    // instead of struggling to maintain an internal status.
    this.counter = 0;
    this.formId = 'dynamic-form';
    this.textboxId = 'item.whatYouDisagreeWith';
    this.textareaId = 'item.reasonForAppealing';
    // you'll need a custom element to append the form to, this is just to play with it
    $('.add-another-add-link').before(`<div id="${this.formId}"></div>`);

    this.textboxField = '';
    this.textareaField = '';
    this.items = [];

    if ($('.add-another-list').length) {
      $('.add-another-list').remove();
    }

    this.setUpFields();

    this.getValues();

    // if (this.items.length > 0) {
    //   this.buildForm();
    // } else {
      this.addFields();
    // }

    this.addAnother();
    this.onSubmit();
  }

  buildForm() {
    const values = this.items.map((item, index) => {
      return {
        index,

      }
    })
  }

  getValues() {
    return $.ajax({
      type: 'GET',
      url: `/reason-for-appealing`,
      success: (response, b, c) => {
        if (response.length > 0) {
          this.items = response;
        }
      }
    })
  }

  setUpFields() {
    fields.getExported((error, components) => {
      this.textboxField = components.textbox;
      this.textareaField = components.textarea;
    });
  }

  addFields() {
    const whatYouDisagreeWithField = this.buildWhatYouDisagreeWithField();
    const whyYouDisagreeField = this.buildWhyYouDisagreeField();
    $(`#${this.formId}`).append(`<div id="items-${this.counter}" class="items-container">`);
    $(`#items-${this.counter}`)
      .append(whatYouDisagreeWithField.val)
      .append(whyYouDisagreeField.val);
  }

  buildWhatYouDisagreeWithField(errors = [], value = '') {
    return this.textboxField({
      id: this.textboxId,
      errors,
      value
    }, 'What you disagree with');
  }

  buildWhyYouDisagreeField(errors, value) {
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

      const promiseSerial = funcs =>
        funcs.reduce((promise, func) =>
            promise.then(result => func().then(Array.prototype.concat.bind(result))),
          Promise.resolve([]));

      const posts = answers.map((answer, index) => () => {
        return $.ajax({
          type: 'POST',
          url: `/reason-for-appealing/item-${index}`,
          data: answer,
          success: response => {
            if (response.validationErrors) {
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

      return promiseSerial(posts)
        .then(responses => {
          const a = responses.filter(response => {
            return response.validationErrors;
          });

          if (a.length === 0) {
           this.submit();
          }
        });
    });
  }

  handleValidationError(index, validationErrors) {
      const whatYouDisagreeWith = validationErrors[0];
      const whyYouDisagree = validationErrors[1];
      const errorTextbox = this.buildWhatYouDisagreeWithField(whatYouDisagreeWith.errors, whatYouDisagreeWith.value);
      const errorTextArea = this.buildWhyYouDisagreeField(whyYouDisagree.errors, whyYouDisagree.value);
      $(`#items-${index}`).empty()
        .append(errorTextbox.val)
        .append(errorTextArea.val);
  }

  buildAnswers(index) {
    const whatYouDisagreeWith = $(`#items-${index} #item\\.whatYouDisagreeWith`).val();
    const whyYouDisagreeWith = $(`#items-${index} #item\\.reasonForAppealing`).val();
    return {
      'item.whatYouDisagreeWith': whatYouDisagreeWith,
      'item.reasonForAppealing': whyYouDisagreeWith
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

export default AddReason

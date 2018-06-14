const nunjucks = require('nunjucks');
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

    this.textbox = '';

    this.addFields();
    this.addAnother();
    this.onSubmit();
    // this.addClickHandlers();
  }

  addFields() {

    if ($('.add-another-list').length) {
      $('.add-another-list').remove();
    }

    fields.getExported((err, components) => {
      const textbox = components.textbox;

      this.textbox = textbox;

      const textarea = components.textarea;

      this.textarea = textarea;
      // todo: be a star and import the json tokens as well, instead of hardcoding the text. We may as well go the whole hog!
      const renderedTextbox = textbox({
        id: this.textboxId
      }, 'What you disagree with');
      const renderedTextarea = textarea({
        id: this.textareaId
      }, 'Why you disagree with it', null, false, 'You can write as much as you want');
      $(`#${this.formId}`).append(`<div id="items-${this.counter}" class="items-container">`);
      $(`#items-${this.counter}`).append(renderedTextbox.val);
      $(`#items-${this.counter}`).append(renderedTextarea.val);
      // $(`#${this.formId}`).append(`<input class="button" type="submit" id="${this.formId}-submit" value="Continue">`);
    });
  }

  buildWhatYouDisagreeWithField(errors = [], value = '') {
    return this.textbox({
      id: this.textboxId,
      errors,
      value
    }, 'What you disagree with');
  }

  buildWhyYouDisagreeField(errors, value) {
    return this.textarea({
      id: this.textareaId,
      errors: errors || [],
      value: value || ''
    }, 'Why you disagree with it', null, false, 'You can write as much as you want');
  }

  onSubmit() {
    $('input[type="submit"]').click(event => {
      event.preventDefault();

      const containers = $('.items-container');
      let postCounter = 0;
      $.each(containers, (index) => {
        const values = this.buildAnswers(index);
        $.ajax({
          type: 'POST',
          url: `/reason-for-appealing/item-${index}`,
          data: values,
          success: response => {
            if (response.validationErrors) {
              const whatYouDisagreeWith = response.validationErrors[0];
              const whyYouDisagree = response.validationErrors[1];
              const errorTextbox = this.buildWhatYouDisagreeWithField(whatYouDisagreeWith.errors, whatYouDisagreeWith.value);
              const errorTextArea = this.buildWhyYouDisagreeField(whyYouDisagree.errors, whyYouDisagree.value);
              $(`#items-${index}`).empty().append(errorTextbox.val).append(errorTextArea.val);
              return false;
            } else {
              postCounter ++;
              if ($(`#items-${index}`).children().hasClass('form-group-error')) {
                $(`#items-${index} .form-group`)
                  .removeClass('form-group-error')
                  .children()
                  .remove('.error-message');
              }


              console.log('added ' + index);

              if (postCounter === containers.length) {
                console.log('ACTUALLY FINISHED');
              }

              return true;
              // CONTINUE LOOP
            }
            // build new form underneath
            // refresh the page so you get the updated list
          }
        });
      });

      // GET ALL THE VALUES
      // LOOP OVER AND POST ALL VALUES
      // IF SUCCESSFUL THEN POST AGAIN TO PAGE
      // ELSE DISPLAY VALIDATION

    });
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
      console.log(this.counter);
      this.counter ++;
      this.addFields();
      // $.ajax({
      //   type: 'POST',
      //   url: `/reason-for-appealing/item-${this.counter}`,
      //   data: this.buildBodyJson(),
      //   success: response => {
      //
      //     if (response.validationErrors) {
      //       // display the errors
      //     } else {
      //
      //     }
      //     // build new form underneath
      //     // refresh the page so you get the updated list
      //   }
      // });
    });
  }

  getReasons() {
    let reasons;

    if ($('.noItems').length) {
      console.log('NO Items')
      return [];
    } else {
      return $('.add-another-list-item').text();
    }

    // return
    //
    // const reasonsList = $('.add-another-list-item');
    // return $('.add-another-list-item');
  }

  buildBodyJson() {
    const whatYouDisagreeWith = $(`#items-${this.counter} #item\\.whatYouDisagreeWith`).val();
    const whyYouDisagreeWith = $(`#items-${this.counter} #item\\.reasonForAppealing`).val();
    return {
      'item.whatYouDisagreeWith': whatYouDisagreeWith,
      'item.reasonForAppealing': whyYouDisagreeWith
    };
  }

  addClickHandlers() {
    $(`#${this.formId}`).on('submit', (event) => {
      event.preventDefault();
      $.ajax({
        url: `/reason-for-appealing/item-${this.counter}`,
        type: 'post',
        dataType: 'json',
        accepts: {
          onlyJson: 'application/json'
        },
        success: (data) => {
          // refresh the page so you get the updated list
        },
        error: (err) => {
          // display the errors on the ajax form!
        },
        data: $(`#${this.formId}`).serializeArray()
      });
    })
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

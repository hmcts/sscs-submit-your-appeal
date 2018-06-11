const nunjucks = require('nunjucks');
// todo: how on Earth do I define correctly this path for both dev and prod? Ben, heeelp... !
// ps: this works but doesn't strike me as very robust
const fields = require('../../dist/nunjucks/look-and-feel/components/fields.njk');
// const formElements = require('../../dist/nunjucks/formElements.njk');
import $ from 'jquery';




// get the results that have already been posted
// post results - counter is shit
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

    this.addFields();
    this.addAnother();
    this.addClickHandlers();
  }

  addFields() {

    if ($('.add-another-list').length) {
      $('.add-another-list').remove();
    }

    fields.getExported((err, components) => {
      const textbox = components.textbox;
      const textarea = components.textarea;
      // todo: be a star and import the json tokens as well, instead of hardcoding the text. We may as well go the whole hog!
      const renderedTextbox = textbox({
        id: this.textboxId
      }, 'What you disagree with');
      const renderedTextarea = textarea({
        id: this.textareaId
      }, 'Why you disagree with it', null, false, 'You can write as much as you want');
      $(`#${this.formId}`).append(`<div id="items-${this.counter}">`);
      $(`#items-${this.counter}`).append(renderedTextbox.val);
      $(`#items-${this.counter}`).append(renderedTextarea.val);
      // $(`#${this.formId}`).append(`<input class="button" type="submit" id="${this.formId}-submit" value="Continue">`);
    });
  }

  addAnother() {
    $('.add-another-add-link').click(event => {
      event.preventDefault();
      $.ajax({
        type: 'POST',
        url: `/reason-for-appealing/item-${this.counter}`,
        data: this.buildBodyJson(),
        success: (data) => {
          this.counter ++;
          this.addFields();
          console.log('here');

          // build new form underneath
          // refresh the page so you get the updated list
        },
        error: (err) => {
          // display the errors on the ajax form!
        }
      });
    });
  }

  buildBodyJson() {
    const whatYouDisagreeWith = $('#item\\.whatYouDisagreeWith').val();
    const whyYouDisagreeWith = $('#item\\.reasonForAppealing').val();
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

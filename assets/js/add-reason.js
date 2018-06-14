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

    if ($('.add-another-list').length) {
      $('.add-another-list').remove();
    }

    this.setUpFields()
    this.addFields();
    this.addAnother();
    // this.onSubmit();
    this.onMeow();
    // this.addClickHandlers();
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

  createReqs(index, body) {
    return request
      .post(`/reason-for-appealing/item-${index}`)
      .set('Content-Type', 'application/json')
      .set('accept', 'json')
      .send(body);

  }

  onMeow() {
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


  onSubmit() {
    const that = this;
    $('input[type="submit"]').click(function(event) {
      event.preventDefault();

      const containers = $('.items-container');
      let postCounter = 0;
      console.log('beginning of loop')

      $.each(containers, (index) => {
        const values = that.buildAnswers(index);
        console.log(values);

        console.log('index = ' + index)
        return $.ajax({
          type: 'POST',
          url: `/reason-for-appealing/item-${index}`,
          data: values,
          complete: (response, b, c) => {
            if (response.validationErrors) {
              const whatYouDisagreeWith = response.validationErrors[0];
              const whyYouDisagree = response.validationErrors[1];
              const errorTextbox = that.buildWhatYouDisagreeWithField(whatYouDisagreeWith.errors, whatYouDisagreeWith.value);
              const errorTextArea = that.buildWhyYouDisagreeField(whyYouDisagree.errors, whyYouDisagree.value);
              $(`#items-${index}`).empty().append(errorTextbox.val).append(errorTextArea.val);
              return false;
            } else {
              postCounter ++;

              console.log(response);
              console.log(b);
              console.log(c);

              console.log('post counter = ' + postCounter);
              if ($(`#items-${index}`).children().hasClass('form-group-error')) {
                $(`#items-${index} .form-group`)
                  .removeClass('form-group-error')
                  .children()
                  .remove('.error-message');
              }

              if (postCounter === containers.length) {
                console.log('ACTUALLY FINISHED');
                // this.submit();
                // return true;
              }
              return true;


              // CONTINUE LOOP
            }
            // build new form underneath
            // refresh the page so you get the updated list
          }
        });
      });

      console.log('outside end of loop')

        // if (postCounter === containers.length) {
        //   console.log('ACTUALLY FINISHED');
        //   return true;
        // }

      // GET ALL THE VALUES
      // LOOP OVER AND POST ALL VALUES
      // IF SUCCESSFUL THEN POST AGAIN TO PAGE
      // ELSE DISPLAY VALIDATION

    });
  }

  postIt() {

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

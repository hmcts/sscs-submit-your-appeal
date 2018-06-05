const nunjucks = require('nunjucks');
// todo: how on Earth do I define correctly this path for both dev and prod? Ben, heeelp... !
const fields = require('../../dist/nunjucks/look-and-feel/components/fields.njk');
const formElements = require('../../dist/nunjucks/formElements.njk');
import $ from 'jquery';

class AddReason {

  constructor() {
    this.counter = 0;
    this.formId = 'dynamic-form';
    $('.grid-row').append(`
      <form id="${this.formId}" action="/reason-for-appealing/item-${this.counter}" method="post" class="form"></form>`);
    fields.getExported((err, components) => {
      const textbox = components.textbox;
      const renderedTextbox = textbox({
        id: 'item.whatYouDisagreeWith'
      }, 'What you disagree with');
      $(`#${this.formId}`).append(renderedTextbox.val);
      formElements.getExported((err, comps) => {
        const textarea = comps.textarea;
        const renderedTextarea = textarea({
          id: 'item.reasonForAppealing'
        }, 'Why you disagree with it', null, false, 'You can write as much as you want');
        $(`#${this.formId}`).append(renderedTextarea.val);
        $(`#${this.formId}`).append(`<input class="button" type="submit" id="${this.formId}-submit" value="Continue">`);
      })
    });
    this.addClickHandlers();
  }
  addClickHandlers() {

  }
  render() {
    console.info('yo! render!');
  }
  static startAddReason() {
    return (window.location.pathname === '/reason-for-appealing');
  }
}

export default AddReason
const nunjucks = require('nunjucks');
// todo: how on Earth do I define correctly this path for both dev and prod? Ben, heeelp... !
const fields = require('../../dist/nunjucks/look-and-feel/components/fields.njk');
const formElements = require('../../dist/nunjucks/formElements.njk');
import $ from 'jquery';

class AddReason {

  constructor() {
    $('.grid-row').append(`
      <form id="dynamic-form" action="/reason-for-appealing/item-0" method="post" class="form">
          <input class="button" type="submit" value="Continue">
      </form>`);
    fields.getExported((err, components) => {
      const textbox = components.textbox;
      const renderedTextbox = textbox('bla', 'bla', true);
      $('#dynamic-form').append(renderedTextbox.val)
      formElements.getExported((err, comps) => {
        console.info('an so it contnues')
        const textarea = comps.textarea;
        const renderedTextarea = textarea('ugo', 'labelforugo', null, false, 'You can write as much as you want');
        $('#dynamic-form').append(renderedTextarea.val)
      })
    })
  }
  render() {
    console.info('yo! render!');
  }
  static startAddReason() {
    return (window.location.pathname === '/reason-for-appealing');
  }
}

export default AddReason
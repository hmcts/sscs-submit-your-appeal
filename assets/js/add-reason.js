import nunjucks from 'nunjucks';
// todo: how on Earth do I define correctly this path for both dev and prod? Ben, heeelp... !
const fields = require('../../dist/nunjucks/look-and-feel/components/fields.njk');
const formElements = require('../../dist/nunjucks/formElements.njk');
import $ from 'jquery';

class AddReason {

  constructor() {
    let renderedHTML = fields.getExported((err, components) => {
      const textbox = components.textbox;
      const renderedHTML = textbox('bla', 'bla', true);
      $('.grid-row').append(renderedHTML.val)
      const moreso = formElements.getExported((err, comps) => {
        console.info('an so it contnues')
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
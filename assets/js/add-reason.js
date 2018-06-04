import nunjucks from 'nunjucks';
const fields = require('../../dist/nunjucks/fields.njk');
import $ from 'jquery';

class AddReason {

  constructor() {
    let renderedHTML = fields.getExported((err, components) => {
      const textbox = components.textbox;
      const renderedHTML = textbox('bla', 'bla', true);
      $('.grid-row').append(renderedHTML.val)
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
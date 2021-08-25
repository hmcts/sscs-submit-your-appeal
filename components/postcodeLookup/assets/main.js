import * as $ from 'jquery';

class PostCodeLookup {
  static init() {
    $('#manualLink').click(() => {
      $('#submitType').val('manual');
      document.getElementsByClassName('form')[0].submit();
    });
    $('#findAddress').click(() => {
      $('#submitType').val('lookup');
    });

    $('.postcode-address').change(() => {
      $('#submitType').val('addressSelection');
      document.getElementsByClassName('form')[0].submit();
    });
  }
}

export default PostCodeLookup;

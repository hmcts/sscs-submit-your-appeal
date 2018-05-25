import $ from 'jquery';
import * as jQM from 'jquery-modal';

class InactivityAlert {
  constructor(showAfterSeconds) {
    this.init(showAfterSeconds)
  }
  init(showAfterSeconds) {
    window.setTimeout($('#timeout-dialog').modal.bind($('#timeout-dialog')), 5000)
  }
}


export default InactivityAlert;
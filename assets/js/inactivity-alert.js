import $ from 'jquery';
import * as jQM from 'jquery-modal';

class InactivityAlert {
  constructor(showAfterSeconds) {
    this.timeout = null;
    this.elExtend = $('#extend');
    this.elDestroy = $('#destroy');
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.init(showAfterSeconds);
  }
  init(showAfterSeconds) {
    const el = $('#timeout-dialog');
    this.timeout = window.setTimeout(el.modal.bind(el), showAfterSeconds * 1000);
    this.elExtend.on('click', () => {
      // extend session
    });
    this.elDestroy.on('click', () => {
      // kill session
    });
  }
  destroy() {
    window.clearTimeout(this.timeout);
    this.elExtend.off('click');
    this.elDestroy.off('click');
  }
}


export default InactivityAlert;
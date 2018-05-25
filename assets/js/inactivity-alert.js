import $ from 'jquery';
import * as jQM from 'jquery-modal';

class InactivityAlert {
  constructor(sessionSeconds, showAfterSeconds) {

    this.timeoutForModal = null;
    this.timeoutForSession = null;

    this.sessionSeconds = sessionSeconds;
    this.showAfterSeconds = showAfterSeconds;

    this.elExtend = $('#extend');
    this.elDestroy = $('#destroy');
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.init();
  }
  static navigateAway() {
    window.location.href = '/session-timeout';
  }
  setSessionTimeout() {
    this.timeoutForSession = window.setTimeout(InactivityAlert.navigateAway, this.sessionSeconds * 1000);
  }
  setTimeoutForModal() {
    const el = $('#timeout-dialog');
    this.timeoutForModal = window.setTimeout(el.modal.bind(el), this.showAfterSeconds * 1000);
  }
  startCountdown() {
    this.setTimeoutForModal();
    this.setSessionTimeout();
  }
  init() {
    this.startCountdown();
    this.elExtend.on('click', () => {
      window.clearTimeout(this.timeoutForSession);
      this.startCountdown();
      $.modal.close();
    });
    this.elDestroy.on('click', InactivityAlert.navigateAway);
  }
  destroy() {
    window.clearTimeout(this.timeoutForModal);
    window.clearTimeout(this.timeoutForSession);
    this.elExtend.off('click');
    this.elDestroy.off('click');
  }
}


export default InactivityAlert;
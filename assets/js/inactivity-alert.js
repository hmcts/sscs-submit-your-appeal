import $ from 'jquery';
import 'jquery-modal';
import moment from 'moment/moment';

const secondsToMilliseconds = 1000;

class InactivityAlert {
  constructor(sessionSeconds, showAfterSeconds) {
    this.timeoutForModal = null;
    this.timeoutForSession = null;

    this.sessionSeconds = sessionSeconds;
    this.showAfterSeconds = showAfterSeconds;

    this.elExtend = $('#extend');
    this.elDestroy = $('#destroy');
    this.elMessage = $('#expiring-in-message');

    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.restartCounters = this.restartCounters.bind(this);
    this.init();
  }
  static navigateAway() {
    window.location.href = '/session-timeout-redirect';
  }
  setSessionTimeout() {
    this.timeoutForSession = window.setTimeout(
      InactivityAlert.navigateAway,
      this.sessionSeconds * secondsToMilliseconds
    );
  }
  setTimeoutForModal() {
    const el = $('#timeout-dialog');
    this.timeoutForModal = window.setTimeout(() => {
      const count = 1000;
      /* eslint-disable no-magic-numbers */
      let startTime = 120000;
      /* eslint-enable no-magic-numbers */
      const splitMessage = this.elMessage.length
        ? this.elMessage.html().split(/ [0-9:]+ /)
        : '';

      this.detachHandlers();

      const updateMessage = function uM() {
        // here update the time displayed in the modal
        if (this.elMessage.length) {
          const formatted = moment.utc(startTime).format('m:ss');
          this.elMessage.html(
            `${splitMessage[0]} ${formatted} ${splitMessage[1]}`
          );
        }
        startTime -= count;
      }.bind(this);

      updateMessage();
      this.intervalToUpdate = window.setInterval(updateMessage, count);
      el.modal();
    }, this.showAfterSeconds * secondsToMilliseconds);
  }
  startCountdown() {
    this.setTimeoutForModal();
    this.setSessionTimeout();
  }
  stopAllCounters() {
    window.clearTimeout(this.timeoutForModal);
    window.clearTimeout(this.timeoutForSession);
    window.clearInterval(this.intervalToUpdate);
  }
  restartCounters() {
    this.stopAllCounters();
    this.startCountdown();
    return true;
  }
  init() {
    this.startCountdown();
    this.elExtend.on('click', () => {
      this.restartCounters();
      $.modal.close();
      this.attachHandlers();
    });
    this.elDestroy.on('click', InactivityAlert.navigateAway);
    this.attachHandlers();
  }
  attachHandlers() {
    $(document).on('keydown mousemove', this.restartCounters);
  }
  detachHandlers() {
    $(document).off('keydown mousemove', this.restartCounters);
  }
  destroy() {
    this.detachHandlers();
    this.stopAllCounters();
    this.elExtend.off('click');
    this.elDestroy.off('click');
  }
}

export default InactivityAlert;

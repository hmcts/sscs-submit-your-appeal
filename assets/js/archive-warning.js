import $ from 'jquery';
import 'jquery-modal';

class ArchiveWarning {
  constructor() {
    this.elExtend = $('#extend');

    this.archiveButton = document.querySelector('#archive');

    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);

    this.init();
  }

  navigateAway(event) {
    window.location.href = event.target.getAttribute('href');
  }

  stopArchive(event) {
    this.archiveButton.setAttribute('href', event.target.href);

    event.stopPropagation();
    event.preventDefault();

    const el = $('#archive-dialog');
    el.modal();
  }

  init() {
    this.attachHandlers();

    this.elExtend.on('click', () => {
      $.modal.close();
      this.attachHandlers();
    });
  }
  attachHandlers() {
    document.querySelectorAll('#archive-link').forEach(link => {
      link.addEventListener('click', this.stopArchive.bind(this));
    });

    this.archiveButton.addEventListener('click', this.navigateAway.bind(this));
  }
  detachHandlers() {
    document.querySelectorAll('#archive-link').forEach(link => {
      link.off('click', this.stopArchive.bind(this));
    });

    this.archiveButton.off('click', this.navigateAway.bind(this));
  }
  destroy() {
    this.detachHandlers();
    this.elExtend.off('click');
  }
}


export default ArchiveWarning;

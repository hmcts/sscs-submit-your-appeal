const button = document.querySelector('#antenna-web-chat-button');
const webChat = document.querySelector('web-chat');
const close = document.querySelector('#antenna-web-chat-closed');
const busy = document.querySelector('#antenna-web-chat-busy');
const noAgents = document.querySelector('#antenna-web-chat-no-agents');
const link = document.querySelector('#antenna-web-chat-link');
const buttonScotland = document.querySelector('#antenna-web-chat-button-scotland');
const webChatScotland = document.querySelector('web-chat-scotland');
const closeScotland = document.querySelector('#antenna-web-chat-closed-scotland');
const busyScotland = document.querySelector('#antenna-web-chat-busy-scotland');
const noAgentsScotland = document.querySelector('#antenna-web-chat-no-agents-scotland');
const linkScotland = document.querySelector('#antenna-web-chat-link-scotland');
const currentHour = new Date().getHours();
const MAX_WAIT_IN_SECONDS = 300;
const OPEN_STATUS = 'Open';
const CLOSING_HOUR = 17;
const OPENING_HOUR = 8;

export class WebChat {
  init() {
    if (button !== null && webChat !== null && buttonScotland && webChatScotland) {
      button.addEventListener('click', () => {
        webChat.classList.remove('hidden');
      });

      webChat.addEventListener('hide', () => {
        webChat.classList.add('hidden');
      });

      buttonScotland.addEventListener('click', () => {
        webChatScotland.classList.remove('hidden');
      });

      webChatScotland.addEventListener('hide', () => {
        webChatScotland.classList.add('hidden');
      });

      webChat.addEventListener('metrics', metrics => {
        const metricsDetail = metrics.detail;
        const ewt = metricsDetail.ewt;
        const ccState = metricsDetail.contactCenterState;
        const availableAgents = metricsDetail.availableAgents;
        this.reset();
        this.setMessage(ewt, ccState, availableAgents);
      });
    }
  }

  setMessage(ewt, ccState, availableAgents) {
    if (ccState === OPEN_STATUS && this.isWebchatOpen()) {
      if (ewt > MAX_WAIT_IN_SECONDS) {
        link.style.display = 'none';
        busy.style.display = 'block';
        linkScotland.style.display = 'none';
        busyScotland.style.display = 'block';
      }
      if (availableAgents <= 0) {
        link.style.display = 'none';
        noAgents.style.display = 'block';
        linkScotland.style.display = 'none';
        noAgentsScotland.style.display = 'block';
      }
    } else {
      link.style.display = 'none';
      close.style.display = 'block';
      linkScotland.style.display = 'none';
      closeScotland.style.display = 'block';
    }
  }

  isWebchatOpen() {
    if (document.webchatOpeningFlag) {
      return (currentHour >= OPENING_HOUR && currentHour < CLOSING_HOUR);
    }
    return true;
  }

  reset() {
    link.style.display = 'block';
    close.style.display = 'none';
    busy.style.display = 'none';
    noAgents.style.display = 'none';
    linkScotland.style.display = 'block';
    closeScotland.style.display = 'none';
    busyScotland.style.display = 'none';
    noAgentsScotland.style.display = 'none';
  }
}

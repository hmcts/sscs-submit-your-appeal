const button = document.querySelector('.web-chat-link');
const webChat = document.querySelector('web-chat');
const message = document.querySelector('#metrics');

export class WebChat {
  init() {
    if (button !== null && webChat !== null) {
      button.addEventListener('click', () => {
        webChat.classList.remove('hidden');
      });

      webChat.addEventListener('hide', () => {
        webChat.classList.add('hidden');
      });

      webChat.addEventListener('metrics', metrics => {
        const metricsDetail = metrics.detail;
        const ewt = metricsDetail.ewt;
        const ccState = metricsDetail.contactCenterState;
        const availableAgents = metricsDetail.availableAgents;
        message.innerHTML = `Retrieved metrics: EWT = ${
          ewt}, available agents = ${availableAgents
        }, Contact Center State = ${ccState}`;
      });
    }
  }
}

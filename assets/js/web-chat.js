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
        const status = metricsDetail.ContactCentreState;
        if (status === 'Open') {
          const ewt = metricsDetail.ewt;
          const agentCount = metricsDetail.agentCount;
          message.innerHTML = `Retrieved metrics: EWT = ${ewt}, available agents = ${agentCount}`;
        } else {
          button.replaceWith(`Contact centre is ${status} now`);
        }
      });
    }
  }
}

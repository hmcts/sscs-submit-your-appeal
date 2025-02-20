export class WebChatScotland {
  init() {
    window.__8x8Chat = {
      uuid: 'script_1553624711656480310cfd53.70557078',
      tenant: 'aG1jdHN4MTAx',
      channel: 'Scotland_Tribunal_SSCS_Webchat LIVE',
      channelUuid: 'aUEWe4EVSOuCIvsuANo64Q',
      domain: 'https://vcc-eu4.8x8.com',
      path: '/.',
      buttonContainerId:
        '__8x8-chat-button-container-script_1553624711656480310cfd53.70557078',
      align: 'right'
    };
    const se = document.createElement('script');
    se.type = 'text/javascript';
    se.async = true;
    se.src = `${window.__8x8Chat.domain + window.__8x8Chat.path}/CHAT/common/js/chat.js`;
    const os = document.getElementsByTagName('script')[0];
    os.parentNode.insertBefore(se, os);
  }
}

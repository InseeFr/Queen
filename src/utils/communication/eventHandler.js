import { sendReadyEvent } from './eventSender';

const handleEventParentApp = event => {
  if (event.detail) {
    const { command } = event.detail;
    if (command === 'HEALTH_CHECK') {
      sendReadyEvent();
    }
  }
};

export const listenParentApp = () => {
  window.addEventListener('PEARL', handleEventParentApp);
};

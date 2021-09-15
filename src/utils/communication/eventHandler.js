import { API } from 'utils/api';
import { QUEEN_URL } from 'utils/constants';
import { sendReadyEvent, sendNotReadyEvent } from './eventSender';

const handleEventParentApp = async event => {
  if (event.detail) {
    const { command } = event.detail;
    if (command === 'HEALTH_CHECK') {
      try {
        const response = await fetch(`${QUEEN_URL}/configuration.json`);
        const { apiUrl } = await response.json();
        const { status } = await API.healthcheck(apiUrl);
        if (status === 200) sendReadyEvent();
        else sendNotReadyEvent();
      } catch (e) {
        console.error(e);
        sendNotReadyEvent();
      }
    }
  }
};

export const listenParentApp = () => {
  window.addEventListener('PEARL', handleEventParentApp);
};

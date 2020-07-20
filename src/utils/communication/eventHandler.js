import { synchronize } from 'utils/synchronize';
import { sendSynchronizeEvent, sendReadyEvent } from './eventSender';

const handleEventParentApp = event => {
  if (event.detail) {
    const { command } = event.detail;
    if (command === 'SYNCHRONIZE') {
      const launchSynchronize = async () => {
        console.log('Queen synchronization : STARTED !');
        try {
          await synchronize();
          sendSynchronizeEvent('SUCCESS');
          console.log('Queen synchronization : ENDED !');
        } catch (e) {
          console.log(e.message);
          sendSynchronizeEvent('FAILURE');
          console.log('Queen synchronization : ENDED !');
        }
      };
      launchSynchronize();
    }
    if (command === 'HEALTH_CHECK') {
      sendReadyEvent();
    }
  }
};

export const listenParentApp = () => {
  window.addEventListener('PEARL', handleEventParentApp);
};

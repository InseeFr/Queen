import { synchronize } from 'utils/synchronize';
import { sendSynchronizeEvent } from './eventSender';

const handleEventParentApp = event => {
  if (event.detail) {
    const { command } = event.detail;
    if (command === 'SYNCHRONIZE') {
      const launchSynchronize = async () => {
        console.log('Queen synchronization : STARTED !');
        try {
          await synchronize();
          sendSynchronizeEvent('SUCCESS');
        } catch (e) {
          console.log(e.message);
          sendSynchronizeEvent('FAILURE');
        } finally {
          console.log('Queen synchronization : ENDED !');
        }
      };
      launchSynchronize();
    }
  }
};

export const listenParentApp = () => {
  window.addEventListener('PEARL', handleEventParentApp);
};

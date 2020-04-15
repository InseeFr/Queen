import { sendSynchronizeEvent } from './eventSender';

const handleEventParentApp = event => {
  console.log('receive event');
  console.log(event.detail);

  const worker = new Worker('../synchronize', { type: 'module' });
  worker.onmessage = event => {
    const { type, state } = event.data;
    if (type === 'QUEEN_WORKER') {
      sendSynchronizeEvent(state);
    }
  };
  worker.postMessage({ type: 'QUEEN', command: 'SYNCHRONIZE' });
};

export const listenParentApp = () => {
  window.addEventListener('PEARL', handleEventParentApp);
};

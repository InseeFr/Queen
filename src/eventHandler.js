// eslint-disable-next-line import/extensions

const handleEventParentApp = event => {
  console.log('receive event');
  console.log(event.detail);

  const worker = new Worker('./utils/synchronize', { type: 'module' });
  worker.onmessage = event => {
    console.log('pi: ' + event.data);
  };
  worker.postMessage('ping');
};

export const listenParentApp = () => {
  window.addEventListener('PEARL', handleEventParentApp);
};

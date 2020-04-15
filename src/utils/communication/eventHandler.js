// eslint-disable-next-line import/extensions

const handleEventParentApp = event => {
  console.log('receive event');
  console.log(event.detail);

  const worker = new Worker('../synchronize', { type: 'module' });
  worker.onmessage = event => {
    console.log(event.data);
  };
  worker.postMessage('test');
};

export const listenParentApp = () => {
  window.addEventListener('PEARL', handleEventParentApp);
};

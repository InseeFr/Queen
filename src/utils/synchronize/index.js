// worker.js

import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';

self.onmessage = e => {
  console.log('receive :' + e.data);
  const test = async () => {
    const surveyUnits = await surveyUnitIdbService.getAll();
    console.log(surveyUnits);

    await caches.open('cacheName').then(function(cache) {
      cache.addAll([`${self.location.origin}/configuration.json`]);
      return cache;
    });

    self.postMessage('terminé  !!!');
  };

  test();
};
// self.addEventListener(
//   'message',
//   function(e) {
//     console.log('message received in the worker');
//     self.postMessage('pong');
//   },
//   false
// );

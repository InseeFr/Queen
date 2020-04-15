// worker.js

import surveyUnitIdbService from 'utils/indexedbb/services/surveyUnit-idb-service';

self.onmessage = e => {
  const test = async () => {
    const surveyUnits = await surveyUnitIdbService.getAll();
    console.log(surveyUnits);

    await caches.open('cacheName').then(function(cache) {
      cache.addAll([`${self.location.origin}/configuration.json`]);
      return cache;
    });

    self.postMessage({ type: 'QUEEN_WORKER', state: 'SUCCESS' });
  };
  if (e.data.type === 'QUEEN') {
    test();
  }
};

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

const getUrlRegex = function(url) {
  return url
    .replace('http', '^http')
    .replace('.', '\\\\.')
    .concat('/(.*)((.json)|(.js)|(.png)|(.svg))');
};

if (workbox) {
  const queenCacheName = 'queen-cache';
  const { precaching, routing, strategies, cacheableResponse } = workbox;
  console.log('Loading Queen SW into another SW');
  const queenPrecacheController = new workbox.precaching.PrecacheController(queenCacheName);
  queenPrecacheController.addToCacheList(self.__precacheManifest);

  workbox.routing.registerRoute(
    new RegExp(getUrlRegex(self._urlQueen)),
    new workbox.strategies.CacheFirst({
      cacheName: queenCacheName,
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  self.addEventListener('install', event => {
    console.log('QUEEN sw : installing ...');
    event.waitUntil(queenPrecacheController.install());
  });

  self.addEventListener('activate', event => {
    console.log('QUEEN sw : activating ...');
    event.waitUntil(queenPrecacheController.install());
    event.waitUntil(queenPrecacheController.activate());
  });
}

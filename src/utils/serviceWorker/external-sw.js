/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

const getUrlRegex = url => {
  return url.replace('http', '^http').concat('/(.*)((.json)|(.js)|(.png)|(.svg))');
};

const getQuestionnaireUrlRegex = urlQueenApi => {
  return urlQueenApi.replace('http', '^http').concat('/api/operation/(.){1,}/questionnaire');
};

const queenCacheName = 'queen-cache';
console.log('Loading Queen SW into another SW');

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

const setQuestionnaireCache = async () => {
  const responseFromQueen = await fetch(`${self._urlQueen}/configuration.json`);
  const configuration = await responseFromQueen.json();

  workbox.routing.registerRoute(
    new RegExp(getQuestionnaireUrlRegex(configuration.urlQueenApi)),
    new workbox.strategies.CacheFirst({
      cacheName: 'queen-questionnaire',
    })
  );
};
setQuestionnaireCache();

const queenPrecacheController = async () => {
  const cache = await caches.open(queenCacheName);
  const urlsToCache = [`${self._urlQueen}/asset-manifest.json`].concat(
    self.__queenPrecacheManifest.map(({ url }) => `${self._urlQueen}${url}`)
  );
  await cache.addAll(urlsToCache);
};

self.addEventListener('install', event => {
  console.log('QUEEN sw : installing ...');
  event.waitUntil(queenPrecacheController());
});

self.addEventListener('activate', event => {
  console.log('QUEEN sw : activating ...');
});

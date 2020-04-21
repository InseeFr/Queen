/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

const getUrlRegex = url => {
  return url.replace('http', '^http').concat('/(.*)((.json)|(.js)|(.png)|(.svg))');
};

const getQuestionnaireUrlRegex = urlQueenApi => {
  return urlQueenApi.replace('http', '^http').concat('/api/operation/(.){1,}/questionnaire');
};

if (workbox) {
  const queenCacheName = 'queen-cache';
  const { precaching, routing, strategies, cacheableResponse } = workbox;
  console.log('Loading Queen SW into another SW');
  const queenPrecacheController = new workbox.precaching.PrecacheController(queenCacheName);
  queenPrecacheController.addToCacheList(
    self.__precacheManifest.concat([{ url: `${self._urlQueen}/asset-manifest.json` }])
  );

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
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'queen-questionnaire',
        plugins: [
          new workbox.cacheableResponse.Plugin({
            statuses: [0, 200],
          }),
        ],
      })
    );
  };

  self.addEventListener('install', event => {
    console.log('QUEEN sw : installing ...');
    event.waitUntil(queenPrecacheController.install());
    event.waitUntil(setQuestionnaireCache());
  });

  self.addEventListener('activate', event => {
    console.log('QUEEN sw : activating ...');
    event.waitUntil(queenPrecacheController.install());
    event.waitUntil(queenPrecacheController.activate());
    event.waitUntil(setQuestionnaireCache());
  });
}

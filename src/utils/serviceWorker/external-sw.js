importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js');

const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { registerRoute } = workbox.routing;
const { NetworkFirst, CacheFirst } = workbox.strategies;

const getQueenUrlRegex = url => {
  return url.replace('http', '^http').concat('/(.*)((.js)|(.png)|(.svg))');
};

const getQueenUrlRegexJson = url => {
  return url.replace('http', '^http').concat('/(.*)(.json)');
};

const getQuestionnaireUrlRegex = () => '^http.*/api/campaign/(.){1,}/questionnaire';

const getRequiredResourceUrlRegex = () => '^http.*/api/campaign/(.){1,}/required-nomenclatures';

const getResourceUrlRegex = () => '^http.*/api/nomenclature/(.){1,}';

const queenCacheName = 'queen-cache';
console.log('"Loading Queen SW into another SW"');

registerRoute(
  new RegExp(getQueenUrlRegexJson(self._QUEEN_URL)),
  new NetworkFirst({
    cacheName: queenCacheName,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

registerRoute(
  new RegExp(getQueenUrlRegex(self._QUEEN_URL)),
  new CacheFirst({
    cacheName: queenCacheName,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

registerRoute(
  new RegExp(getQuestionnaireUrlRegex()),
  new CacheFirst({
    cacheName: 'queen-questionnaire',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

registerRoute(
  new RegExp(getRequiredResourceUrlRegex()),
  new CacheFirst({
    cacheName: 'queen-resource',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
registerRoute(
  new RegExp(getResourceUrlRegex()),
  new CacheFirst({
    cacheName: 'queen-resource',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

const queenPrecacheController = async () => {
  const cache = await caches.open(queenCacheName);
  const urlsToPrecache = self.__WB_MANIFEST.reduce(
    (_, { url }) => [..._, `${self._QUEEN_URL}/${url}`],
    []
  );
  await cache.addAll(urlsToPrecache);
};

self.addEventListener('install', event => {
  console.log('QUEEN sw : installing ...');
  event.waitUntil(queenPrecacheController());
});

self.addEventListener('activate', event => {
  console.log('QUEEN sw : activating ...');
});

const getUrlRegex = url => {
  return url.replace('http', '^http').concat('/(.*)((.json)|(.js)|(.png)|(.svg))');
};

const getQuestionnaireUrlRegex = QUEEN_API_URL => {
  return QUEEN_API_URL.replace('http', '^http').concat('/api/operation/(.){1,}/questionnaire');
};

const getResourceUrlRegex = QUEEN_API_URL => {
  return QUEEN_API_URL.replace('http', '^http').concat(
    '/api/operation/(.){1,}/required-nomenclatures'
  );
};

const queenCacheName = 'queen-cache';
console.log('Loading Queen SW into another SW');

workbox.routing.registerRoute(
  new RegExp(getUrlRegex(self._QUEEN_URL)),
  new workbox.strategies.CacheFirst({
    cacheName: queenCacheName,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  })
);

const setQuestionnaireAndResourcesCache = async () => {
  const responseFromQueen = await fetch(`${self._QUEEN_URL}/configuration.json`);
  const configuration = await responseFromQueen.json();

  workbox.routing.registerRoute(
    new RegExp(getQuestionnaireUrlRegex(configuration.QUEEN_API_URL)),
    new workbox.strategies.CacheFirst({
      cacheName: 'queen-questionnaire',
    })
  );

  workbox.routing.registerRoute(
    new RegExp(getResourceUrlRegex(configuration.QUEEN_API_URL)),
    new workbox.strategies.CacheFirst({
      cacheName: 'queen-resource',
    })
  );
};
setQuestionnaireAndResourcesCache();

const queenPrecacheController = async () => {
  const responseFromQueen = await fetch(`${self._QUEEN_URL}/manifest.json`);
  const { icons } = await responseFromQueen.json();
  let urlsToPrecache = [
    `${self._QUEEN_URL}/index.css`,
    `${self._QUEEN_URL}/entry.js`,
    `${self._QUEEN_URL}/keycloak.json`,
    `${self._QUEEN_URL}/manifest.json`,
    `${self._QUEEN_URL}/configuration.json`,
    `${self._QUEEN_URL}/asset-manifest.json`,
  ].concat(icons.map(({ src }) => `${self._QUEEN_URL}/${src}`));
  const cache = await caches.open(queenCacheName);
  urlsToPrecache = self.__queenPrecacheManifest.reduce((_, { url }) => {
    if (!url.endsWith('.html')) return [..._, `${self._QUEEN_URL}${url}`];
    return _;
  }, urlsToPrecache);
  await cache.addAll(urlsToPrecache);
};

self.addEventListener('install', event => {
  console.log('QUEEN sw : installing ...');
  event.waitUntil(queenPrecacheController());
});

self.addEventListener('activate', event => {
  console.log('QUEEN sw : activating ...');
});

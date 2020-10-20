importScripts('/service-worker.js');

const getUrlRegex = function(url) {
  return url.replace('http', '^http').concat('/(.*)((.ico)|(.png)|(.json))');
};

const configurationCacheName = 'queen-cache';

workbox.routing.registerRoute(
  new RegExp(getUrlRegex(self.location.origin)),
  new workbox.strategies.CacheFirst({
    cacheName: configurationCacheName,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  })
);

const queenPrecacheController = async () => {
  const responseFromQueen = await fetch('/manifest.json');
  const { icons } = await responseFromQueen.json();
  const urlsToPrecache = [
    `/keycloak.json`,
    `/manifest.json`,
    `/configuration.json`,
    `/static/questionnaire/simpsons.json`,
  ].concat(icons.map(({ src }) => src));
  const cache = await caches.open(configurationCacheName);
  await cache.addAll(urlsToPrecache);
};

self.addEventListener('install', event => {
  console.log('QUEEN sw : installing ...');
  event.waitUntil(queenPrecacheController());
});

self.addEventListener('activate', event => {
  console.log('QUEEN sw : activating ...');
});

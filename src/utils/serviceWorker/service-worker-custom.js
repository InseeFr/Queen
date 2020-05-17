/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
importScripts('/service-worker.js');

const getUrlRegexJson = function(url) {
  return url.replace('http', '^http').concat('/(.*)(.json)');
};

const getUrlRegexManifestFiles = function(url) {
  return url.replace('http', '^http').concat('/(.*)((.ico)|(.png))');
};

const configurationCacheName = 'configuration-cache';
const manifestImageCacheName = 'manifest-cache';

self.addEventListener('install', event => {
  console.log('Queen  sw : installing configuration..');
  const cacheName = configurationCacheName;
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      cache.addAll([
        `${self.location.origin}/configuration.json`,
        `${self.location.origin}/keycloak.json`,
        `${self.location.origin}/manifest.json`,
      ]);
      return cache;
    })
  );
  event.waitUntil(
    caches.open(manifestImageCacheName).then(function(cache) {
      const imageSizes = ['72', '96', '128', '144', '152', '192', '384', '512'];
      const imageUrl = imageSizes.map(
        size => `${self.location.origin}/static/images/icons/icon-${size}x${size}.png`
      );
      cache.addAll([...imageUrl, `${self.location.origin}/favicon.ico`]);
      return cache;
    })
  );
});

workbox.routing.registerRoute(
  new RegExp(getUrlRegexJson(self.location.origin)),
  new workbox.strategies.CacheFirst({
    cacheName: configurationCacheName,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  })
);
workbox.routing.registerRoute(
  new RegExp(getUrlRegexManifestFiles(self.location.origin)),
  new workbox.strategies.CacheFirst({
    cacheName: manifestImageCacheName,
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  })
);

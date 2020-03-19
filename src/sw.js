importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
/* global workbox */
if (workbox) {
  console.log('QUEEN sw :Workbox is loaded');

  self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  const precacheController = new workbox.precaching.PrecacheController('Queen');
  precacheController.addToCacheList(self.__WB_MANIFEST);

  self.addEventListener('install', event => {
    console.log('QUEEN sw : installing..');
    event.waitUntil(precacheController.install());
  });

  self.addEventListener('activate', event => {
    console.log('QUEEN sw : activating..');
    event.waitUntil(precacheController.install());
    event.waitUntil(precacheController.activate());
  });

  workbox.core.clientsClaim();
  workbox.routing.registerNavigationRoute(
    workbox.precaching.getCacheKeyForURL(__webpack_public_path__.concat('index.html')),
    {
      blacklist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
    }
  );
}

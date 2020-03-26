/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
if (workbox) {
  const { precaching } = workbox;
  console.log('Loading Queen SW into another SW');
  const queenPrecacheController = new workbox.precaching.PrecacheController('Queen');
  queenPrecacheController.addToCacheList(self.__precacheManifest);

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

const fs = require('fs');

function buildSW() {
  /* rename precache-manifest file */
  const manifestFile = `build/${
    fs.readdirSync('build').filter(fn => fn.startsWith('precache-manifest'))[0]
  }`;
  const newName = manifestFile.replace(/precache-manifest/, 'queen-precache-manifest');
  fs.renameSync(manifestFile, newName);

  /* update external service-worker */
  const originalContentSW = fs.readFileSync('src/utils/serviceWorker/external-sw.js', 'utf-8');
  const newContentSW = `importScripts(\`\${self._QUEEN_URL}${newName.replace(
    /build/,
    ''
  )}\`); \n ${originalContentSW}`;
  fs.writeFileSync('build/queen-service-worker.js', newContentSW, 'utf-8');

  /* update precache manifest */
  const originalContentManifest = fs.readFileSync(newName, 'utf-8');
  const newContentManifest = originalContentManifest
    .replace(/__PUBLIC_URL_TO_REPLACE__/g, '')
    .replace(/self.__precacheManifest/g, 'self.__queenPrecacheManifest');
  fs.unlinkSync(newName);
  fs.writeFileSync(newName, newContentManifest, 'utf-8');

  /* update original service-worker */
  const serviceWorkerPath = 'build/service-worker.js';
  const originalServiceWorkerContent = fs.readFileSync(serviceWorkerPath, 'utf-8');
  const newServiceWorkerContent = originalServiceWorkerContent
    .replace(/__PUBLIC_URL_TO_REPLACE__/g, '')
    .replace(/precache-manifest/g, 'queen-precache-manifest')
    .replace(/self.__precacheManifest/g, 'self.__queenPrecacheManifest');

  fs.unlinkSync(serviceWorkerPath);
  fs.writeFileSync(serviceWorkerPath, newServiceWorkerContent, 'utf-8');

  /* Copy service-worker-custom */
  fs.copyFileSync(
    'src/utils/serviceWorker/service-worker-custom.js',
    'build/service-worker-custom.js'
  );
}
buildSW();

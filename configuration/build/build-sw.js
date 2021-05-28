const fs = require('fs');
const workboxBuild = require('workbox-build');

function buildSW() {
  /* update original service-worker */
  const serviceWorkerPath = 'build/service-worker.js';
  const originalServiceWorkerContent = fs.readFileSync(serviceWorkerPath, 'utf-8');
  const newServiceWorkerContent = originalServiceWorkerContent.replace(
    /__PUBLIC_URL_TO_REPLACE__/g,
    ''
  );

  fs.unlinkSync(serviceWorkerPath);
  fs.writeFileSync(serviceWorkerPath, newServiceWorkerContent, 'utf-8');

  workboxBuild
    .injectManifest({
      swSrc: 'src/utils/serviceWorker/external-sw.js', // SW template file
      swDest: 'build/queen-service-worker.js', // Final SW file
      maximumFileSizeToCacheInBytes: 5000000, // limit (in Bytes) of cacheable files
      globDirectory: 'build',
      globPatterns: ['**/*.js', '**/*.png', '**/*.svg', '**/*.json'],
      globIgnores: ['**/service-worker.js', '**/keycloak.json', '**/oidc.json'], // don't cache service-worker file
    })
    .then(({ count, size, warnings }) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn);
      console.log(`${count} files will be precached, totaling ${size} bytes.`);
    })
    .catch(console.error);
}
buildSW();

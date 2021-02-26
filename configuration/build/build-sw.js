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
      swSrc: 'src/utils/serviceWorker/external-sw.js', // this is your sw template file
      swDest: 'build/queen-service-worker.js', // this will be created in the build step
      globDirectory: 'build',
      globPatterns: ['**/*.js', '**/*.png', '**/*.svg', '**/*.json'],
      globIgnores: ['**/service-worker.js'],
    })
    .then(({ count, size, warnings }) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn);
      console.log(`${count} files will be precached, totaling ${size} bytes.`);
    })
    .catch(console.error);
}
buildSW();

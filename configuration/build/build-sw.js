const fs = require('fs');

function buildSW() {
  const originalContentSW = fs.readFileSync('build/queen-service-worker.js', 'utf-8');
  const newContentSW = originalContentSW.replace(
    /"\/queen-precache-manifest/,
    'self._urlQueen+"/queen-precache-manifest'
  );
  fs.unlinkSync('build/queen-service-worker.js');
  fs.writeFileSync('build/queen-service-worker.js', newContentSW, 'utf-8');

  const files = fs.readdirSync('build').filter(fn => fn.startsWith('queen-precache-manifest'));
  const originalContentManifest = fs.readFileSync(`build/${files[0]}`, 'utf-8');
  const newContentManifest = originalContentManifest.replace(
    /self.__precacheManifest/g,
    'self.__queenPrecacheManifest'
  );

  fs.unlinkSync(`build/${files[0]}`);
  fs.writeFileSync(`build/${files[0]}`, newContentManifest, 'utf-8');

  console.log('Re-write external sw complete.');
}
buildSW();

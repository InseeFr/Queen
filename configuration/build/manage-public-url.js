const fs = require('fs');
const glob = require('glob');

const getDirectories = function (src, callback) {
  return glob(`${src}/**/*`, callback);
};

function publicURL() {
  console.log('Replacing "__PUBLIC_URL_TO_REPLACE__" in built files ...');
  getDirectories('build', (err, res) => {
    if (err) {
      console.log('Error', err);
    } else {
      const newPublicPath = "(localStorage.getItem('QUEEN_URL') || '')";
      const files = res;
      files.forEach(filePath => {
        if (!fs.lstatSync(filePath).isDirectory() && filePath.match(/\.(json|html|js|map)$/)) {
          const originalFileContent = fs.readFileSync(filePath, 'utf-8');
          let newFileContent = originalFileContent;
          if (!filePath.match(/\.(json|html)$/)) {
            newFileContent = newFileContent
              .replace(/\\("|')__PUBLIC_URL_TO_REPLACE__\/\\("|')/g, `${newPublicPath}+'/'`)
              .replace(/("|')__PUBLIC_URL_TO_REPLACE__("|')/g, newPublicPath)
              .replace(/("|')(__PUBLIC_URL_TO_REPLACE__)\/("|')/g, `${newPublicPath}+'/'`)
              .replace(/("|')(__PUBLIC_URL_TO_REPLACE__)\//g, `${newPublicPath}+$1/`);
          } else {
            newFileContent = newFileContent.replace(/__PUBLIC_URL_TO_REPLACE__/g, '');
          }
          fs.unlinkSync(filePath);
          fs.writeFileSync(filePath, newFileContent, 'utf-8');
        }
      });
    }
  });
  console.log('Replacement completed.');
}
publicURL();

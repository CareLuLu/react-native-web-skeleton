const fs = require('fs');
const glob = require('glob');
const path = require('path');
const copy = require('copyfiles');
const { gzip } = require('node-gzip');

/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-console: 0 */

// Copy build/loadable-stats.json to server/loadable-stats.json
// Copy build/index.html to server/index.html
copy([
  path.resolve(__dirname, '..', 'build', 'loadable-stats.json'),
  path.resolve(__dirname, '..', 'build', 'index.html'),
  path.resolve(__dirname, '..', 'server'),
], { up: true }, (copyError) => {
  if (copyError) {
    console.error(copyError);
    process.exit(1);
  }

  glob(`${path.resolve(__dirname, '..', 'build')}/**/*.{js,html,json,map}`, {}, async (globError, filepaths) => {
    if (globError) {
      console.error(globError);
      process.exit(1);
    }
    for (let i = 0; i < filepaths.length; i += 1) {
      const filepath = filepaths[i];
      const file = fs.readFileSync(filepath);
      const fileGzip = await gzip(file); // eslint-disable-line
      fs.unlinkSync(filepath);
      fs.writeFileSync(`${filepath}${process.env.STATIC_FILE_EXTENSION === '0' ? '' : '.gz'}`, fileGzip);
    }
  });
});

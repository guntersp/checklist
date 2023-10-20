const fs = require('fs');
const archiver = require('archiver');

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
function zipDirectory(source, out, dir = false) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, dir)
      .on('error', err => reject(err))
      .pipe(stream)
      ;

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

const id = process.argv[2]

const distDir = __dirname + '/../dist/'

zipDirectory(distDir + id + '_app/win-unpacked', distDir + id + '_app.zip', id);

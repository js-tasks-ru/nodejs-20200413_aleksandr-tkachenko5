const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      deleteFile(pathname, filepath, req, res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function deleteFile(pathname, filepath, req, res) {
  /**
   * Check for the nested path.
   * If so, response with the "400" status code.
   * */
  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }

  /**
   * If the file does not exists,
   * response with the ""409 status code.
   * */
  if(!fs.existsSync(filepath)) {
    res.statusCode = 404;
    res.end('The file does not exists');
    return;
  }

  /**
   * Asynchronously removes a file or symbolic link.
   * @link {https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback}
   * */
  fs.unlink(filepath, () => {});
  res.statusCode = 200;
  res.end();

}

module.exports = server;

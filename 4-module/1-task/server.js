const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      sendFile(pathname, filepath, res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function sendFile(pathname, filepath, res) {
  /**
   * Create a stream and pipe it to the respone.
   * */
  const file = fs.createReadStream(filepath);
  file.pipe(res);

  file.on('error', (err) => {
    if (pathname.includes('/')) {
      /**
       * Check for the nested path.
       * If so, response with the "400" status code.
       * */
      res.statusCode = 400;
      res.end('Nested path does not supported');
    } else if (!fs.stat(filepath, (err) => err)) {
      /**
       * Check the file existence.
       * If the file does not exist, response with the "404" status code.
       * */
      res.statusCode = 404;
      res.end('No such file');
    } else {
      /**
       * Unknown server error.
       * Response with the "500" status code.
       * */
      res.statusCode = 500;
      res.end('Server error');
    }
  });
  /**
   * If connection was closed,
   * destroy all resources associated with the stream.
   * */
  res.on('close', () => {
    file.destroy();
  });
}

module.exports = server;

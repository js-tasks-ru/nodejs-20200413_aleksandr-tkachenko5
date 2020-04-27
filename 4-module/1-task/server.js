const url = require('url');
const http = require('http');
const path = require('path');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      /**
       * Check for the nested path.
       * If so, response with the "400" status code
       * */
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end();
      }
      console.log('d');
      res.end();
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

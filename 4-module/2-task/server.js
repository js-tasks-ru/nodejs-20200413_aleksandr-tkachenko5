const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const server = new http.Server();
const LimitSizeStream = require('./LimitSizeStream');

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      /**
       * Check for the nested path.
       * If so, response with the "400" status code.
       * */
      if (pathname.includes('/') || pathname.includes('..')) {
        res.statusCode = 400;
        res.end('Nested paths are not allowed');
        return;
      }
      if (req.headers['content-length'] <= 0) {
        res.statusCode = 409;
        res.end();
        return;
      }
      /**
       * Create a file on the disk.
       * @param {pathname}
       * @param {filepath}
       * @param {req}
       * @param {res}
       * */
      postFile(pathname, filepath, req, res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function postFile(pathname, filepath, req, res) {

  /**
   * Create a limited stream class.
   * That will thron an error if the limit is exceeded.
   * */
  const limitedStream = new LimitSizeStream({limit: 1000000}); // 1mb

  /**
   * Create a writable stream with the "wx" flag.
   * 'wx': Like 'w' but fails if the path exists.
   * https://nodejs.org/api/fs.html#fs_file_system_flags
   * */
  const file = fs.createWriteStream(filepath, {flags: 'wx'});
  req.pipe(limitedStream)
      .pipe(file);

  /**
   * Error tracking of the limited stream.
   * */
  limitedStream.on('error', (err) => {
    /**
     * If the limit exceeded,
     * response with the "413" status code.
     * */
    if (err.code === 'LIMIT_EXCEEDED') {
      res.statusCode = 413;
      res.end('File is to big');
      fs.unlink(filepath, (err) => {});
      return;
    }

    /**
     * Unknown server error.
     * Response with the "500" status code.
     * */
    res.statusCode = 500;
    res.end('Server error');
    fs.unlink(filepath, (err) => {});
  });

  /**
   * Error tracking of the writable stream.
   * */
  file.on('error', (err) => {
    /**
     * If the file is exist,
     * response with the ""409 status code.
     * */
    if (err.code === 'EEXIST') {
      res.statusCode = 409;
      res.end('File already exist');
      return;
    }

    /**
     * Unknown server error.
     * Response with the "500" status code.
     * */
    res.statusCode = 500;
    res.end('Server error');
    fs.unlink(filepath, (err) => {});
  });

  /**
   * The 'close' event is emitted when the stream and any of its underlying resources
   * (a file descriptor, for example) have been closed.
   * @link {https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_event_close}
   *
   * Response with the "201" status code.
   * */
  file.on('close', (err) =>{
    file.end();
    res.statusCode = 201;
    res.end();
  });

  /**
   * If connection was closed,
   * destroy all resources associated with the stream.
   * */
  res.on('close', () => {
    if (res.writableEnded) {
      return;
    }
    fs.unlink(filepath, (err) => {});
    file.destroy();
  });
}

module.exports = server;

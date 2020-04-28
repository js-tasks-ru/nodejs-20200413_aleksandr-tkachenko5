const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this.bufferSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.bufferSize += Buffer.from(chunk).length;

    if (this.bufferSize > this.limit) {
      callback(new LimitExceededError());
    } else {
      this.push(chunk.toString());
      callback();
    }
  }
}

module.exports = LimitSizeStream;

const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    // Temporary array for chunks that not ends with the linebreak
    this.temp = [];
  }

  _transform(chunk, encoding, callback) {
    /**
     * If current chunk does not have a linebrake,
     * we save the current chunk in the {@link this.temp}
     * Hack:
     * We check that the array is not empty (to do not push the empty item)
     * and create a newly temporary array
     * because of non working arrays "push" method
     * due to internal "push" method of the Streams.
     * */
    if (!chunk.toString().includes(os.EOL)) {
      const tempArray = [];
      if (this.temp.length) {
        tempArray.push(this.temp);
      }
      tempArray.push(chunk.toString());
      this.temp = tempArray;
      /**
       * Else, we split the chunk by linebreak separator,
       * add the current {@link this.temp} to the first element of the newly array
       * and update the current {@link this.temp} with the last elemnt
       * of the spitted array.
       * Loop over the splitted array and push the data.
       * */
    } else {
      const splittedArray = chunk.toString().split(os.EOL);
      splittedArray[0] = this.temp + splittedArray[0];
      this.temp = splittedArray[splittedArray.length - 1];
      for (let i = 0; i < splittedArray.length - 1; i++) {
        this.push(splittedArray[i]);
      }
    }
    callback(null);
  }

  _flush(callback) {
    /**
     * Concatenate the remaining strings and push the data.
     * */
    let string = '';
    for (const letter of this.temp) {
      string += letter;
    }
    callback(null, string);
  }
}

module.exports = LineSplitStream;

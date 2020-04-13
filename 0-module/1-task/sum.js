function sum(a, b) {
  if ((typeof a !== 'number' || isNaN(a)) ||
    (typeof b !== 'number' || isNaN(b))) {
    throw new TypeError('Not numbers');
  }
  return a + b;
}

module.exports = sum;

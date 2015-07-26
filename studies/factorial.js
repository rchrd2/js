var helpers = require('./helpers.js');
var assert = helpers.assert;


/**
 * n! = The product of all the integers from 1 to n
 */
var factorial = function(n) {
  if (n == 0) {
    return 1;
  }
  return n * factorial(n - 1);
}

assert(factorial(5) === 120);
assert(factorial(0) === 1);
assert(factorial(1) === 1);

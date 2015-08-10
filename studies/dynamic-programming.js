"use strict";


var memoize = function(func) {
  var memo = {};
  return function() {
    // @todo create actual key based on all arguments
    var arguments_key = arguments[0];
    if( ! memo.hasOwnProperty(arguments_key)) {
      memo[arguments_key] = func.apply(null, arguments);
    }
    return memo[arguments_key]
  };
};

/**
 * By Memoizing fibonacci we create an O(n) solution. Without memoization
 * fibonacci is O(2^n), ie exponential.
 *
 * This is a trivial, but demonstrative example of DP. It breaks a problem
 * into simpler subproblems.
 *
 * @param {Number} n
 * @return {Number} fib(n)
 */
var fibonacci_dp = memoize(function(n) {
  if (n < 2) {
    return 1;
  } else {
    return fibonacci_dp(n - 1) + fibonacci_dp(n - 2);
  };
});


/**
 * Tests
 */
var tests = {
  test_fibonacci_dp: function() {
    var result = fibonacci_dp(10);
    console.assert(result === 55, "Assert fibonacci_dp worked", result);
  },
  run: function() {
    this.test_fibonacci_dp();
  },
};

if (require.main === module) {
  console.log('Running tests');
  tests.run();
}

/**
 * How may ways can you make change?
 *
 * Dynamic programming example
 */


/**
 * http://requiremind.com/memoization-speed-up-your-javascript-performance/
 */
function memoize(fn, resolver) {
  var memoized = function() {
    resolver  = resolver || JSON.stringify;
    var cache = memoized.cache;
    var args  = Array.prototype.slice.call(arguments);
    var key   = resolver.apply(this, args);
    return (key in cache) ? cache[key] : (cache[key] = fn.apply(this, arguments));
  };
  memoized.cache = {};
  return memoized;
}


/** 
 * numberOfWaysToMakeChange
 *
 * This works! 
 *
 * @param {Number} n The number of steps
 * @param {Array<Number>} choices Coin types eg [1, 5, 10, 25])
 */
var numberOfWaysToMakeChange = memoize(function(n, choices) {
  // Base cases
  if (n < 0) {
    return 0;
  } else if (n === 0) {
    return 1;
  } else {
    // Recursion
    // This loop loops over all choices and calls recursion for each choice
    // Hence it's O(|C|^n)
    var sum = 0;
    for (var i = 0; i < choices.length; i++) {
      sum = sum + numberOfWaysToMakeChange(n - choices[i], choices);
    }
    return sum;
  }
});




var test = function() {
  var coins = [1, 5, 10, 25];

  var result = numberOfWaysToMakeChange(5, coins);
  console.log(result);

  var result = numberOfWaysToMakeChange(99, coins);
  console.log(result);
  
  var result = numberOfWaysToMakeChange(999, coins);
  console.log(result);
};
test();
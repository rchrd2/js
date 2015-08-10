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
    var cache = memoized.cache;
    var args  = Array.prototype.slice.call(arguments);
    var key   = args.toString();
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
 * Reference: http://stackoverflow.com/a/17915345/1373318
 *
 * @param {Number} n The number of steps
 * @param {Array<Number>} choices Coin types eg [1, 5, 10, 25])
 */
var numberOfWaysToMakeChange = memoize(function(n, choices, cIdx) {
  cIdx = cIdx === undefined ? choices.length - 1 : cIdx;
  // Base cases
  if (n < 0 || cIdx < 0) {
    return 0;
  } else if (n === 0) {
    return 1;
  } else {
    // Recursion
    return numberOfWaysToMakeChange(n, choices, cIdx - 1)
         + numberOfWaysToMakeChange(n - choices[cIdx], choices, cIdx);
  }
});




var test = function() {
  var coins = [1, 5, 10, 25];

  var result = numberOfWaysToMakeChange(2, coins);
  console.log(result);

  var result = numberOfWaysToMakeChange(10, coins);
  console.log(result);
  
  var result = numberOfWaysToMakeChange(800, coins);
  console.log(result);
};
test();
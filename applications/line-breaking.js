"use strict";

/**
 * Line breaking DP example
 */


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
 * Justify text
 *
 * This is a more complicated dynamic programming problem. It was described in
 * lecture 20 of MIT's Intro to Algorithms. This solution uses DP to optimize
 * aethetics as opposed to a "dumb" solution which, just fits maximum words
 * per line.
 *
 * @param {String} text
 * @param {Number} width
 * @return {String} formatted text
 */
var justify_text = function(text, width) {
  var words = text.split(" ");
  
  // define badness(i, j) for line of words[i:j]
  
  // goal: split words into lines min SUM badness
  
  // 1. subproblem = minimize badness for suffix words [i:]
  // => # subproblems = Theta(n) where n = Number of words
  
  // 2. guessing = where to end first line, say i:j
  // => # choices = n - i = O(n)
  
  // 3. recurrence
  // DP[i] = min(badness (j,j) + DP[j] for j in range (i + 1, n + 1))
  // DP[n] = 0
  // => time per subproblem = Theta(n)
  
  // 4. order: for i = n, n - 1, ..., 1 0
  //    total time = Theta(n^2)
  
  // 5. solution = DP[0]
  
};

/**
 * http://xxyxyz.org/line-breaking
 * @param {Number} width
 */
var justify_text2 = function(text, width) {
  var words = text.split(" ");
  var count = words.length;
  var slack = [];
  for (var i = 0; i < count; i++) {
    slack[i] = [];
    for (var j = 0; j < count; j++) {
      slack[i][j] = 0;
    }
  }
  for (var i = 0; i < count; i++) {
    slack[i][i] = width - words[i].length;
    for (var j = i + 1; j < count; j++) {
      slack[i][j] = slack[i][j - 1] - words[j].length - 1;
    }
  }
  
  var minima = [0];
  var breaks = [];
  for (var i = 0; i < count; i++) {
    // Infinity
    minima.push(Math.pow(10, 20));
    breaks[i] = 0;
  }
  
  console.log(slack);
  
  var cost;
  for (var j = 0; j < count; j++) {
    var i = j;
    while (i >= 0) {
      if (slack[i][j] < 0) {
        cost = Math.pow(10, 10);
      } else {
        cost = minima[i] + Math.pow(slack[i][j], 2);
      }
      if (minima[j + 1] > cost) {
        minima[j + 1] = cost;
        breaks[j] = i;
      }
      i -= 1;
    }
  }
  var lines = [];
  var j = count;
  while (j > 0) {
    var i = breaks[j - 1];
    var suffix = words.slice(i, j).join(' ');
    lines.push(suffix);
    j = i;
  }
  lines.reverse();
  return lines;
};


/**
 * Tests
 */
var tests = {
  test_fibonacci_dp: function() {
    var result = fibonacci_dp(10);
    console.assert(result === 55, "Assert fibonacci_dp worked", result);
  },
  test_justify2: function() {
    var result = justify_text2("the quick brown fox jumps over the lazy dog", 8);
    console.log(result);
  },
  
  run: function() {
    this.test_fibonacci_dp();
    this.test_justify2();
  },
};

if (require.main === module) {
  console.log('Running tests');
  tests.run();
}



/**
 * References:
 * - MIT Intro to Algorithms on Youtube
 * - http://xxyxyz.org/line-breaking
 */
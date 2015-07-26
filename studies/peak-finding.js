"use strict";


// Peak finding from lecture 1 of the mit algorithms class
// Date: Saturday July 18, 2015


/** 
 * Naive implementation does a linear search
 */
var findAPeak1D_naive = function(input) {
  var peak = null;
  for (var i = 0; i < input.length; i++) {
    //console.log(i);
    if (i === 0) {
      if (input[i] >= input[i + 1]) {
        peak = input[i];
        break;
      }
    } else if (i === input.length - 1) {
      if (input[i] >= input[i - 1]) {
        peak = input[i];
        break;
      }
    } else {
      if (input[i] >= input[i - 1] && input[i] >= input[i + 1]) {
        peak = input[i];
        break;
      }
    }
  }
  return peak;
};

/**
 * Binary search approach does a divide and conquer technique
 */
var findAPeak1D_log2N = function(input) {
  //console.log(['findAPeak1D_log2N', input]);
  if (input.length === 0) {
    return null;
  } else if (input.length === 1) {
    return input[0];
  }
  var i = Math.floor(input.length / 2);
  //console.log('i', i);
  var before = i - 1;
  var after = i + 1;
  if (before >= 0 && input[i] < input[before]) {
    // Search left side
    return findAPeak1D_log2N(input.splice(0, i));
  } else if (after < input.length && input[i] < input[after]) {
    // Search right side
    return findAPeak1D_log2N(input.splice(i));
  } else {
    return input[i];
  }
};


/**
 * Find a peak in a 2d array of numbers
 * 
 * Uses the technique where a global maximum in a middle column is found,
 * and then it compares with the cols left or right and then divides
 * and searches there.
 */
var findAPeak2D = function(input) {

  if (input.length === 0) {
    return null;
  }
  
  // Find global maximum in column col
  //var col = Math.floor((input[0].length - 1) / 2);
  //var max_row = null, row;
  //for (row = 0; row < input.length; row++) {
  //  console.log(col, row, input[row][col]);
  //  if (max_row === null) {
  //    max_row = row;
  //  } else if(input[row][col] > input[max_row][col]) {
  //    max_row = row;
  //  }
  //}
  //console.log('max_row', input[max_row][col]);
  
  // Find max col
  // Note: it's better to find max_col, because then array splice on the
  // first array can be used, rather than having to splice each sub-array
  var row = Math.floor((input.length - 1) / 2);
  console.log('row',input.length, row);
  var max_col = null, col;
  for (col = 0; col < input[0].length; col++) {
    if (max_col === null) {
      max_col = col;
    } else if(input[row][col] > input[row][max_col]) {
      max_col = col;
    }
  }
  console.log('max_col', input[row][max_col]);
  
  // Compare with adjacent (above,below) rows
  if (row - 1 > 0 && input[row - 1][max_col] > input[row][max_col]) {
    // above is greater
    return findAPeak2D(input.splice(0, row - 1));
  } 
  if (row + 1 < input.length && input[row + 1][max_col] > input[row][max_col]) {
    // Note: The syntax for splicing is tricky
    return findAPeak2D(input.splice(row + 1));
  } else {
    //return [ row, max_col ];
    return input[row][max_col];
  }
};

var assert = function(expression, name) {
  if ( ! expression) {
    console.log('** Assertion failed', name)
  }
}


// 1d tests

var a1d1 = [ 0, 1, 2, 7, 4, 5, 1, 7, 3 ];
var a1d2 = [];
for (var i = 0; i < 1000; i++) {
  a1d2[i] = Math.floor(Math.random() * 100000);
}

assert(findAPeak1D_naive(a1d1) === 7, 'findAPeak1D_naive');
assert(findAPeak1D_naive(a1d2) !== null, 'findAPeak1D_naive');
assert(findAPeak1D_log2N(a1d1) === 7, 'findAPeak1D_log2N');
assert(findAPeak1D_log2N(a1d2) !== null, 'findAPeak1D_log2N');

// 2d tests

var a2d1 = [ 
  [0, 1, 2, 3, 4],
  [5, 6, 6, 7, 2],
  [1, 2, 3, 8, 5],
  [6, 17, 8, 9, 10],
];

var a2d2 = [];
for (var i = 0; i < 1000; i++) {
  a2d2[i] = [];
  for (var j = 0; j < 1000; j++) {
    a2d2[i].push(Math.floor(Math.random() * 100000));
  }
}


assert(findAPeak2D(a2d1) === 17, 'findAPeak2D');
assert(findAPeak2D(a2d2) !== null, 'findAPeak2D a2d2');

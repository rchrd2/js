"use strict";

/**
 * Bubble sort is basic sorting algorithm
 * It has a worst case and average complexity of O(n^2)
 * It has a best complexity of O(n)
 *
 * https://en.wikipedia.org/wiki/Bubble_sort
 */
var bubbleSort = function(m) {
  if (m.length <= 1) {
    return m;
  }
  var unsorted_length = m.length;
  var tmp, swapped;
  do {
    swapped = false;
    for (var i = 1; i <  unsorted_length; i++) {
      if (m[i - 1] > m[i]) {
        tmp = m[i];
        m[i] = m[i - 1];
        m[i - 1] = tmp;
        tmp = null;
        swapped = true;
      }
    }
    // This is an optimization. We know the last element
    // is sorted so we don't bother comparing with it
    unsorted_length = unsorted_length - 1;
  } while (swapped == true) 
  return m;
};


/**
 * Helper function 
 */
var assert = function(expression, name) {
  if ( ! expression) {
    console.log('** Assertion failed', name || '')
  }
}


/**
 * Tests
 */
var a1 = [5,4,3,6,7,1,2,8,9];
a1 = bubbleSort(a1);
console.log(a1);
// Use toString() to compare arrays 
assert(a1.toString() === [1,2,3,4,5,6,7,8,9].toString(), 'Test it is sorted');

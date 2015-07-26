"use strict";

/** 
 * Insertion sort
 */
Array.prototype.insertionSort = function() {
  // iterate from key 1 (not 0) to length - 1
  // compare with previous value, and swap until no swap
  // increment key
  for (var key = 1; key < this.length; key++) {
    // A bit strange to see this type of logic in a for-loop, but it
    // makes sense
    for (var swap_key = key; this[swap_key] < this[swap_key - 1]; swap_key--) {
      var temp = this[swap_key];
      this[swap_key] = this[swap_key - 1];
      this[swap_key - 1] = temp;
    }
  }
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
a1.insertionSort();
console.log(a1);
// Use toString() to compare arrays 
assert(a1.toString() === [1,2,3,4,5,6,7,8,9].toString(), 'Test it is sorted');

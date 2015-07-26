"use strict";

/**
 * O(nlogn)
 * Needs extra space for lists
 *
 * And this implementation usesuncessary slicing. When memory could have been
 * saved with offsets 
 */
var mergeSort = function(m) {
  // split in halfs until just 1 number
  if (m.length <= 1) {
    return m;
  } 
  
  // Divide list into two equal lists
  var middle = Math.floor(m.length / 2);
  
  // Recursively sort both sides
  var left = m.slice(0, middle)
  var right = m.slice(middle);
  
  left = mergeSort(left);
  right = mergeSort(right);
  
  // Then merge both lists
  return mergeSortMerge(left, right);
};

/**
 * This is the helper function that merges two sorted arrays in sorted order
 */
var mergeSortMerge = function(left, right) {
  var merged = [];
  var lFinger = 0;
  var rFinger = 0;

  while (lFinger < left.length || rFinger < right.length) {

    if (rFinger >= right.length) {
      // Only left values are left
      while (lFinger < left.length) {
        merged.push(left[lFinger]);
        lFinger++;
      }
    } else if (lFinger.length >= left.length) {
      // Only right values are left
      // Only left values are left
      while (rFinger < right.length) {
        merged.push(right[rFinger]);
        rFinger++;
      }
    } else {
      // Both a left and a right value are left

      if (left[lFinger] <= right[rFinger]) {
        merged.push(left[lFinger]);
        lFinger++;
      } else {
        merged.push(right[rFinger]);
        rFinger++;
      }
    }
  }
  console.log(merged);
  return merged;
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
a1 = mergeSort(a1);
console.log(a1);
// Use toString() to compare arrays 
assert(a1.toString() === [1,2,3,4,5,6,7,8,9].toString(), 'Test it is sorted');

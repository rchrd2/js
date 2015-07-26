"use strict";

var haystack = [
  1,
  2,
  3,
  5,
  10,
];


Array.prototype.binarySearch = function(needle) {
  //console.log('binarySearch');
  //console.log(this);
  //console.log(this.length);
  //console.log(this[0]);
  //console.log(needle);
  //console.log(this[0] === needle);
  
  
  if (this.length === 0 || (this.length === 1 && this[0] !== needle)) {
    //console.log('here');
    return false;
  }
  
  var idx = Math.floor(this.length / 2);
  //console.log(this.length, idx);
  
  if (this[idx] === needle) {
    return true;
  } else if (needle < this[idx]) {
    // Note: Don't confuse array.slice with array.splice. The latter is 
    // destructive to the array!
    return Array.prototype.binarySearch.call(this.slice(0, idx), needle);
  } else {
    return Array.prototype.binarySearch.call(this.slice(idx), needle);
  }
};

var assert = function(expression, name) {
  if ( ! expression) {
    console.log('** Assertion failed', name || '')
  }
}

//console.log('** 10', haystack);
assert(haystack.binarySearch(10) === true, 'Search for 10');
//console.log('** 3', haystack);
assert(haystack.binarySearch(3) === true, 'Search for 3');
assert(haystack.binarySearch(666) === false, 'Search for 666');
assert(haystack.binarySearch(1) === true, 'Search for 1');
assert(haystack.binarySearch(0) === false, 'Search for non-existing');
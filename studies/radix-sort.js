"use strict";

/**
 * Radix sort
 */


/**
 * Function radixSort
 *
 * This implementation uses queues.
 *
 * @param {values} an array of integers
 * @return {null} sorts the input in place
 */
var radixSort = function(values) {
  var radix = 10;
  // Instantiate 10 buckets
  var buckets = [ [], [], [], [], [], [], [], [], [], [] ];
  var idx;
  var power;
  for (var i = 0; i < radix; i++) {
    // Do a stable sort to sort array `values` on digit i
    power = Math.pow(radix, i);
    // Insert into buckets
    for (var j = 0; j < values.length; j++) {
    //var j = values.length;
    //while (j--) {
      // > Math.floor( 123 / Math.pow(10, 1) % 10 ) 
      // 2
      idx = Math.floor(values[j] / power % radix);
      buckets[idx].push(values[j]);
    };
    
    // Copy out of buckets
    idx = 0;
    for (var j = 0; j < buckets.length; j++) {
      while (buckets[j].length > 0) {
        values[idx] = buckets[j].shift();
        idx++;
      }
    }
    //console.log(values);
  }
};




/**
 * Function radixSortBitwise
 *
 * Another implementation that uses bitwise operators. 
 * JavaScript bitwise operations operate on 32bit integers
 *
 * @param {values} an array of integers
 * @return {null} sorts the input in place
 */
var radixSortBitwise = function(values) {
  var bits = 32;
  var digit_size = 4; // 4, 2
  var digit_mask = 0xF; // 0xF, 0x7
  // Instantiate 16 buckets
  var buckets = [];
  for (var i = 0; i < (digit_size * 8); i++) {
    buckets[i] = [];
  }
  var idx;
  for (var bit_shift = 0; bit_shift < bits; bit_shift += digit_size) {
    // Do a stable sort to sort array `values` on digit i
    
    // Insert into buckets
    for (var j = 0; j < values.length; j++) {
      // > Number(0xABCDEF >> 4 & 0xF).toString(16)
      // 'e'
      idx = values[j] >> bit_shift & digit_mask;
      //console.log(values[j], idx);
      buckets[idx].push(values[j]);
    };
    
    // Copy out of buckets
    idx = 0;
    for (var j = 0; j < buckets.length; j++) {
      while (buckets[j].length > 0) {
        values[idx] = buckets[j].shift();
        idx++;
      }
    }
    //console.log(values);
  }
};


/** 
 * I did not write this code. 
 * I pulled it from https://gist.github.com/blairmitchelmore/1929681
 */
var inplaceRadixSort = function(values) {
  // Figure out the number of binary digits we're dealing with
  var k = Math.max.apply(null, values.map(function(i) {
    return Math.ceil(Math.log(i)/Math.log(2));
  }));

  for (var d = 0; d < k; ++d) {
    for (var i = 0, p = 0, b = 1 << d, n = values.length; i < n; ++i) {
      var o = values[i];
      if ((o & b) == 0) {

        // RC: I believe splicing can be very expensive. 
        // At worst it can cost O(n) from each splice. 
        // I tried running this with a large array of 100,000 items, 
        // and it basically never finishes (I killed it after a minute).
        // Value swapping may have been a more efficient choice.

        // this number is a 0 for this digit
        // move it to the front of the list
        nums.splice(p++, 0, nums.splice(i, 1)[0]);
      }
    }
  }
};

/**
 * Tests
 */

var tests = {
  test_simple: function() {
    var input = [ 54321, 10, 4321, 21, 321 ];
    var expected = [ 10, 21, 321, 4321, 54321 ];
    radixSort(input);
    //console.log(input);
    console.assert(input.toString() == expected.toString());
  },
  
  test_generated: function() {
    var randomValues = [];
    var size = 100000;
    for (var i = 0; i < size; i++) {
      randomValues.push(Math.floor(Math.random() * size));
    }
    // this clones the array and sorts using built-in sort
    var expected = randomValues.slice(0);
    expected.sort(function(a, b) { return a - b });
    
    // Run radix sort and compare
    console.log('begin radixSort', size);
    radixSort(randomValues);
    console.log('done');
    console.assert(randomValues.toString() == expected.toString());
  },

  test_bitwise_simple: function() {
    var input = [ 54321, 10, 4321, 21, 321 ];
    var expected = [ 10, 21, 321, 4321, 54321 ];
    radixSortBitwise(input);
    console.log(input);
    console.assert(input.toString() == expected.toString());
  },
  
  test_bitwise_generated: function() {
    var randomValues = [];
    var size = 100000;
    for (var i = 0; i < size; i++) {
      randomValues.push(Math.floor(Math.random() * size));
    }
    // this clones the array and sorts using built-in sort
    var expected = randomValues.slice(0);
    expected.sort(function(a, b) { return a - b });
    
    // Run radix sort and compare
    console.log('begin radixSortBitwise', size);
    radixSortBitwise(randomValues);
    console.log('done');
    console.assert(randomValues.toString() == expected.toString());
  },
  
  test_inplace_radixsort_generated: function() {
    var randomValues = [];
    var size = 100000;
    for (var i = 0; i < size; i++) {
      randomValues.push(Math.floor(Math.random() * size));
    }
    // this clones the array and sorts using built-in sort
    var expected = randomValues.slice(0);
    expected.sort(function(a, b) { return a - b });
    
    // Run radix sort and compare
    console.log('begin inplaceRadixSort', size);
    inplaceRadixSort(randomValues);
    console.log('done');
    console.assert(randomValues.toString() == expected.toString());
  },

  run: function() {
    this.test_simple();
    this.test_bitwise_simple();

    // Strangely, the order of these calls changes performance.
    // The first call is slow, and the second one finishes nearly instantly
    this.test_generated();
    this.test_bitwise_generated();

    //this.test_inplace_radixsort_generated();
  },
};

tests.run();


/**  
 * References:
 * 
 * - http://www.geekviewpoint.com/python/sorting/radixsort
 * - http://www.algorithmdemos.com/sorting/radixSort.html
 */
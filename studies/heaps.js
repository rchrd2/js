"use strict";

var helpers = require('./helpers.js');
var assert = helpers.assert;

/**
 * Heaps
 *
 * A heap is a specialized tree-based abstract data type that satisfies the heap
 * property: If A is a parent node of B then the key of node A is ordered with
 * respect to the key of node B with the same ordering applying across the heap.
 * (https://en.wikipedia.org/wiki/Heap_(data_structure))
 *
 * When a heap is neither a max heap or a min heap, the following is the only
 * thing that distinguishes it from a binary tree:
 * 
 * On top of the previous answers, the heap must have the heap structure 
 * property; the tree must be nearly complete, and the bottom most layer, which 
 * cannot always be full, must be filled leftmost to rightmost with no gaps.
 */


/**
 * Abstract interface 
 */
var AbstractHeap = function() { console.log('AbstractHeap Constructor'); };
AbstractHeap.prototype = {
  constructor: AbstractHeap,
  isHeap: true,
  
  // Interface
  insert: function(key) { throw "Not implemented"; },
  remove: function(key) { throw "Not implemented"; },
  search: function(key) { throw "Not implemented"; },
  heapify: function(keys) { throw "Not implemented"; },
  size: function() { throw "Not implemented"; },
  isEmpty: function() { throw "Not implemented"; },
  clear: function() { throw "Not implemented"; },
}

// =============================================================================

/**
 * Array-based heap (neither a max or min heap)
 *
 * Tree representing an array
 * root of tree: first element (i =1)
 * parent(i): i / 2
 * left: 2i
 * right: 2i + 1
 */
var HeapArray = function() {
  this.data = [];
};
HeapArray.prototype = Object.create(AbstractHeap.prototype);
var props = {
  // Prefer object syntax over assigning values to prototype
  data: null,
  insert: function(key) {
    this.data.push(key);
  },
  remove: function(key) {
    // Javascript's splice does this for us
    var idx = this.data.indexOf(key);
    if (idx >= 0) {
      return this.data.splice(idx, 1);
    }
  },
  search: function(key) {
    return this.data.indexOf(key) >= 0;
  },
  heapify: function(keys) {
    // Appends the keys.
    for (var i = 0; i < keys.length; i++) {
      this.insert(keys[i]);
    }
  },
  size: function() {
    return this.data.length;
  },
  isEmpty: function() {
    return this.data.length == 0;
  },
  clear: function() {
    this.data = [];
  },
  swap: function(i1, i2) {
    var tmp = this.data[i1];
    this.data[i1] = this.data[i2];
    this.data[i2] = tmp;
  },
};
for (var prop in props) {
  HeapArray.prototype[prop] = props[prop];
}
props = null;

// =============================================================================

/**
 * Max Heap 
 *
 * The key of a node is >= the keys of its children
 *
 * Want to be able to run extract-max over and over
 *
 * If you can write extract-max in an efficient way, you have an amazing
 * sorting algorithm.
 *
 * Representation invariant of the max-heap property
 */
var MaxHeap = function() {
  HeapArray.prototype.constructor.apply(this, arguments);
};
MaxHeap.prototype = Object.create(HeapArray.prototype);
var props = {
  /**
   * Corrects the values to be a max heap
   * 
   * Incidently, it is O(n)
   *
   * More info:
   * http://www.cs.toronto.edu/~krueger/cscB63h/w07/lectures/tut02.txt
   */
  buildMaxHeap: function() {
    var heap_size = this.size();
    var half = Math.floor(heap_size / 2);
    for (var idx = half; idx > 0; idx--) {
      this.maxHeapify(idx);
    }
  },
  
  /**
   * Correct a single violation of the HEAP PROPERTY in a subtree's root
   *
   * - Assume the trees rooted at left(i) and right(i) are max heaps
   * - Work bottom up
   * - idx is a 1-based index.
   * - maxHeapify is O(lgN)
   */
  maxHeapify: function(idx) {
    var heap_size = this.size();
    var lidx = idx * 2;
    var ridx = idx * 2 + 1;
    // Find the largest of the 3 values
    var largest = idx;
    if (lidx <= heap_size && this.data[lidx - 1] > this.data[largest - 1]) {
      largest = lidx;
    }
    if (ridx <= heap_size && this.data[ridx - 1] > this.data[largest - 1]) {
      largest = ridx;
    }
    if (largest !== idx) {
      this.swap(idx - 1, largest - 1);
      // Recurse down to correct any new violations
      this.maxHeapify(largest);
    }
  },
  
  /**
   * Have to call buildMaxHeap after every insert to keep rep-variant true
   */
  insert: function(key) {
    HeapArray.prototype.insert.apply(this, [key]);
    // Maybe this call to buildMaxHeap is inefficient?
    //this.buildMaxHeap();
    
    // This is the way to walk up the tree swapping when necessary
    var j = this.data.length;
    while (j != 1 && this.data[j - 1] > this.data[ Math.floor(j / 2) - 1]) {
      this.swap(j - 1, Math.floor(j / 2) - 1);
      j = Math.floor(j / 2);
    }
  },

};
for (var prop in props) {
  MaxHeap.prototype[prop] = props[prop];
}
props = null;

// =============================================================================

/**
 * Min Heap 
 *
 * The key of a node is <= the keys of its children
 */
var MinHeap = function() {};
MinHeap.prototype = Object.create(AbstractHeap.prototype);

// =============================================================================

/**
 * Heap-based priority queue
 * 
 * Implements a set S of elements, each of elements associeted with a key
 *
 * These methods could probably be moved to the max-heap
 */
var PriorityQueue = function() {
  // TODO figure out how to call parents
  //MaxHeap.prototype.constructor.apply(this, arguments);
  this.data = [];
};
PriorityQueue.prototype = Object.create(MaxHeap.prototype);
var props = {
  max: function() {
    return this.data[0];
  },
  /**
   * Not only returns the element with the largest key, but also removes it.
   */
  extractMax: function() {
    if (this.isEmpty()) {
      return null;
    } else {
      var max = this.data[0];
      // Move last element to be the first and run max-heapify
      this.data[0] = this.data.pop();
      this.maxHeapify(1);
      return max;
    }
  },
  /**
   * Increase the value of x's key to the new value of k
   */
  increaseKey: function(idx, k) {
    this.data[idx] = k;
    this.maxHeapify(idx);
  },
};
for (var prop in props) {
  PriorityQueue.prototype[prop] = props[prop];
}
props = null;

// =============================================================================

/**
 * Heap Sort Algorithm
 * 
 * Simply utilizes a max heap and runs extractMax() over and over again
 * Even still, it is efficient 
 *
 * The way it's implemented here, it requires an extra array. I believe there's 
 * a way to do it all in place using the array itself as the data source for the
 * max-heap. 
 *
 * http://www.cs.mcgill.ca/~cs203/lectures/lecture10/sld028.htm
 */
var HeapSort = function(ar) {
  var pq = new PriorityQueue();
  pq.heapify(ar);
  var sorted = [];
  for (var i = ar.length - 1; i >= 0; i--) {
    sorted[i] = pq.extractMax();
  }
  return sorted;
};


// =============================================================================
// = TESTS                                                                     =
// =============================================================================

// Generic tests that should work for all heap types

var abstractHeapTests = function(heap) {
  heap.clear();
  heap.heapify([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
  console.assert(heap.size() == 16, "Heap size is not 16: " + heap.size());
  console.assert(heap.search(10) == true, "Assert Heap has 10");
  heap.remove(10);
  console.assert(heap.search(10) == false, "Assert 10 not found");
  heap.clear();
};


// Test HeapArray
var heapArray = new HeapArray();
abstractHeapTests(heapArray);
heapArray.heapify([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);

// Test Max Heap
var maxHeap = new MaxHeap();
console.log(maxHeap.isHeap);
abstractHeapTests(maxHeap);
maxHeap.heapify([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
console.log(maxHeap.data);
var desired = [ 14, 9, 13, 6, 8, 10, 12, 0, 3, 2, 7, 1, 5, 4, 11 ];
console.assert(maxHeap.data.toString() == desired.toString(), "max heap worked");

// Test Priority Queue
var priorityQueue = new PriorityQueue();
priorityQueue.heapify([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
console.log(priorityQueue.data);
var max = priorityQueue.extractMax();
console.log(max);
console.assert(max == 14, "max is 14");
console.log(priorityQueue.data);

// Test HeapSort
var a1 = [1,0,2,9,4,8,5,7,6];
var a1_sorted = HeapSort(a1);
console.log(a1_sorted);

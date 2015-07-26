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
      return this.data.splice(idx);
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
  MaxHeap.prototype.constructor.apply(this, arguments)
};
MaxHeap.prototype = Object.create(HeapArray.prototype);
var props = {
  /**
   * http://www.cs.toronto.edu/~krueger/cscB63h/w07/lectures/tut02.txt
   * MODIFIED TO USE 0-BASED index instead of 1-based
   */
  buildMaxHeap: function() {
    var heap_size = this.size();
    var half = Math.floor(heap_size / 2) - 1;
    for (var idx = half; idx >= 0; idx--) {
      this.maxHeapify(idx);
    }
  },
  
  /**
   * Correct a single violation of the HEAP PROPERTY in a subtree's root
   *
   * Assume the trees rooted at left(i) and right(i) are max heaps
   *
   * Work bottom up
   * 
   * idx is a 1-based index.
   */
  maxHeapify: function(idx) {
    var heap_size = this.size();
    var lidx = (idx) * 2 + 1;
    var ridx = (idx) * 2 + 2;
    var largest = idx;
    if (lidx < heap_size && this.data[lidx] > this.data[idx]) {
      largest = lidx;
    }
    if (ridx < heap_size && this.data[ridx] > this.data[idx]) {
      largest = ridx;
    }
    if (largest !== idx) {
      this.swap(idx , largest );
      // Recurse down to correct any new violations
      this.maxHeapify(largest);
    }
  },
  
  insert: function(key) {
    HeapArray.prototype.insert.apply(this, [key]);
    // Have to call buildMaxHeap after every insert to keep rep-variant true
    this.buildMaxHeap();
  },

};
for (var prop in props) {
  MaxHeap.prototype[prop] = props[prop];
}
props = null;

// =============================================================================

///**
// * Tree-based max heap
// *
// * The key of a node is >= the keys of its children
// *
// * This is trickier than the array-based approach
// */
//var HeapTreeNode = function(key) {
//  this.left = null;
//  this.right = null;
//  this.key = key || null;
//};
//var MaxHeapTree = function() {
//  this.root = null;
//};
//MaxHeapTree.prototype = Object.create(AbstractHeap.prototype);
//var props = {
//  insert: function(key) {
//    var insertNode = function(root, node) {
//      if (root.left === null) {
//        root.left = new HeapTreeNode(key);
//      } else if (root.right === null) {
//        root.right = new HeapTreeNode(key);
//      } else {
//        // recurse down left
//        insertNode(root.left, node);
//      }
//    };
//    var node = new HeapTreeNode(key);
//    if (this.root === null) {
//      this.root = node;
//    } else {
//      insertNode(this.root, node);
//    }
//  },
//  
//  // TODO
//  remove: function(key) {
//    var removeNode = function(root, key) {
//      var node;
//      if (root === null) {
//        node = null;
//      } else if (root.key === key) {
//        // Case 1: No children
//        if (root.left === null && root.right === null) {
//          node = null;
//        }
//
//        // Case 2: One child
//        else if (root.right !== null) {
//          root = root.right;
//        } else if (root.left !== null) {
//          root = root.left;
//        }
//
//        // Case 3: Two Children
//        else {
//          // 
//          node.value = temp_node.value;
//          node.right = removeNode(newnode.right, temp_node.value);
//        }
//
//      }
//    };
//    removeNode(this.root, key);
//  },
//  
//  search: function(key) {
//    // Breadth first search
//    var queue = [this.root];
//    var found = false;
//    var node;
//    while (node = queue.shift()) {
//      //console.log(node.key);
//      if (node.key === key) {
//        // Found it!
//        found = true;
//        break;
//      }
//      
//      if (node.left !== null) {
//        queue.push(node.left);
//      }
//      
//      if (node.right !== null) {
//        queue.push(node.right);
//      }
//    }
//    return found;
//  },
//  heapify: function(keys) {
//    for (var i = 0; i < keys.length; i++) {
//      this.insert(keys[i]);
//    }
//  },
//  size: function() {
//    var count = 0;
//    var queue = [this.root];
//    var node;
//    while (node = queue.shift()) {
//      count = count + 1;
//      if (node.left !== null) {
//        queue.push(node.left);
//      }
//      if (node.right !== null) {
//        queue.push(node.right);
//      }
//    }
//    return count;
//  },
//  height: function() {
//    var nodeSize = function(node) {
//      if (node === null) {
//        return 0;
//      }
//      var lHeight = nodeSize(node.left);
//      var rHeight = nodeSize(node.right);
//      var height = 1 + Math.max(lHeight, rHeight);
//      return height;
//    };
//    return nodeHeight(this.root);
//  },
//  isEmpty: function() {
//    return this.root === null;
//  },
//  clear: function() {
//    this.root = null;
//  },
//};
//for (var prop in props) {
//  MaxHeapTree.prototype[prop] = props[prop];
//}
//props = null;

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
 * Heap Sort Algorithm
 */
var HeapSort = function() {};
HeapSort.prototype = Object.create(AbstractHeap.prototype);

// =============================================================================

/**
 * Heap-based priority queue
 * 
 * Implements a set S of elements, each of elements associeted with a key
 */
var PriorityQueue = function() {};
PriorityQueue.prototype = Object.create(AbstractHeap.prototype);
PriorityQueue.prototype.max = function() {
  
};

PriorityQueue.prototype.extractMax = function() {
  
}
PriorityQueue.prototype.increaseKey = function(key, val) {
  
}

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




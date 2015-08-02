"use strict";

/**
 * Binary tree data structure example 
 *
 * Note, that it is different than a Binary Search Tree which maintains
 * a special order.
 */

var BinaryTree = function() {
  this.root = null;
}
BinaryTree.prototype = {
  // restore constructor
  constructor: BinaryTree,
  
  isEmpty: function() {
    return this.root === null;
  },
  
  makeEmpty: function() {
    this.root = null;
  },
  
  /**
   * Get the H of the tree
   * TODO A tree consisting of only a root node has a height of 0. 
   */
  height: function() {
    return this._getNodeHeight(this.root);
  },
  
  /**
   * Helper function for recursion
   * If we didn't have separate BinaryTree and BinaryTreeNode 
   * classes, then a separate function wouldn't be needed.
   *
   * Note. Everytime it recurses it basically adds 1. as it traverses
   *   down the tree it tallys the height
   */
  _getNodeHeight: function(node) {
    if (node == null) {
      return 0;
    }
    var lHeight = this._getNodeHeight(node.left);
    var rHeight = this._getNodeHeight(node.right);
    var height = 1 + Math.max(lHeight, rHeight);
    return height;
  },
};



var BinaryTreeNode = function(item) {
  // properties
  this.item = item || null;
  this.left = null;
  this.right = null;
}
BinaryTreeNode.prototype = {
  constructor: BinaryTreeNode,
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

// Create tree
var bt = new BinaryTree();

// Create node
var root = new BinaryTreeNode('foo');

assert(bt.isEmpty() === true);

// Assign root
bt.root = root;

// Create children
bt.root.left = new BinaryTreeNode('bar');
bt.root.right = new BinaryTreeNode('baz');
bt.root.left.left = new BinaryTreeNode('hello');

assert(bt.isEmpty() === false);

console.log(bt.height());
assert(bt.height() === 3);

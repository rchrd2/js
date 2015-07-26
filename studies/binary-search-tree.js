"use strict";

/**
 * A feable attempt at a BinarySearchTree
 * 
 * Helper: 
 *   - https://www.youtube.com/watch?v=gcULXE7ViZw
 *   - https://gist.github.com/mycodeschool/9465a188248b624afdbf
 */

var BinarySearchTreeNode = function(value, left, right) {
  this.value = value || null;
  this.left = left || null;
  this.right = right || null;
  // Note you can have the parent as well.
};
BinarySearchTreeNode.prototype = {
  constructor: BinarySearchTreeNode,
};

var BinarySearchTree = function(root) {
  this.root = root || null;
};
BinarySearchTree.prototype = {
  constructor: BinarySearchTree,
  /**
   * Add adds a value 
   */
  insert: function(value) {
    var insertHelper = function(node, value) {
      if (value < node.value) {
        if (node.left === null) {
          node.left = new BinarySearchTreeNode(value);
        } else {
          insertHelper(node.left, value);
        }
      } else if (value > node.value) {
        if (node.right === null) {
          node.right = new BinarySearchTreeNode(value);
        } else {
          insertHelper(node.right, value);
        }
      } else if (value === node.value) {
        return;
      }
    };
    
    if (this.root === null) {
      this.root = new BinarySearchTreeNode(value);
    } else {
      insertHelper(this.root, value);
    }
  },

  remove: function(value) {
    var removeNode = function(node, value) {
      if (node === null) {
        return null;
      } else if (value < node.value) {
        var result = removeNode(node.left, value);
        node.left = result;
      } else if (value > node.value) {
        var result = removeNode(node.right, value);
        node.right = result;
      } else {
        // Wohoo... I found you, Get ready to be deleted
        // Case 1: No child
        if (node.left === null && node.right === null) {
          node = null;
        }
        
        // Case 2: One Child
        else if (node.right !== null) {
          node = node.right;
        } else if (node.left !== null) {
          node = node.left;
        }
        
        // Case 3: Two Children
        else {
          var temp_node = this.findMin(node.right);
          node.value = temp_node.value;
          node.right = removeNode(newnode.right, temp_node.value);
        }
      }
      return node;
    };
    return removeNode(this.root, value);
  },
  
  /**
   * Recursive find Min example
   */
  findMin: function(node) {
    var findNodeMin = function(node) {
      if (node === null) {
        return null;
      } else if (node.left !== null) {
        return findNodeMin(node.left);
      } else {
        return node;
      }
    };
    node = node || this.root;
    return findNodeMin(node);
  },
  
  /**
   * Non-recursive find max example
   */
  findMax: function(node) {
    node = node || this.root;
    while (node.right !== null) {
      node = node.right;
    }
    return node;
  },
  
  /**
   * Divide and conquer search
   */
  search: function(value) {
    var searchNode = function(node, value) {
      if (node === null) {
        return false;
      }
      if (node.value === value) {
        return node;
      } else if (value < node.value) {
        return searchNode(node.left, value);
      } else if (value > node.value) {
        return searchNode(node.right, value);
      }
    };
    return searchNode(this.root, value);
  },
  isEmpty: function() {
    return this.root === null;
  },
  
  /**
   * Recursive height method
   */
  height: function() {
    var nodeHeight = function(node) {
      if (node === null) {
        return 0;
      }
      var lHeight = nodeHeight(node.left);
      var rHeight = nodeHeight(node.right);
      return 1 + Math.max(lHeight, rHeight);
    };
    return nodeHeight(this.root);
  },
  
  /** 
   * Breadth first traversal toString()
   */
  toString: function() {
    return JSON.stringify(this, null, 2);
    
    // Notes:
    // num of leaves is up to 2^h 
    // go top down and print
    // visit levels i breadth-first order
    var output = "";
    
    // Queue is needed for BFT
    var queue = [];
    if (this.root !== null) {
      queue.push([this.root, 0, 1]);
    }
    var h = this.height();
    
    var row, node, level, lr;
    while (row = queue.shift()) {
      node = row[0];
      level = row[1];
      lr = row[2];
      
      // Work on node
      //console.log(level, h);
      // I attempted to print the tree indented, but this did not work 
      // correctly
      //var indent = 40 + (40 * ((level) / h) - node.value.length * .5) * lr;
      
      var indent = level;
      
      for (var i = 0; i < indent; i++) {
        output += " ";
      }
      output += node.value + "\n";
      
      // Queue children
      if (node.left !== null) {
        queue.push([node.left, level + 1, -1]);
      } 
      if (node.right !== null) {
        queue.push([node.right, level + 1, 1]);
      }
    }
    return output;
  }
  
};

var createBSTFromArray = function(vals) {
  var bst = new BinarySearchTree();
  for (var i = 0; i < vals.length; i++) {
    bst.insert(vals[i]);
  }
  return bst;
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
var bst = new BinarySearchTree();

assert(bst.isEmpty() === true);
assert(bst.height() === 0);

bst.insert('foo');

assert(bst.isEmpty() === false);
assert(bst.root.value == 'foo');
assert(bst.height() === 1);
assert(bst.search('foo') !== false);
assert(bst.search('asdf') === false);


bst.insert('bar');
bst.insert('Alfred');
bst.insert('Barney');
bst.insert('Chris');
bst.insert('Alexia');

console.log(bst.toString());

//bst.remove('foo');

bst.remove('Barney');
console.log(bst.toString());
//JSON.stringify(bst, null, 2)

assert(bst.search('Alexia') !== false);
assert(bst.search('Chris') !== false);


var bst2 = createBSTFromArray([1,5,3,6,4,7,9,8]);
console.log(bst2.toString());

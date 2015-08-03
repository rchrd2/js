"use strict";

/**
 * A feable attempt at a BinarySearchTree
 * 
 * Helper: 
 *   - https://www.youtube.com/watch?v=gcULXE7ViZw
 *   - https://gist.github.com/mycodeschool/9465a188248b624afdbf
 */

var BinarySearchTreeNode = function(val, left, right) {
  this.val = val || null;
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
   * Add adds a val 
   */
  insert: function(val) {
    var insertHelper = function(node, val) {
      if (val < node.val) {
        if (node.left === null) {
          node.left = new BinarySearchTreeNode(val);
        } else {
          insertHelper(node.left, val);
        }
      } else if (val > node.val) {
        if (node.right === null) {
          node.right = new BinarySearchTreeNode(val);
        } else {
          insertHelper(node.right, val);
        }
      } else if (val === node.val) {
        return;
      }
    };
    
    if (this.root === null) {
      this.root = new BinarySearchTreeNode(val);
    } else {
      insertHelper(this.root, val);
    }
  },

  /**
   * Remove node (helper function. See bst.remove)
   */
  removeNode: function(node, val) {
    
    if (node === null) {
      return null;
    } else if (val < node.val) {
      var result = this.removeNode(node.left, val);
      node.left = result;
    } else if (val > node.val) {
      var result = this.removeNode(node.right, val);
      node.right = result;
    } else {
      // Wohoo... I found you, Get ready to be deleted
      var is_root = node == this.root;

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
        node.val = temp_node.val;
        node.right = this.removeNode(newnode.right, temp_node.val);
      }
      
      if (is_root) {
        this.root = node;
      }
    }
    
    return node;
  },

  remove: function(val) {
    return this.removeNode(this.root, val);
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
  search: function(val) {
    var searchNode = function(node, val) {
      if (node === null) {
        return false;
      }
      if (node.val === val) {
        return node;
      } else if (val < node.val) {
        return searchNode(node.left, val);
      } else if (val > node.val) {
        return searchNode(node.right, val);
      }
    };
    return searchNode(this.root, val);
  },
  isEmpty: function() {
    return this.root === null;
  },
  
  /**
   * Recursive height method
   * TODO A tree consisting of only a root node has a height of 0. 
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
      //var indent = 40 + (40 * ((level) / h) - node.val.length * .5) * lr;
      
      var indent = level;
      
      for (var i = 0; i < indent; i++) {
        output += " ";
      }
      output += node.val + "\n";
      
      // Queue children
      if (node.left !== null) {
        queue.push([node.left, level + 1, -1]);
      } 
      if (node.right !== null) {
        queue.push([node.right, level + 1, 1]);
      }
    }
    return output;
  },
  
  /**
   * Helper that prints graphviz compatable output (cool!)
   */
  graphviz: function() {
    //digraph BST {
    //15 -> 6
    //15 -> 18
    //18 -> 17
    //}
    
    var template = "digraph BST { {{DATA}} }";
    var data_points = [];
    var queue = [];
    var null_count = 0;
    if ( ! this.isEmpty()) {
      //data_points.push("Tree -> " + this.root.val);
      queue.push(this.root);
      var node;
      while (node = queue.shift()) {
        var label = [
              node.val, 
            ].join(" ");
        data_points.push(node.val + " [label=\"" + label + "\" ];");
        if (node.left) {
          data_points.push(node.val + " -> " + node.left.val + ";");
          queue.push(node.left);
        } else {
          data_points.push("null" + null_count + " [shape=point];")
          data_points.push(node.val + " -> null" + null_count + ";");
          null_count = null_count + 1;
        }
        if (node.right) {
          data_points.push(node.val + " -> " + node.right.val + ";");
          queue.push(node.right);
        } else {
          data_points.push("null" + null_count + " [shape=point];")
          data_points.push(node.val + " -> null" + null_count + ";");
          null_count = null_count + 1;
        }
      }
    }
    var output = template.replace("{{DATA}}", data_points.join(" "));
    return output;
  },
  
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
assert(bst.root.true == 'foo');
assert(bst.height() === 1);
assert(bst.search('foo') !== false);
assert(bst.search('asdf') === false);


bst.insert('bar');
bst.insert('Alfred');
bst.insert('Barney');
bst.insert('Chris');
bst.insert('Alexia');

console.log(bst.graphviz());

console.log(bst.toString());

//bst.remove('foo');

bst.remove('foo');

console.log(bst.graphviz());

console.log(bst.toString());
//JSON.stringify(bst, null, 2)

assert(bst.search('Alexia') !== false);
assert(bst.search('Chris') !== false);


var bst2 = createBSTFromArray([1,5,3,6,4,7,9,8]);
console.log(bst2.toString());

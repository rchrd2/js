"use strict";

/**
 * An AVL tree is a type of self-balancing binary search tree
 *
 * In an AVL tree, the heights of the two child subtrees of any node differ by 
 * at most one; if at any time they differ by more than one, rebalancing is 
 * done to restore this property. Lookup, insertion, and deletion all take
 * O(log n) time in both the average and worst cases, where n is the number of 
 * nodes in the tree prior to the operation.
 *
 * See this nice visualization:
 * https://www.cs.usfca.edu/~galles/visualization/AVLtree.html
 */

var fs = require('fs');


var AvlTreeNode = function(val) {
  this.parent = null;
  this.left = null;
  this.right = null;
  this.val = val || null;
    
  this.detach = function() {
    if (this.left !== null) {
      if (this.left.parent === this) {
        this.left.parent = null;
      }
      this.left = null;
    }
    if (this.right !== null) {
      if (this.right.parent === this) {
        this.right.parent = null;
      }
      this.right = null;
    }
    // de-couple from parent
    if (this.parent !== null) {
      if (this.parent.left === this) {
        this.parent.left = null;
      } else if (this.parent.right === this) {
        this.parent.right = null;
      }
      this.parent = null;
    }
  };
  

  this.attachLeft = function(node) {
    if (node == this) {
      throw "Trying to attach self";
    }
    this.left = node;
    if (node !== null) {
      node.parent = this;
    }
  };

  this.detachLeft = function() {
    var currLeft = this.left;
    if (currLeft !== null) {
      this.left.parent = null;
      this.left = null;
    }
    return currLeft;
  };

  
  this.attachRight = function(node) {
    if (node == this) {
      console.trace();
      throw "Trying to attach self";
    }
    this.right = node;
    if (node !== null) {
      node.parent = this;
    }
  };
  
  this.detachRight = function() {
    var currRight = this.right;
    if (currRight !== null) {
      this.right.parent = null;
      this.right = null;
    }
    return currRight;
  };
  
  this.toString = function() {
    var t = this.right !== null ? this.right.val : 'null';
    var t2 = this.left !== null ? this.left.val : 'null';
    var p = this.parent !== null ? this.parent.val : 'null';

    return "[Node: " + this.val + "]" + "[" + t2 + "]" + "[" + t + "]" + "[" + p + "]";
  };
};

var AvlTree = function() {
  this.root = null;
};
AvlTree.prototype = {
  constructor: AvlTree,
  
  /**
   * balanceFactor = height(left subtree) - height(right subtree)
   *
   * if the recomputed balance factor becomes less than −1 or greater than +1, 
   * the subtree rooted at this node is unbalanced, and a rotation is needed.
   */
  insert: function(val) {
    //console.log('insert', val);
    if (this.root === null) {
      this.root = new AvlTreeNode(val);
    } else {
      var node = this.insertNode(this.root, val);
      this.insertRebalance(node);
    }
  },
  
  /**
   * Inserts a node. 
   * return {AvlTreeNode} the new node that was inserted
   */
  insertNode: function(parentNode, val) {
    //console.log('insertNode', parentNode.val, val);
    if (val < parentNode.val) {
      if (parentNode.left === null) {
        console.log('left');
        var newnode = new AvlTreeNode(val);
        parentNode.left = newnode;
        console.log('creating on the left');
        parentNode.left.parent = parentNode;
        return newnode;
      } else {
        return this.insertNode(parentNode.left, val);
      }
    } else if (val > parentNode.val) {
      if (parentNode.right === null) {
        //console.log('creating on the right');
        var newnode = new AvlTreeNode(val);
        parentNode.right = newnode;
        parentNode.right.parent = parentNode;
        //console.log(this.toString());
        return newnode;
      } else {
        //console.log('recursing right');
        return this.insertNode(parentNode.right, val);
      }
    }

  },

  /**
   * This balances the tree after insertion
   * 
   * First fix the lowest violation. Then work up the tree to fix any more
   *
   * return {undefined} 
   */
  insertRebalance: function(P) {
    console.log('insertRebalance', P.val);
    do {
      var balance = this.nodeBalanceFactor(P);
      if (balance == -2) {
        console.log('right heavy');
        // right is heavy
        if (this.nodeBalanceFactor(P.right) >= 1) {
          // RIGHT-LEFT insertion
          console.log('DOUBLE rotation');
          // if right subtree is left heavy
          // perform double left rotation
      
          // RIGHT ROTATE P.right
          this.rightRotate(P.right);

          // LEFT rotate P
          this.leftRotate(P);
        } else {
          // perform single LEFT rotation
          //console.log('SINGLE leftRotate(P)', P.val);
          //console.log('BEFORE', this.toString());
          this.leftRotate(P);
          //console.log('AFTER', this.toString());
        }
      } else if (balance == 2) {
        console.log('left heavy');
        // left is heavy
        if (this.nodeBalanceFactor(P.left) <= -1) {
          // LEFT-RIGHT insertion
          console.log('double rotation');

          // if left subtree is right heavy
          // perform double right rotation
      
          // LEFT ROTATE P.left
          this.leftRotate(P.left);
      
          // RIGHT ROTATE P
          this.rightRotate(P);
        } else {
          // perform single RIGHT rotation
          //console.log('SINGLE rightRotate(P)', P.val);
          this.rightRotate(P);
        }
      }
      P = P.parent;
    } while (P != null);
  },
  



  /**
   * When the right side is heavier, we LEFT-rotate to the left
   * @param node {AvlTreeNode} - The top node. Ie [A]:
   *      [A]                         [B]
   *           [B]           =>  [A]          [C]
   *       [B-L]   [C]             [B-L]
   * 
   * b becomes the new root. 
   * a takes ownership of b's left child as its right child, or in this case, null. 
   * b takes ownership of a as its left child
   *
   * See http://pages.cs.wisc.edu/~paton/readings/liblitVersion/AVL-Tree-Rotations.pdf
   *
   * return {AvlTreeNode} the new root
   */
  leftRotate: function(a) {
    //console.log("leftRotate", String(a));
    
    // This does an in-place rotation ie swapping values and not pointers
    // because javascript has no pointers
    //
    //      [A]                            [B](A')
    //            [B]           =>  [A](B')         [C]
    //       [B-L]   [C]                [B-L]
    
    var aTempLeft = a.left;
    var aTempVal = a.val;

    var b = a.right;
    var bTempLeft = b.left;
    var bTempRight = b.right;
    var bTempVal = b.val;
    
    var c = b.right;

    // A becomes B
    a.left = b;
    if (a.left) {
      a.left.parent = a;
    }
    a.right = c;
    if (a.right) {
      a.right.parent = a;
    }
    a.val = bTempVal;

    
    // B becomes the A in the after
    b.val = aTempVal;
    b.left = aTempLeft;
    if (b.left) {
      b.left.parent = b;
    }
    b.right = bTempLeft;
    if (b.right) {
      b.right.parent = b;
    }
    b.parent = a;
    
    // C stays c
  },
  

  /**
   * When the left side is heavier, we RIGHT-rotate to the right
   *
   *               [C]                 [B]
   *        [B]            =>  [A]             [C]
   *    [A]  [B-R]                        [B-R]
   *
   * b becomes the new root.
   * c takes ownership of b's right child, as its left child.
   * b takes ownership of c, as it's right child. 
   *
   * return {AvlTreeNode} the new root
   */
  rightRotate: function(c) {
    
    // This does an in-place rotation ie swapping values and not pointers
    // because javascript has no pointers
    //
    //               [C' (B)]
    //     [A]                 [B' (C)]
    //                   [B-R]
    //
    // Alternatively, this could rewire parent.left and parent.right
    
    var cTempRight = c.right;
    var cTempVal = c.val;

    var b = c.left;
    var bTempRight = b.right;
    var bTempVal = b.val;
    
    var a = b.left;

    // b's right becomes c's left
    
    // A stays c
    
    // C becomes B
    c.val = bTempVal;
    c.left = a;
    if (c.left) {
      c.left.parent = c;
    }
    c.right = b;
    if (c.right) {
      c.right.parent = c;
    }

    // B becomes the C in the after
    b.val = cTempVal;
    b.left = bTempRight;
    if (b.left) {
      b.left.parent = b;
    }
    b.right = cTempRight;
    if (b.right) {
      b.right.parent = b;
    }
    b.parent = c;
  },
  
  /** 
   * Remove and maintain avl property 
   * return {array} [deletedNode, parent]
   */
  removeNode: function(node, val) {
    console.log("removeNode", String(node), val);
    
    if (node === null) {
      
      return [null, null];
      
    } else if (val === node.val) {
      
      // Found it
      var nodeParent = node.parent;
      
      // Case 1: no children
      if (node.left === null && node.right === null) {

        var replacementNode = null;
        var balanceNode = nodeParent;

      }
      
      // Case 2: 1 child
      else if (node.left !== null && node.right === null) {

        var replacementNode = node.detachLeft();
        var balanceNode = replacementNode;

        console.log("1 child left", replacementNode, balanceNode);

      } else if (node.left === null && node.right !== null) {

        var replacementNode = node.detachRight();
        var balanceNode = replacementNode;

        console.log("1 child right", replacementNode, balanceNode);

      }
      
      // Case 3: 2 children
      else {
        
        console.log('2 children');
        // Move the Right child's min node to the top
        

        console.log("+++");
        console.log(this.graphviz());
        
        var removeResults = this.removeMin(node.right);
        
        var rightTree = removeResults[0];
        var replacementNode = removeResults[1];

        console.log("replacementNode", String(replacementNode))
        console.log(this.graphviz());

        console.log("+++");

        
        // Attach both children
        console.log('388', String(node), String(node.left), String(node.right));
        replacementNode.detach();
        replacementNode.attachLeft(node.detachLeft());
        
        replacementNode.attachRight(rightTree);

        var balanceNode = replacementNode;


        console.log("411", String(replacementNode), String(replacementNode.left));
        console.assert(node.val !== balanceNode.val, "weird");


      }
      
      if (nodeParent === null) {
        console.log("IT IS ROOT");
        this.root = replacementNode;
        replacementNode.parent = null;
      } else {
        if (nodeParent.left === node) {
          // attach to parent left
          console.log("IT IS LEFT");
          nodeParent.attachLeft(replacementNode);
        } else if (nodeParent.right === node) {
          // attach to parent right
          console.log("IT IS RIGHT");
          nodeParent.attachRight(replacementNode);
        }
      }
      
      node.detach();
      return [node, balanceNode];
      
    } else if (val < node.val) {
      return this.removeNode(node.left, val);
    } else if (val > node.val) {
      return this.removeNode(node.right, val);
    }
  },
  
  /**
   * return {node} the min removed or null if empty
   * @TODO this isn't working
   * return {array} [ newRoot, removedNode ]
   */
  removeMin: function(node) {
    var newRoot = node;
    if (node !== null) {

      while (node.left !== null) {
        node = node.left;
      }
      if (node.parent !== null) {
        node.parent.attachLeft(node.detachRight());
      } else {
        newRoot = node.detachRight();
      }
      node.detach();
    }
    if (newRoot == node) {
      newRoot = null;
    }
    console.log('removeMin', String(node));
    return [ newRoot, node ];
  },
  
  remove: function(val) {
    //this.writeGraphviz('/Users/richard/Desktop/js/graphviz/avl-before-remove.gv');
    console.log("REMOVE", val);
    console.log(this.graphviz());
    var results = this.removeNode(this.root, val);
    console.log('RESULTS', String(results[0]), String(results[1]));
    var node = results[0];
    var balanceNode = results[1];
    console.log(this.graphviz());
    console.log("REMOVE COMPLETE");
 //this.writeGraphviz('/Users/richard/Desktop/js/graphviz/avl-after-remove.gv');
    if (balanceNode !== null) {
      console.log("insertRebalance", String(node), String(balanceNode));
      console.log(this.graphviz());
      this.insertRebalance(balanceNode);
    }
  },

  isEmpty: function() {
    return this.root === null;
  },

  search: function(val) {
    var searchNode = function(node, val) {
      if (node === null) {
        return false;
      } else if (val === node.val) {
        return node;
      } else if (val < node.val) {
        return searchNode(node.left, val);
      } else {
        return searchNode(node.right, val);
      }
    };
    return searchNode(this.root, val);
  },


  /**
   * balanceFactor = height(left subtree) - height(right subtree)
   * 
   * NOTE: I believe this should actually be stored in the node, and not
   * a computed property
   */
  nodeBalanceFactor: function(node) {
    try {
      var lheight = node.left ? this.nodeHeight(node.left) : -1;
      var rheight = node.right ? this.nodeHeight(node.right) : -1;
    } catch (e) {
      console.log(String(node), String(node.left), String(node.right));
      //console.trace();
    }
    //console.log('nodeBalanceFactor', lheight, rheight);
    return lheight - rheight;
  },
  
  nodeHeight: function(node) {
    if (node === null) {
      return -1;
    }
    return 1 + Math.max(this.nodeHeight(node.left), this.nodeHeight(node.right));
  },

  /**
   * A tree consisting of only a root node has a height of 0. 
   */
  height: function() {
    return this.nodeHeight(this.root);
  },
  
  toString: function() {
    var queue = [];
    queue.push(["Root", this.root]);
    var row;
    var str = "";
    while (row = queue.shift()) {
      var params = [
        row[0],
        row[1],
        row[1].left  || "[null]",
        row[1].right || "[null]",
        this.nodeHeight(row[1]),
        this.nodeBalanceFactor(row[1]),
      ];
      str += params.join(", ") + "\n";
      if (row[1].left) {
        queue.push(["L", row[1].left]);
      }
      if (row[1].right) {
        queue.push(["R", row[1].right]);
      }
    }
    return str;
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
              "[" + this.nodeBalanceFactor(node) + "]"
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
        if (node.parent) {
          data_points.push(node.val + " -> " + node.parent.val + ";");
        }
      }
    }
    var output = template.replace("{{DATA}}", data_points.join(" "));
    return output;
  },
  
  writeGraphviz: function(path) {
    var output = this.graphviz() + "\n";
    var wstream = fs.createWriteStream(path);
    wstream.write(output);
    wstream.end();
    return;
    fs.writeFile(path, output, function(error) {
     if (error) {
       console.error("write error:  " + error.message);
     } else {
       console.log("Successful Write to " + path);
     }
    }); 
  },

  /**
   * Helper to check if balanced
   */
  isBalanced: function() {
    var queue = [this.root];
    var node;
    while (node = queue.shift()) {
      //console.log(this.nodeBalanceFactor(node));
      if (Math.abs(this.nodeBalanceFactor(node)) > 1) {
        //console.log(node);
        return false;
      }
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    return true;
  },
  
  /**
   * Helper to get size
   */
  size: function() {
    var queue = [this.root];
    var node;
    var size = 0;
    while (node = queue.shift()) {
      size++;
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    return size;
  },
};


var createAvlTreeFromArray = function(vals) {
  var tree = new AvlTree();
  for (var i = 0; i < vals.length; i++) {
    tree.insert(vals[i]);
  }
  return tree;
};



/**
 * Tests
 */
//var tree = new AvlTree();
//
////console.log = function() {};
//
//console.assert(tree.isEmpty() === true, "Assert is empty");
//console.assert(tree.height() === -1, "Assert height is 0");
//console.assert(tree.isBalanced() === true, "Assert tree is balanced");
//
//tree.insert('1');
//
//console.assert(tree.isEmpty() === false, "Assert no longer empty");
//console.assert(tree.root.val == '1', "Root value is 1");
//console.assert(tree.height() === 0, "Height is 0");
//console.assert(tree.search('1') !== false, "1 is found");
//console.assert(tree.search('asdf') === false, "Asdf is found");
//console.assert(tree.isBalanced() === true, "Assert tree is balanced");
//
//
//tree.insert('2');
//tree.insert('3');
//tree.insert('4');
//console.log(tree.toString());
//console.log("INSERTING 5 TEST");
//tree.insert('5');
//console.log("AFTER INSERT", tree.toString());
//console.assert(tree.search('5') !== false, "5 is present");
//
//tree.insert('6');
//console.assert(tree.search('6') !== false, "6 is present");
//
//
//
//console.assert(tree.isBalanced() === true, "Assert tree is balanced");
//
//
//console.log(tree.graphviz());
//console.log('Removing "1"');
//tree.remove('1');
//console.log(tree.graphviz());
//
//console.assert(tree.isBalanced() === true, "Assert tree is balanced");
//
//
//
///// 
//var tree2 = createAvlTreeFromArray([1,5,3,6,4,7,9,8]);
//console.log(tree2.toString());
//console.assert(tree2.isBalanced() === true, "Assert tree is balanced");


var randomValues = [];
var size3 = 15;
for (var i = 0; i < size3; i++) {
  var newVal;
  // Generate a unique value
  do {
    newVal = Math.floor(Math.random() * 100);
  } while (randomValues.indexOf(newVal) >= 0);
  randomValues.push(newVal);
}

// make life easier
randomValues = [ 39, 5, 24, 80, 90, 81, 53, 54, 75, 35, 52, 76, 25, 40, 65 ];
randomValues = [ 40, 35, 25, 39.5, 39, 39.75, 39.25 ];
size3 = randomValues.length;

var tree3 = createAvlTreeFromArray(randomValues);
console.assert(tree3.size() == size3, "Tree size is not" + size3 + ":" + tree3.size());

//// I keep getting a -2 (off by one)
//console.log('--------');
//console.log(tree3.graphviz());
//console.log('--------');
//
console.assert(tree3.isBalanced() === true, "Assert tree is balanced");


// Test removing all the elements one by one
for (var i = 1; i < randomValues.length; i++) {
  console.log("REMOVING", randomValues[i]);
  tree3.remove(randomValues[i]);
  console.log(tree3.size());
  console.log(randomValues.length - i);
  console.assert(tree3.size() == (size3 - i), "Tree size is not " + (size3 - i) + ":" + tree3.size());
  console.assert(tree3.isBalanced() === true, "Assert tree is balanced");
}


/// 
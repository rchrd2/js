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

var AvlTreeNode = function(val) {
  this.parent = null;
  this.left = null;
  this.right = null;
  this.val = val || null;
    
  this.toString = function() {
    return "[Node: " + this.val + "]";
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
    console.log('insert', val);
    if (this.root === null) {
      this.root = new AvlTreeNode(val);
    } else {
      var node = this.insertNode(this.root, val);
    }
  },
  
  /**
   * Inserts a node. 
   * return {AvlTreeNode} the new node that was inserted
   */
  insertNode: function(parentNode, val) {
    if (val <= parentNode.val) {
      if (parentNode.left === null) {
        var newnode = new AvlTreeNode(val);
        parentNode.left = newnode;
        console.log('creating on the left');
        parentNode.left.parent = parentNode;
        // Balance
        this.retrace(parentNode);
        return newnode;
      } else {
        return this.insertNode(parentNode.left, val);
      }
    } else if (val > parentNode.val) {
      if (parentNode.right === null) {
        console.log('creating on the right');
        var newnode = new AvlTreeNode(val);
        parentNode.right = newnode;
        parentNode.right.parent = parentNode;
        console.log(this.toString());

        // Balance
        this.retrace(parentNode);
        return newnode;
      } else {
        return this.insertNode(parentNode.right, val);
      }
    }

  },

  /**
   * This balances the tree after insertion
   * return {undefined} 
   */
  retrace: function(P) {
    do {
      var balance = this.nodeBalanceFactor(P);
      console.log('retrace', P.val, balance);
      if (balance < -1) {
        console.log('right heavy');
        // right is heavy
        if (this.nodeBalanceFactor(P.right) == 1) {
          console.log('DOUBLE rotation');
          // if right subtree is left heavy
          // perform double left rotation
      
          // RIGHT ROTATE P.right
          P.right = this.rightRotate(P.right);

          // LEFT rotate P
          P = this.leftRotate(P);
        } else {
          // perform single LEFT rotation
          console.log('SINGLE leftRotate(P)', P.val);
          console.log('BEFORE', this.toString());
          P = this.leftRotate(P);
          console.log('AFTER', this.toString());
        }
      } else if (balance > 1) {
        console.log('left heavy');
        // left is heavy
        if (this.nodeBalanceFactor(P.left) == -1) {
          console.log('double rotation');

          // if left subtree is right heavy
          // perform double right rotation
      
          // LEFT ROTATE P.left
          P.left = this.leftRotate(P.left);
      
          // RIGHT ROTATE P
          P = this.rightRotate(P);
        } else {
          // perform single RIGHT rotation
          console.log('SINGLE rightRotate(P)', P.val);
          P = this.rightRotate(P);
        }
      }
      P = P.parent;
    } while (P != null);
  },



  /**
   * When the right side is heavier, we LEFT-rotate to the left
   * @param node {AvlTreeNode} - The top node. Ie [A]:
   *      [A]                         [B]
   *         [B]           =>  [A]          [C]
   *           [C]
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
    // This does an in-place rotation ie swapping values and not pointers
    //
    //          [A' (B)]
    //     [B' (A)]     [C' (C)]
    
    
    var aTempLeft = a.left;
    var aTempRight = a.right;
    var aTempVal = a.val;
    var aTempParent = a.parent;
    
    var b = a.right;
    var bTempLeft = b.left;
    var bTempRight = b.right;
    var bTempVal = b.val;
    
    var c = b.right;
    
    // B becomes the A in the after
    b.left = null;
    b.right = null;
    b.parent = null;
    b.val = aTempVal;
    b.left = aTempLeft;
    // get b's value
    b.right = bTempLeft;
    b.parent = a;
    
    // C stays c
    
    // A becomes B
    a.left = b;
    a.right = c;
    a.parent = aTempParent;
    a.val = bTempVal;

    return a;
  },
  
  leftRotate2: function(a) {
    var b = a.right;
    
    // Wire it all up now
    a.right = b.left;
    if (a.right) {
      a.right.parent = a;
    }
    b.parent = a.parent;
    b.left = a;
    a.parent = b;
    
    // Case for when it's the root
    if (b.parent === null) {
      this.root = b;
    }
    return b;
  },

  /**
   * When the left side is heavier, we RIGHT-rotate to the right
   *
   *        [C]                 [B]
   *      [B]       =>  [A]             [C]
   *    [A]
   *
   * b becomes the new root.
   * c takes ownership of b's right child, as its left child.
   * b takes ownership of c, as it's right child. 
   *
   * return {AvlTreeNode} the new root
   */
  rightRotate: function(c) {
    //console.log('rightRotate', c);
    var b = c.left;
    c.left = b.right;
    if (c.left) {
      c.left.parent = c;
    }
    b.parent = c.parent;
    b.right = c;
    c.parent = b;
    
    // Case for when it's the root
    if (b.parent === null) {
      this.root = b;
    }
    
    return b;
  },

  /** 
   * remove and maintain avl property 
   */
  remove: function(val) {
    var removeNode = function(node, val) {
      if (node === null) {
        return null;
      } else if (val === node.val) {
        // Found it
        
        // Case 1: no child
        if (node.left === null && node.right === null) {
          node = null;
        }
        
        // Case 2: 1 child
        else if (node.left !== null && node.right === null) {
          node = node.left;
        } else if (node.left === null && node.right !== null) {
          node = node.right;
        }
        
        // Case 3: 2 children
        else {
          // Move the Right child's min node to the top
          var right_min = node.right;
          while (right_min.left !== null) {
            right_min = right_min.left;
          }
          // Detach from parent
          right_min.parent.left = null;
          
          // Reattach at the top
          right_min.left = node.left
          right_min.right = node.right;
          right_min.parent = node.parent;
          node = right_min;
        }
        
      } else if (val < node.val) {
        node.left = removeNode(node.left, val);
      } else if (val > node.val) {
        node.right = removeNode(node.right, val);
      }
      return node;
    };
    removeNode(this.root, val);
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
    var lheight = node.left ? this.nodeHeight(node.left) : -1;
    var rheight = node.right ? this.nodeHeight(node.right) : -1;
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
   * Helper to check if balanced
   */
  isBalanced: function() {
    var queue = [this.root];
    var node;
    while (node = queue.shift()) {
      if (Math.abs(this.nodeBalanceFactor(node)) > 1) {
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
};




/**
 * Tests
 */
var tree = new AvlTree();

console.assert(tree.isEmpty() === true, "Assert is empty");
console.assert(tree.height() === -1, "Assert height is 0");
console.assert(tree.isBalanced() === true, "Assert tree is balanced");

tree.insert('1');

console.assert(tree.isEmpty() === false, "Assert no longer empty");
console.assert(tree.root.val == '1', "Root value is 1");
console.assert(tree.height() === 0, "Height is 0");
console.assert(tree.search('1') !== false, "1 is found");
console.assert(tree.search('asdf') === false, "Asdf is found");
console.assert(tree.isBalanced() === true, "Assert tree is balanced");


tree.insert('2');
tree.insert('3');
tree.insert('4');
console.log(tree.toString());
console.log("INSERTING 5 TEST");
tree.insert('5');
console.log("AFTER INSERT", tree.toString());
console.assert(tree.search('5') !== false, "5 is present");

tree.insert('6');
console.assert(tree.search('6') !== false, "6 is present");



console.assert(tree.isBalanced() === true, "Assert tree is balanced");


console.log(tree.toString());

//tree.remove('foo');
//console.log('Removing "Barney"');
//tree.remove('Barney');
//console.log(tree.toString());
//JSON.stringify(tree, null, 2)
//console.assert(tree.isBalanced() === true, "Assert tree is balanced");



/// 
/// var tree2 = createBSTFromArray([1,5,3,6,4,7,9,8]);
/// console.log(tree2.toString());
/// 
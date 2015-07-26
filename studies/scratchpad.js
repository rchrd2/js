var BinaryTree = function() {
  this.root = null;
};
BinaryTree.prototype = {
  constructor: BinaryTree,
  height: function() {
    var getNodeHeight = function(node) {
      if (node === null) {
        return 0;
      }
      
      var lheight = getNodeHeight(node.left);
      var rheight = getNodeHeight(node.right);
      var height = Math.max(lheight, rheight);
      
      return 1 + height;
    };
    
    return getNodeHeight(this.root);
    
  }
};

var BinaryTreeNode = function() {
  this.item = null;
  this.left = null;
  this.right = null;
};


var bt = new BinaryTree();
bt.root = new BinaryTreeNode();
console.log(bt.height());
bt.root.left = new BinaryTreeNode();
console.log(bt.height());
/**
 * Linked list
 */
var LinkedList = function() {
  this.head = null;
};
LinkedList.prototype = {
  constructor: LinkedList,
  
  /**
   * Searches for a value O(n)
   */
  search: function(val) {
    var node = this.head;
    while (node !== null) {
      if (node.val === val) {
        return node;
      }
    }
    return null;
  },
  
  /**
   * Adds an item to the end
   */
  add: function(node) {
    if (this.head === null) {
      this.head = node;
    } else {
      var last = this.head;
      // Fast forward to end
      while (last.next !== null) {
        last = last.next;
      }
      last.next = node;
    }
  },
  
  /**
   * Remove an element by value. 
   * Only removes the first match
   * Returns true if removed
   */
  remove: function(val) {
    var node = this.head;
    var prev_node = null;
    var removed = false;
    while (node !== null) {
      if (node.val === val) {
        // We found it
        if (prev_node !== null) {
          // patch up prev node
          prev_node.next = node.next;
        }
        // Not necessary in js, but it's good to clean up;
        node.next = null;
        // Set node to null to terminate loop
        node = null;
        removed = true;
      } else {
        prev_node = node;
        node = node.next;
      }
    }
    return removed;
  },
  
  /**
   * String representation
   */
  toString: function() {
    var output = ["*Linked List*"];
    var node = this.head;
    while (node !== null) {
      output.push(node.val);
      node = node.next;
    }
    return output.join(', ');
  },
};

var LinkedListNode = function(val) {
  this.val = val;
  this.next = null;
}
LinkedListNode.prototype = {
  constructor: LinkedListNode
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

var ll = new LinkedList();
console.log(ll.toString());
var n1 = new LinkedListNode('foo');
console.log(n1);
ll.add(n1);
console.log(ll.toString());
ll.add(new LinkedListNode('bar'));
ll.add(new LinkedListNode('baz'));
console.log(ll.toString());

ll.remove('bar');
console.log(ll.toString());

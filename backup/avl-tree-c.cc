AvlNode insert(Element x, AvlNode t) {
  if (t == null) {
    t = new AvlNode(x);
  }
  else if (x < t.element) {
    // left insert
    t.left = insert(x, t.left);
    
    // check height condition
    if (height(t.left) - height(t.right) == 2) {
      if (x < t.left.element) {
        // left-left insertion
        t = rotateR(t);
      } else {
        // left-right insertion
        t = rotateLR(t);
      }
    }
  } 
  else if (x > t.element) {
    // ... symetric with left insertion ...
  }
  return t;
}
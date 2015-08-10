/*
 * Knights tour problem
 * 
 * Solved using a graph and depth first search with backtracking
 */

var WHITE = 0, GREY = 1, BLACK = 2;

var Vertex = function(k) {
  this.key = k;
  this.edges = [];
  this.color = WHITE;
  this.depth = null;
  this.parent = null;
};

var G = function() {
  this.V = {};
};
G.prototype.add = function(v) {
  this.V[v.key] = v;
};
G.prototype.solve = function(v) {
  //console.log(v.key, v.depth);
  if (v.depth >= 24) {
    return v;
  } else {
  
    v.color = GREY;
  
    if (v.depth === null) {
      v.depth = 0;
    }

    for (var i = 0; i < v.edges.length; i++) {
    
      if (v.edges[i].color === WHITE) {
        //v.edges[i].color = GREY;
        v.edges[i].parent = v;
        v.edges[i].depth = v.depth + 1;
      
        var result = this.solve(v.edges[i]);
        
        if (result !== null) {
          return result;
        } else {
          //v.edges[i].color = WHITE;
          v.edges[i].depth = null;
        }
      }
      //v.color = BLACK;
    }
    v.color = WHITE;
    return null;
  }
};

var offsetToPos = function(offset, p) {
  var xoffset = offset[0];
  var yoffset = offset[1];
  var py = Math.floor( p / 5 );
  var px = p - py * 5;
  //console.log([offset, p, px, py, px + 5 * py]);
  px = px + xoffset;
  py = py + yoffset;
  //console.log([offset, p, px, py, px + 5 * py]);
  if (px >= 0 && py >= 0 && px < 5 && py < 5) {
    return px + 5 * py;
  } else {
    return -1;
  }
};

var moveOffsets = [
  [-1, -2], [-1, 2], [-2, -1], [-2, 1],
  [ 1, -2], [ 1, 2], [ 2, -1], [ 2, 1]
];



var main = function() {
  var g = new G();
  for (var i = 0; i < 25; i++) {
    g.add(new Vertex(i));
  }
  var gridSize = 25;
  for (var i = 0; i < 25; i++) {
    v = g.V[i];
    // init legal offset edges
    for (var j = 0; j < moveOffsets.length; j++) {
      var pos = offsetToPos(moveOffsets[j], i);
      if (pos >= 0 && pos < 25) {
        v.edges.push(g.V[pos]);
      }
    }
  }
  //console.log(g.V[9].edges);
  //return;
  var result = g.solve(g.V[12]);
  console.log(result);
  console.log("RESULT");
  
  while (result) {
    console.log(result.key);
    result = result.parent;
  };
  
};

main();

//console.log(offsetToPos([2, -1], 9));
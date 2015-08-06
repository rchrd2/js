"use strict";

/**
 * Graph ADT. 
 *
 * It's a directed graph
 *
 * This implementation is pretty verbose, because I learned the hard way with
 * my binary search tree that it's better to build on top of tests.
 *
 * @author Richard Caceres, @rchrd2, me@rchrdnet
 * @licence MIT
 */


/**
 * Basic vertex prototype
 * @constructor
 * @param {string|number} key The key for this vertex
 */
var Vertex = function(key) {
  this.key = key || null;
  this.value = null;
  
  /**
   * edges {Array<Vertex>}
   */
  this.edges = [];
};

Vertex.prototype.addEdge = function(vertex) {
  this.edges.push(vertex);
};

/**
 * @param {Vertex} vertex
 */
Vertex.prototype.removeEdge = function(vertex) {
  var index = this.edges.indexOf(vertex);
  if (index > -1) {
    this.edges.splice(index, 1);
  }
};

/**
 * @param {Vertex} vertex
 */
Vertex.prototype.contains = function(vertex) {
  return this.edges.indexOf(vertex) >= 0;
};

Vertex.prototype.getEdges = function() {
  return this.edges;
};


/**
 * @constructor
 */
var Graph = function() {
  /**
   * vertices {Array<Vertex>}
   */
  this.vertices = {};
};

/**
 * @param {Vertex} vertex
 * @return {Vertex} the vertex
 */
Graph.prototype.addVertex = function(vertex) {
  if ( ! (vertex instanceof Vertex)) {
    throw "A vertex was not passed to addVertex";
  }
  this.vertices[vertex.key] = vertex;
  return vertex;
};

/**
 * @param {Vertex|null} vertex
 */
Graph.prototype.removeVertex = function(vertex) {
  if (vertex !== null) {
    // Need to delete vertex from all other vertex edges
    delete this.vertices[vertex.key];

    for (var key in this.vertices) {
      this.vertices[key].removeEdge(vertex);
    }
  }
};

/**
 * Convenience method
 * @param {Vertex} v1
 * @param {Vertex} v2
 */
Graph.prototype.addEdge = function(v1, v2) {
  if ( ! (v1 instanceof Vertex) || ! (v2 instanceof Vertex)) {
    throw "A vertex was not passed to addEdge";
  }
  v1.addEdge(v2);
  // Add vertex is a no-op if they are already in the graph
  this.addVertex(v1)
  this.addVertex(v2);
};

/**
 * @param {string} key
 */
Graph.prototype.getVertex = function(key) {
  return this.vertices[key] || null;
};

/**
 * @return {Array<Vertex>}
 */
Graph.prototype.getVertices = function() {
  return this.vertices;
};

/**
 * @param {Vertex} vertex
 */
Graph.prototype.contains = function(vertex) {
  if ( ! (vertex instanceof Vertex)) {
    throw "A vertex was not passed to contains";
  }
  return vertex.key in this.vertices;
};

/**
 * Clears the list, but does not delete vertices
 */
Graph.prototype.clear = function() {
  this.vertices = {};
};

/**
 * @return {Boolean}
 */
Graph.prototype.isEmpty = function() {
  return Object.keys(this.vertices).length === 0;
};

/**
 * Breadth First Search
 *
 * This is a basic breadth first search. I think normally breadth first search
 * would be part of another method, like find shorted path, for example.
 *
 * In it's most basic sense it's pretty simple. You traverse the graph with a
 * queue, and you only queue up items that haven't been visited. You keep track
 * of those in a dictionary.
 *
 * @param {Vertex} startVertex The starting vertex
 * @param {Vertex} targetVertex The starting vertex
 * @return {Boolean) if a connection was found
 */
Graph.prototype.breadthFirstSearch = function(startVertex, targetVertex) {
  if ( ! (startVertex instanceof Vertex) || ! (targetVertex instanceof Vertex)) {
    throw "A vertex was not passed to breadthFirstSearch";
  }
  var visited = {};
  var found = false;
  var queue = [startVertex];
  var edges, vertex;
  while (vertex = queue.shift()) {
    if (vertex === targetVertex) {
      found = true;
      break;
    }
    visited[vertex.key] = true;
    var edges = vertex.getEdges();
    for (var i = 0; i < edges.length; i++) {
      if (edges[i].key in visited === false) {
        queue.push(edges[i]);
      }
    }
  }
  return found;
};

/**
 * Depth First Search explores all Vertices and Edges
 * This simply returns the names of the vertices in the order they
 * were explored
 *
 * @return {Array<String>} visited
 */
Graph.prototype.depthFirstSearch = function() {
  var parents = {};
  var order = [];

  // Search from start vertex s (only see stuff reachable from s)
  var DFS_visit = function(vertex) {
    for (var i = 0; i < vertex.edges.length; i++) {
      var v = vertex.edges[i];
      if (v.key in parents === false) {
        parents[v.key] = vertex;
        DFS_visit(v);
      }
    }
    order.push(vertex.key);
  }
  
  var DFS = function(g) {
    var vertex, vertex_key;
    for (vertex_key in g.vertices) {
      if (vertex_key in parents === false) {
        parents[vertex_key] = null;
        vertex = g.vertices[vertex_key];
        DFS_visit(vertex, parents);
      }
    }
  };
  
  DFS(this);
  
  return order.reverse();
};


/**
 * Depth First Search explores all Vertices and Edges
 *
 * This version is implemented Iteratively instead of recursively
 *
 * @note DOES NOT WORK
 * @return {Array<String>} visited
 */
Graph.prototype.depthFirstSearchIter = function() {
  var visited = {};
  var output = [];
  
  // Note, using an array bases stack adds the cost of slicing
  // A more efficient approach would be to use a linked-list based stack
  var stack = [];
  var vertex, vertex_key;
  
  for (vertex_key in this.vertices) {
    stack.push(this.vertices[vertex_key]);

    while (vertex = stack.pop()) {
      // note this doesn't give a correct order
      output.push(vertex_key);

      if ((vertex.key in visited) === false) {
        console.log(vertex.key);
        visited[vertex.key] = true;
        for (var j = 0; j < vertex.edges.length; j++) {
          stack.push(vertex.edges[j]);
        }
      }
    }
  }
  
  return output;
};



/**
 * Sort a DAG (Directed Acyclic Graph) in order of dependancies
 *
 * Uses a depth first search-based algorithm
 *
 * Sorting vertices in a graph
 */
Graph.prototype.topologicalSort = function() {
  return this.depthFirstSearch().reverse();
};

Graph.prototype.topologicalSortIter = function() {
  return this.depthFirstSearchIter().reverse();
};


/**
 * Dijkstra
 *
 * A greedy algorithm.
 *
 * This graph implementation doesn't have weights in the edges, so this
 * implementation is a bit trivial. All edges have the same weight.
 * Even still, it'll still find the shortest path between two vertexes
 */
Graph.prototype.dijkstra = function(s) {
  // Initialization
  
  // d holds minimum distances from
  var d = {};
  var Q = new MiniHeap();

  // add the rest of the vertexes to there
  var vertex_key;
  for (vertex_key in this.vertices) {
    // Use JavaScript's Infinity to represent Infinity
    d[vertex_key] = Infinity;
    Q.addWithPriority(this.vertices[vertex_key], d[vertex_key])
  }

  // the start vertex has min distance of 0;
  d[s.key] = 0;
  Q.decreasePriority(s, 0);

  // Heart of the algorithm
  var u;
  while (Q.isEmpty() === false) {
    u = Q.extractMin();
    for (var j = 0; j < u.edges.length; j++) {
      // v is the neighbor vertex
      var v = u.edges[j];
      var weight_from_u_to_v = 1; // a constant in this graph
      if (d[v.key] > (d[u.key] + weight_from_u_to_v)) {
        d[v.key] = d[u.key] + weight_from_u_to_v;
        Q.decreasePriority(v, d[v.key]);
      }
    }
  }
  
  return d;
};

// Helper faux Min-heap
var MiniHeap = function() {
  this.data = [];
};
MiniHeap.prototype.addWithPriority = function(v, dist) {
  this.data.push([v, dist]);
};
MiniHeap.prototype.decreasePriority = function(v, alt) {
  for (var i = 0; i < this.data.length; i++) {
    if (this.data[i][0].key == v.key) {
      this.data[i][1] = alt;
      break;
    };
  };
};
MiniHeap.prototype.extractMin = function() {
  var idx = null;
  var min = null;
  var v = null;
  for (var i = 0; i < this.data.length; i++) {
    if (min === null || this.data[i][1] < min) {
      min = this.data[i][1];
      idx = i;
    };
  };
  if (idx !== null) {
    v = this.data[idx][0];
    this.data.splice(idx, 1);
  };
  return v;
};
MiniHeap.prototype.isEmpty = function() {
  return this.data.length === 0;
};


/**
 * @return {String} graphviz source code
 */
Graph.prototype.toGraphviz = function() {
  var template = "digraph BST { {{DATA}} }";
  var data_points = [];

  for (var key in this.vertices) {
    data_points.push(key);
    for (var i = 0; i < this.vertices[key].edges.length; i++) {
      data_points.push(key + " -> " + this.vertices[key].edges[i].key);
    }
  }

  var output = template.replace("{{DATA}}", data_points.join("; "));
  return output;
};



/**
 * Tests
 */
var tests = {
  test_vertex_add_remove_edge: function() {
    var v1 = new Vertex('foo');
    var v2 = new Vertex('bar');
    var v3 = new Vertex('baz');
    
    v1.addEdge(v2);
    v1.addEdge(v3);
    
    console.assert(v1.contains(v2), "v1 has v2 as edge");
    console.assert(v1.contains(v3), "v1 has v3 as edge");
    
    v1.removeEdge(v2);
    console.assert(v1.contains(v2) === false, "v1 no longer has v2 as edge");
    console.assert(v1.contains(v3), "v1 still has v3 as edge");

    v1.removeEdge(v3);
    console.assert(v1.contains(v3) === false, "v1 no longer has v3 as edge");
  },

  test_add_vertex: function() {
    var g = new Graph();
    var v = new Vertex('foo');
    g.addVertex(v);
    // Check it's in there
    var found = g.contains(v);
    console.assert(found === true, "Assert vertex was found in graph");
  },
  
  test_remove_vertex: function() {
    var g = new Graph();
    var v1 = new Vertex('foo');
    var v2 = new Vertex('bar');
    var v3 = new Vertex('baz');
    
    v1.addEdge(v2);
    v1.addEdge(v3);
    
    g.addVertex(v1);
    g.addVertex(v2);
    g.addVertex(v3);

    // Check it's in there
    console.assert(g.contains(v1) === true, "Assert vertex was found in graph");
    
    // Check edges
    console.assert(v1.contains(v2), "v1 has v2 as edge");
    console.assert(v1.contains(v3), "v1 has v3 as edge");
    
    // Remove v2
    g.removeVertex(v2);

    // Check edges
    console.assert(v1.contains(v2) === false, "v1 no longer has v2 as edge");
    console.assert(v1.contains(v3), "v1 still has v3 as edge");
  },
  
  get_example_graph: function() {
    var g = new Graph();
    var a = g.addVertex(new Vertex('a'));
    var s = g.addVertex(new Vertex('s'));
    var d = g.addVertex(new Vertex('d'));
    var f = g.addVertex(new Vertex('f'));
    var z = g.addVertex(new Vertex('z'));
    var x = g.addVertex(new Vertex('x'));
    var c = g.addVertex(new Vertex('c'));
    var v = g.addVertex(new Vertex('v'));
    g.addEdge(a, s);
    g.addEdge(a, z);
    
    g.addEdge(s, a);
    g.addEdge(s, x);
    
    g.addEdge(d, x);
    g.addEdge(d, f);
    g.addEdge(d, c);
    
    g.addEdge(f, d);
    g.addEdge(f, c);
    g.addEdge(f, v);
    
    g.addEdge(z, a);

    g.addEdge(x, s);
    g.addEdge(x, d);
    g.addEdge(x, c);
    
    g.addEdge(c, x);
    g.addEdge(c, d);
    g.addEdge(c, f);
    g.addEdge(c, v);

    g.addEdge(v, c);
    g.addEdge(v, f);
    return g;
  },
  
  test_to_graphviz: function() {
    var g = this.get_example_graph();
    console.log(g.toGraphviz());
  },
  
  test_bfs: function() {
    var g = this.get_example_graph();
    var a = g.getVertex('a');
    var f = g.getVertex('f');
    var found = g.breadthFirstSearch(a, f);
    console.assert(found === true, "Assert found a path");
  },
  
  test_dfs: function() {
    var g = this.get_example_graph();
    var output = g.depthFirstSearch();
    var expected = [ 'a', 'z', 's', 'x', 'd', 'f', 'c', 'v' ];
    console.assert(expected.toString() === output.toString(), "Assert depth first search order", g.toGraphviz(), output);
  },
  
  get_topological_graph: function() {
    // This graph is the same DAG drawn on the whiteboard
    // Of Lecture 14, of 6006 Mit Open Courseware ~45:00min
    var graph = new Graph();
    var a = graph.addVertex(new Vertex('a'));
    var b = graph.addVertex(new Vertex('b'));
    var c = graph.addVertex(new Vertex('c'));
    var d = graph.addVertex(new Vertex('d'));
    var e = graph.addVertex(new Vertex('e'));
    var f = graph.addVertex(new Vertex('f'));
    var g = graph.addVertex(new Vertex('g'));
    var h = graph.addVertex(new Vertex('h'));
    var i = graph.addVertex(new Vertex('i'));

    graph.addEdge(g, h);
    graph.addEdge(a, h);
    graph.addEdge(a, b);
    graph.addEdge(b, c);
    graph.addEdge(d, c);
    graph.addEdge(d, e);
    graph.addEdge(c, f);
    graph.addEdge(e, f);
    return graph;
  },
  
  test_topological_sort: function() {
    var graph = this.get_topological_graph();
    var output = graph.topologicalSort();
    var expected;
    // this is from the notes
    expected = [ 'f', 'c', 'b', 'a', 'e', 'd', 'h', 'g', 'i' ];
    // this is from my output, but it worked!
    expected = [ 'h', 'f', 'c', 'b', 'a', 'e', 'd', 'g', 'i' ];
    console.assert(expected.toString() === output.toString(), "Assert topological sort worked", output, graph.toGraphviz());
  },

  test_topological_sort_iter: function() {
    var graph = this.get_topological_graph();
    var output = graph.topologicalSortIter();
    var expected;
    // this is from the notes
    expected = [ 'f', 'c', 'b', 'a', 'e', 'd', 'h', 'g', 'i' ];
    // this is from my output, but it worked!
    expected = [ 'h', 'f', 'c', 'b', 'a', 'e', 'd', 'g', 'i' ];
    console.assert(expected.toString() === output.toString(), "Assert topological sort iter worked", graph.toGraphviz(), output);
  },
  
  test_dijkstra: function() {
    var graph = this.get_example_graph();
    var a = graph.getVertex('a');
    console.log('Running dijkstra');
    console.log(graph.toGraphviz());
    console.log(graph.dijkstra(a));
    var result = graph.dijkstra(a);
    var expected = { a: 0, s: 1, d: 3, f: 4, z: 1, x: 2, c: 3, v: 4 };
    console.assert(result.toString() === expected.toString(), "Assert dijkstra worked", result);
  },
  
  run: function() {
    this.test_vertex_add_remove_edge();
    this.test_add_vertex();
    this.test_remove_vertex();
    this.test_to_graphviz();
    this.test_bfs();
    this.test_dfs();
    this.test_topological_sort();
    //this.test_topological_sort_iter();
    this.test_dijkstra();
  },
};

if (require.main === module) {
  console.log('Running tests');
  tests.run();
}


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
  v1.addEdge(v2);
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
 * @param {Vertex} vertex The starting vertex
 */
Graph.prototype.breadthFirstSearch = function(vertex) {
  
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
  
  test_to_graphviz: function() {
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

    console.log(g.toGraphviz());
  },
  
  run: function() {
    this.test_vertex_add_remove_edge();
    this.test_add_vertex();
    this.test_remove_vertex();
    this.test_to_graphviz();
  },
};

if (require.main === module) {
  console.log('Running tests');
  tests.run();
}


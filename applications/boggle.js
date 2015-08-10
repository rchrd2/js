/**
 * Boggle Solver
 *
 * This solves Boggle, albeit slowly. It uses a recursive depth-first search
 * solution. All possible words are stored in memory and then compared against
 * a dictionary at completion.
 */


/**
 * @constructor
 * @param {Array<Array<String>>} The boggle board
 */
var Boggle = function(grid) {
  this.grid = grid;
  
  this.WHITE = 0;
  this.GREY = 1;
  this.BLACK = 2;
};

/**
 * @return {Array} of edges
 */
Boggle.prototype.edges = function(x, y) {
  var pos = [
    [-1, -1], [ 0, -1], [ 1, -1],
    [-1,  0],           [ 1,  0],
    [-1,  1], [ 0,  1], [ 1,  1],
  ];
  var edges = [];
  var x2, y2;
  for (var i = 0; i < pos.length; i++) {
    x2 = x + pos[i][0];
    y2 = y + pos[i][1];
    if (x2 >= 0 && x2 < this.grid.length && y2 >= 0 && y2 < this.grid.length) {
      edges.push([x2, y2]);
    }
  }
  return edges;
};

/**
 * The goal is to use depth first search to find something
 * @param {Array} dictionary
 */
Boggle.prototype.solve = function(dictionary) {
  // words will hold the output
  var words = {};
  
  var colors = [];
  
  // initialize colors
  for (var y = 0; y < this.grid.length; y++) {
    colors[y] = [];
    for (var x = 0; x < this.grid.length; x++) {
      colors[y][x] = this.WHITE;
    }
  }
  
  
  var visit = function(x1, y1, word) {
    colors[x1][y1] = this.GREY;
    var edges = this.edges(x1, y1);
    var x, y;
    
    // Update word and add to dictionary
    word += this.grid[x1][y1];
    words[word] = true;
    
    // This limits the search space to just words < 10 chars long
    if (word.length < 10) {
      for (var i = 0; i < edges.length; i++) {
        x = edges[i][0];
        y = edges[i][1];
        if (colors[x][y] == this.WHITE) {
          visit.call(this, x, y, word);
        }
      }
    }
    // set back to white so others can visit
    colors[x1][y1] = this.WHITE;
  };
  
  // Iteratively visit all letters then return
  for (var y = 0; y < this.grid.length; y++) {
    for (var x = 0; x < this.grid.length; x++) {
      visit.call(this, x, y, "");
    }
  }
  
  // filter words by dictionary
  var lookup = {};
  for (var i = 0; i < dictionary.length; i++) {
    lookup[dictionary[i]] = true;
  }
  
  console.log(lookup);
  
  for (word in words) {
    if (word in lookup === false) {
      delete words[word];
    } else {
      console.log(word);
    }
  }
  return Object.keys(words);
};


var tests = function() {
  var grid = [
    ["b", "z", "u", "t"],
    ["a", "r", "m", "r"],
    ["d", "s", "l", "a"],
    ["e", "s", "i", "c"]
  ];
  var b = new Boggle(grid);
  
  // The goal is to find the word murals
  var dictionary = [
    "foo",
    "bar",
    "baz",
    "bad",
    "cis",
    "murals",
    "prose",
  ];
  var results = b.solve(dictionary);
  console.log(results);
  
};

tests();

/** 
 * Reference:
 * - http://exceptional-code.blogspot.com/2012/02/solving-boggle-game-recursion-prefix.html
 */
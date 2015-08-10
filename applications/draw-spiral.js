/**
 * An exercise in drawing a spiral
 *
 * Two solutions are implemented. One is iterative and the other is recursive.
 *
 * Example output:
 * x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x
 *                                                                 x
 *     x x x x x x x x x x x x x x x x x x x x x x x x x x x x x   x
 *     x                                                       x   x
 *     x   x x x x x x x x x x x x x x x x x x x x x x x x x   x   x
 *     x   x                                               x   x   x
 *     x   x   x x x x x x x x x x x x x x x x x x x x x   x   x   x
 *     x   x   x                                       x   x   x   x
 *     x   x   x   x x x x x x x x x x x x x x x x x   x   x   x   x
 *     x   x   x   x                               x   x   x   x   x
 *     x   x   x   x   x x x x x x x x x x x x x   x   x   x   x   x
 *     x   x   x   x   x                       x   x   x   x   x   x
 *     x   x   x   x   x   x x x x x x x x x   x   x   x   x   x   x
 *     x   x   x   x   x   x               x   x   x   x   x   x   x
 *     x   x   x   x   x   x   x x x x x   x   x   x   x   x   x   x
 *     x   x   x   x   x   x   x       x   x   x   x   x   x   x   x
 *     x   x   x   x   x   x   x   x   x   x   x   x   x   x   x   x
 *     x   x   x   x   x   x   x   x x x   x   x   x   x   x   x   x
 *     x   x   x   x   x   x   x           x   x   x   x   x   x   x
 *     x   x   x   x   x   x   x x x x x x x   x   x   x   x   x   x
 *     x   x   x   x   x   x                   x   x   x   x   x   x
 *     x   x   x   x   x   x x x x x x x x x x x   x   x   x   x   x
 *     x   x   x   x   x                           x   x   x   x   x
 *     x   x   x   x   x x x x x x x x x x x x x x x   x   x   x   x
 *     x   x   x   x                                   x   x   x   x
 *     x   x   x   x x x x x x x x x x x x x x x x x x x   x   x   x
 *     x   x   x                                           x   x   x
 *     x   x   x x x x x x x x x x x x x x x x x x x x x x x   x   x
 *     x   x                                                   x   x
 *     x   x x x x x x x x x x x x x x x x x x x x x x x x x x x   x
 *     x                                                           x
 *     x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x x
 */

var drawStraightLine = function(grid, x1, y1, x2, y2) {
  if (x2 > x1) {
    for (var x = x1; x <= x2; x++) {
      grid[y1][x] = "x";
    }
  } else if (x1 > x2) {
    for (var x = x2; x <= x1; x++) {
      grid[y1][x] = "x";
    }
  }
  if (y2 > y1) {
    for (var y = y1; y <= y2; y++) {
      grid[y][x1] = "x";
    }
  } else if (y1 > y2) {
    for (var y = y2; y <= y1; y++) {
      grid[y][x1] = "x";
    }
  }
};

var rotateRight = function(d) {
  var x = 0; 
  var y = 1;
  if (d[x] === 1 && d[y] === 0) {
    d[x] = 0;
    d[y] = 1;
  } else if (d[x] === 0 && d[y] === 1) {
    d[x] = -1;
    d[y] = 0;
  } else if (d[x] === -1 && d[y] === 0) {
    d[x] = 0;
    d[y] = -1;
  } else {
    d[x] = 1;
    d[y] = 0;
  }
};

var printGrid = function(g) {
  for (var i = 0; i < g.length; i++) {
    var str = g[i].join(" ");
    console.log(str);
  }
}

/**
 * Draws a spiral of width n
 * @param {Number} n
 */
var drawSpiral = function(n) {
  var grid = [];
  for (var i = 0; i < n; i++) {
    grid[i] = [];
    for (var j = 0; j < n; j++) {
      grid[i][j] = " ";
    };
  }
  var w = n;
  var cursor = [0, 0];
  var cursor2;
  var d = [1, 0];
  var iteration = 0;
  while (w >= 1) {
    cursor2 = [ cursor[0] + d[0] * w, cursor[1] + d[1] * w ];
    drawStraightLine(grid, cursor[0], cursor[1], cursor2[0], cursor2[1]);
    cursor = cursor2;
    iteration++;
    w--;
    rotateRight(d);
  };
  
  printGrid(grid);
};

/** 
 * Draws a spiral of width n RECURSIVELY
 * @param {Number} n
 */
var drawSpiralR = function(n) {
  // Initialize the grid
  var grid = [];
  for (var i = 0; i < n; i++) {
    grid[i] = [];
    for (var j = 0; j < n; j++) {
      grid[i][j] = " ";
    };
  }

  // Inner fuction used for recursion
  var drawSide = function(cursor, w, d, grid) {
    if (w <= 0) {
      return;
    }

    // draw the side
    cursor2 = [ cursor[0] + d[0] * w, cursor[1] + d[1] * w ];
    drawStraightLine(grid, cursor[0], cursor[1], cursor2[0], cursor2[1]);

    // Recurse
    rotateRight(d);
    cursor = cursor2;
    drawSide(cursor, w - 1, d, grid);
  }

  var cursor = [0, 0];
  var d = [1, 0];
  drawSide(cursor, n, d, grid);
  printGrid(grid);
};

var w = 32;
drawSpiral(w);
drawSpiralR(w);
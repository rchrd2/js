/**
 * Tower of Hanoi
 */


var Pole = function(num) {
  this.disks = [];
  if (num !== undefined) {
    for (var i = num; i > 0; i--) {
      this.disks.push(i);
    }
  }
};
/**
 * @param {Pole} d
 */
Pole.prototype.move = function(d) {
  if (this.disks.length > 0) {
    d.disks.push(this.disks.pop());
  }
};

/**
 * Move n disks from pole source to pole destination using pole spare as a spare
 * @param {Number} n
 * @param {Pole} a The source
 * @param {Pole} b The destination
 * @param {Pole} c The temp
 */
var Hanoi = function(n, a, b, c) { 
  // The base case. If there is only 1 disk on a, move it to b
  if (n === 1) {
    a.move(b);
    return;
  }

  // Step 1: Starting in the initial state - with all the disks on pole A -
  //    solve the problem 
  //        Hanoi(n - 1, a, c, b)
  //    That is, ignore the bottom (largest) disk and move top n -1 disks
  //    from Pole A to pole C using pole B as a spare.
  //    When you are finished, the largest disk will remain on Pole A, and 
  //    all the other disks will be on Pole C
  Hanoi(n - 1, a, c, b);

  // Step 2: Now, with the lagerst disk on Pole A and all others on Pole C,
  //    solve the problems 
  //        Hanoi(1, a, b, c)
  //    The largest disk will then be on Pole B
  Hanoi(1, a, b, c);

  // Step 3: Finally, with the largest disk on Pole B, and all other disks on 
  //    Pole C, solve the problem 
  //        Hanoi(n - 1, C, B, A)
  Hanoi(n - 1, c, b, a);
};

var tests = function() {
  var a = new Pole(20);
  var b = new Pole(0);
  var c = new Pole(0);
  console.log(a, b, c);
  Hanoi(a.disks.length, a, b, c);
  console.log(a, b, c);
};

tests();

/**
 * Resources:
 * - "Data Abtraction and Problem Solving with Java" published by Addison Wesly
 */

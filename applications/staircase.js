/**
 * Staircase question
 *
 * #9.1 from "Crack the coding interview"
 *
 * A child is running up the staircase with n steps, and can hop either 1 step,
 * 2 steps, or 3 steps at a time. Implement a method to count how many possible  * ways the child can run up the stairs.
 */

/** 
 * numSteps
 * @param {Number} n The number of steps
 * @param {Array<Number>} choices The available types of steps (eg [1, 2, 3])
 */
var numSteps = function(n, choices) {
  if (n < 0) {
    return 0;
  } else if (n === 0) {
    return 1;
  } else {
    var sum = 0;
    for (var i = 0; i < choices.length; i++) {
      sum = sum + numSteps(n - choices[i], choices);
    }
    return sum;
  }
};


var result = numSteps(10, [1, 2, 3]);
console.log(result);
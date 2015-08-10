/**
 * Function to generate all orderings of a string. Keep same characters,
 * but come up with all the combinations (|s|!)
 * @param {String} s
 */
var stringVariations = function(s, prefix) {
  var vars = [];
  prefix = prefix || "";
  console.log("stringVariation", s, prefix);
  if (s.length == 1) {
    vars.push(prefix + s);
  } else if (s.length > 0) {
    
    // generate the variations
    var char = s.substring(0, 1);
    s = s.substring(1);
    for (var i = 0; i <= s.length; i++) {
      var perm = prefix + s.substring(0, i) + char + s.substring(i);
      console.log("PERM", perm);
      vars.push(perm);
    }
    
    // RECURSION
    prefix = prefix + char;
    vars = vars.concat( stringVariations( s, prefix ) );
  }
  return vars;
};

/**
 * Swaps two characters in a string
 * @param {String} s
 * @param {Number} i
 * @param {Number} j
 */
var swap = function(s, i, j) {
  var sT = s;
  var si = s[i];
  var sj = s[j];
  s = s.substr(0, i) + sj + s.substr(i + 1);
  s = s.substr(0, j) + si + s.substr(j + 1);
  return s;
};

/**
 * Heaps algorithm
 *
 * This generates all of the permutations that end with the last element. 
 * And then recursively generates the next
 *
 * https://en.wikipedia.org/wiki/Heap%27s_algorithm
 *
 * @param {Number} n - length?
 * @param {String} s
 */
var generate = function(s, n) {
  // We need the length of s to start with
  if (n === undefined) { 
    n = s.length; 
  }
  
  // Base case where s is just 1
  if (n === 1) {
    return [s];
  } else {
    // The heart of it all
    var results = [];
    for (var i = 0; i < n -1; i++) {
      results = results.concat(generate(s, n - 1));
      if (n % 2 === 0) {
        // if n is even
        s = swap(s, i, n - 1);
      } else {
        s = swap(s, 0, n - 1);
      }
    }
    //console.log(s, n-1);
    results = results.concat(generate(s, n - 1));
    return results;
  }
}

var result = generate("Richard");
//console.log(result);
console.log(result.length);
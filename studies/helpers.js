/**
 * Helper function 
 */
var assert = function(expression, name) {
  if ( ! expression) {
    console.log('** Assertion failed', name || '')
  }
}

module.exports = {
  assert: assert,
};
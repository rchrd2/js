/**
 * A dependancy tree problem
 */

/**
 * @return {Object} the element row
 * @note note used
 */
var lookupElement = function(elements, name) {
  var found = null;
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].name === name) {
      found = elements[i];
      break;
    }
  }
  return found;
};

/**
 * @return {Array<Object>} the element row
 */
var lookupElementsByDependancy = function(elements, name) {
  var found = [];
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].dependencies.indexOf(name) >= 0) {
      found.push(elements[i]);
    }
  }
  return found;
};

/**
 * The idea behind this exercise is to simulate a dependancy graph.
 * For example, In EmberJS there are computed properties that only change when 
 * their dependancies change.
 * Or in template rendering there are often dependancies. Like in React you
 * only update the affected parts. 
 *
 * This solution uses an interative breadth first search approach. 
 * A recursive solution may have also been possible.
 *
 * @param {Array<Object>} elements
 * @param {String} changedElement This is just the name of the changed element
 *                      and therefore, lookup is required
 * @return {Array<String>} return an array of names that need to be redrawn
 */
var allDeps = function(elements, changedElement) {
  var visited = [];
  var queue = lookupElementsByDependancy(elements, changedElement);
  var element, eDep;
  while (element = queue.shift()) {
    visited.push(element.name);
    eDeps = lookupElementsByDependancy(elements, element.name);
    for (var i = 0; i < eDeps.length; i++) {
      if (visited.indexOf(eDeps[i].name) == -1 && changedElement != eDeps[i].name) {
        queue.push(eDeps[i]);
      }
    }
  }
  return visited;
}

/**
 * Tests
 */
var runTests = function() {
  var result;

  var elements = [
    { name: 'foo', dependencies: ['bar', 'baz'] },
    { name: 'bar', dependencies: ['ipsum'] },
    { name: 'lorum', dependencies: ['ipsum'] },
    { name: 'ipsum', dependencies: [] },
    { name: 'baz', dependencies: ['qwerty'] },
    { name: 'qwerty', dependencies: [] },
  ];

  result = allDeps(elements, 'bar');
  console.log('bar', result);
  console.assert(['foo'].toString() === result.toString());

  result = allDeps(elements, 'baz');
  console.log('baz', result);
  console.assert(['foo'].toString() === result.toString());

  result = allDeps(elements, 'ipsum');
  console.log('ipsum', result);
  console.assert(['bar', 'lorum', 'foo'].toString() === result.toString());
  
  result = allDeps(elements, 'qwerty');
  console.log('qwerty', result);
  console.assert(['baz', 'foo'].toString() === result.toString(), "qwerty");
};
runTests();


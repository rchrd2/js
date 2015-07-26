/** 
 * Gotcha
 */
for (var i = 0; i < 10; i++) {
  setTimeout(function() {
    console.log(i);
  }, 100);
}

/**
 * Fix
 */
for (var i = 0; i < 10; i++) {
  (function(i) {
    setTimeout(function() {
      console.log(i);
    }, 100);
  })(i)
}
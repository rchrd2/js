/**
 * The Rule is xn = xn-1 + xn-2 
 * with x1 == x2 = 1
 */
var fibonacci = function(n) {
  if (n < 2) {
    return 1;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

//console.log(fibonacci(10));

for (var i = 0; i < 10; i++) {
  console.log(i, fibonacci(i));
}
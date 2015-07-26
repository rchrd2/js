/**
 * A sandbox for Classical Inheritance
 *
 * See around line 70 for best example
 */

// http://stackoverflow.com/questions/29838735/basic-javascript-prototype-and-inheritance-example-for-animals

function Animal(name) {
   this.name = name;
}

// Example method on the Animal object
Animal.prototype.getName = function() {
    return this.name;
};

function Mammal(name, hasHair) {
    // Use the parent constructor and set the correct `this`
    Animal.call(this, name);

    this.hasHair = hasHair;
    alert('hi');
};

// Inherit the Animal prototype
// Note that 'create' is a new-ish method. Similar to `new Animal`
// Except it doesn't immediately call the constructor
Mammal.prototype = Object.create(Animal.prototype);

// Set the Mammal constructor to 'Mammal'
// Technically optionally, bc javascript compensates for it, but it's
// good ediquette
Mammal.prototype.constructor = Mammal;

Mammal.prototype.getHasHair = function() {
    return this.hasHair;
};

function Dog(name, breed) {
    // Use the parent constructor and set the correct `this`
    // Assume the dog has hair
    Mammal.call(this, name, true);

    this.breed = breed;
};

// Inherit the Mammal prototype
// Point to the prototype
// Note: Could also have used new Mammal(), but it runs the constructor
// See http://stackoverflow.com/a/14593952/1373318
Dog.prototype = Object.create(Mammal.prototype);

// THis is bad, it runs the constructor
//Dog.prototype = new Mammal();

// Set the Dog constructor to 'Dog'
Dog.prototype.constructor = Dog;

Dog.prototype.getBreed = function() {
    return this.breed;
};

//var fido = new Dog('Fido', 'Lab');
//this.fido = fido;


// More notes about new versus Object.create
// Jul 25, 2015, this is the best way I know up until now
// Note: I didn't include the prototype.constructor assignment and it still worked

var Foo = function() { 
  console.log('Foo constructor'); 
}
Foo.prototype.foo = 'From Foo';

var FooBar = function() { 
  console.log('FooBar constructor'); 
}
FooBar.prototype = Object.create(Foo.prototype);

var FooBaz = function() { 
  FooBaz.prototype.constructor.apply(this, arguments); 
  console.log('FooBaz constructor');
}
FooBaz.prototype = Object.create(Foo.prototype);

var FooHello = function() {
  FooHello.prototype.constructor.apply(this, arguments); 
  console.log('FooHello constructor');
}
FooHello.prototype = Foo.prototype;

new Foo();
// Outputs: "Foo constructor"
new FooBar();
// Outputs: "FooBar constructor"
new FooBaz();
// Outputs: "Foo constructor"
// Outputs: "FooBaz constructor"
new FooHello();

// Also helpful

FooBar.prototype.isPrototypeOf(fooBar)
// Outputs: true
Foo.prototype.isPrototypeOf(fooBar)
// Outputs: true
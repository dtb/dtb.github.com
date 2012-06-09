# Prototype WTF

	var Point = function(x, y) {
		this.x = x;
		this.y = y;

		this.log = function() {
			window.console.log(this.x, this.y);
		};
	};

	var myPoint = new Point(3, 10);

`new Point(3, 10)` does this:

1. Create a new, empty object (e.g., `var myPoint = { };`
2. Tell the new object to delegate its properties to the prototype of `Point`: `myPoint.__proto__ = Point.prototype`. Note that *we didn't define* `Point.prototype`.
3. Run the `Point` function in the context of the newly constructed object: `Point.call(myPoint, [3, 10])`

As you can see, this doesn't seem like inheritance at all! Objects created in this way *have no relation to each other whatsoever*. 

## Wait, what the hell is `__proto__`, and dela—*what*?

In step 2, we did this: `myPoint.__proto__ = Point.prototype`. What the hell does that do?

As it turns out, the secret-sauce powering prototypal inheritance is *delegation*: when you ask for `someObj.someProp`, 
the runtime walks up the prototype chain looking for a property called `someProp`. In pseudocode:

	// to access someProp of someObj, imagine I do this:
	object.getProperty(someObj, 'someProp');

    // we could define getProperty as follows:
    object.getProperty = function(obj, nameOfProperty) {
		while(obj) {
			if(obj.hasOwnProperty(nameOfProperty)) {
				return obj[nameOfProperty];
			}

			obj = obj.__proto__;
		}

		return undefined;
    };

## Why this is not “real” prototypal inheritance

In real prototypal inheritance, we would create an object called `Point`, which would serve as the “pattern” that describes other `Point`s.
Then we'd have some operator that create a new object that delegates to our `Point` object, so that when we look up properties on our new
`Point` object, the runtime works its way up the chain, stopping at `Point` on the way.

# Achieving real prototypal inheritance with JS

If we look carefully at step 2 above, we see a way to do real protypal inheritance with Javascript. We simpy need to make a function, assign its prototype, and then we can use `new`
to create objects that delegate correctly.

    var empty_constructor = function() { };

    var Point = {
    	'x': 0,
    	'y': 0,
    	'log': function() {
    		window.console.log(this.x, this.y);
    	}
    };

    empty_constructor.prototype = Point;

    var myPoint = new empty_constructor();

Now `myPoint` will delegate to `Point` properly 

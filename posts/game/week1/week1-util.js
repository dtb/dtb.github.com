//  We use [underscore.js](http://documentcloud.github.com/underscore/) to get some handy
//  functionality. `_.mixin` allows us to specify an object containing methods to add to 
//  underscore.
_.mixin({
    // Get a random number between `min` and `max`
    'randBetween': function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    // Round `numbah` to a specified number of of `digits`
    'round': function(numbah, digitz) {
        var scalesies = Math.pow(10, digitz);
        return Math.floor(numbah * scalesies) / scalesies;
    },
    // Returns true if the value is a scalar type
    'isPrimitive': function(val) {
        return _.isString(val) || _.isNumber(val);
    },
    // Returns the sign of the given value
    'sign': function(x) {
        return Math.abs(x) / x;
    },
    // Repeats a string `str` `times` times
    'repeatStr': function(str, times) {
        return new Array(times + 1).join(str);
    },
    // Sets up the inheritance chain so that the second argument's prototype is the 
    // first argument. This is from [backbone.js](http://documentcloud.github.com/backbone/docs/backbone.html),
    // see their [annotated source](http://documentcloud.github.com/backbone/docs/backbone.html#section-176) for more info.
    'inherits': function(parent, protoProps, staticProps) {
        var child;

        var ctor = function(){};
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ parent.apply(this, arguments); };
        }

        _.extend(child, parent);

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        if (protoProps) _.extend(child.prototype, protoProps);

        if (staticProps) _.extend(child, staticProps);

        child.prototype.constructor = child;

        child.__super__ = parent.prototype;

        return child;
    },
});


//[↩ return to the post](/blog/2012/05/27/writing-your-first-game-using-html5-canvas/)
//
//[↩ return to the the game code in week1.js](week1.html)

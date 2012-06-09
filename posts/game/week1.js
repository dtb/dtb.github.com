_.mixin({
    'randBetween': function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    'round': function(numbah, digitz) {
        var scalesies = Math.pow(10, digitz);
        return Math.floor(numbah * scalesies) / scalesies;
    },
    'isPrimitive': function(val) {
        return _.isString(val) || _.isNumber(val);
    },
    'sign': function(x) {
        return Math.abs(x) / x;
    },
    'repeatStr': function(str, times) {
        return new Array(times + 1).join(str);
    },
    'inherits': function(parent, protoProps, staticProps) {
        var child;

        var ctor = function(){};
        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ parent.apply(this, arguments); };
        }

        // Inherit class (static) properties from parent.
        _.extend(child, parent);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Add static properties to the constructor function, if supplied.
        if (staticProps) _.extend(child, staticProps);

        // Correctly set child's `prototype.constructor`.
        child.prototype.constructor = child;

        // Set a convenience property in case the parent's prototype is needed later.
        child.__super__ = parent.prototype;

        return child;
    },
});
var Game = _.inherits(function() { }, {
    'gameSpeed': -.15,
    'constructor': function() {
        this.lastPaint = Date.now();

        this.canvii = document.querySelectorAll('#sample1 canvas');
        this.canvIdx = 0;

        this.canvas = this.canvii[0];

        this.backbufferCanvas = this.canvii[1];

        this.context = this.canvas.getContext('2d');
        this.backbufferContext = this.backbufferCanvas.getContext('2d');

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.objects = [];

        this.initDots();

        var centerObj = new Drawable({
            x: this.width/2,
            y: this.height/2
        });
        this.objects.push(centerObj);   

        var self = this;
        this.draw = _.bind(this._draw, this);


        this.frames = 0;
        this.times = [];
        this.start = Date.now();
    },
    'initDots': function() {
        this.objects.unshift(new Background({
            vY: this.gameSpeed,
            y: this.height
        }));
    },
    '_draw': function() {
        if(!this.stop && this.objects.length > 1) {
            window.requestAnimationFrame(this.draw);
        }
        var self = this;
        var dT = Date.now() - this.lastPaint;
        var drawStart = Date.now();
        this.backbufferContext.clearRect(0, 0, this.width, this.height);
        this.objects.forEach(function(obj) {
            obj.draw(dT, self);
        });


        this.frames++;
        if(this.frames % 12 == 0) {
            this.fr = this.frames*1000/(Date.now() - this.start);
            this.frames = 0;
            this.start = Date.now();
        }
        this.lastPaint = Date.now();
        this.backbufferContext.strokeText(this.fr, 900, 20);
        this.swapsies();
    },
    'swapsies': function() {
        this.canvas = this.canvii[this.canvIdx];
        this.backbufferCanvas = this.canvii[1 - this.canvIdx];

        this.canvIdx = 1 - this.canvIdx;

        this.context = this.canvas.getContext('2d');
        this.backbufferContext = this.backbufferCanvas.getContext('2d');
        this.canvas.style.visibility = 'visible';
        this.backbufferCanvas.style.visibility = 'hidden';
    }

});

var Drawable = _.inherits(function() { }, {
    'state': { x: 0, y: 0, vX: 0, vY: 0 },
    //todo: do we need this?
    'initialState': { },
    'constructor': function(initialState) {
        this.state = _.extend({}, this.state, initialState);
        this.initialState = _.extend({}, this.initialState, this.state);
    },
    'draw': function(dT, game) {
        var centroid = {
            x: this.state.vX * dT + this.state.x,
            y: this.state.vY * dT + this.state.y,
        };

        this.doDraw(centroid, dT, game);

        this.state.x = centroid.x;
        this.state.y = centroid.y;
    },
    'doDraw': function(centroid, dT, game) {
        game.backbufferContext.beginPath(centroid.x, centroid.y);
        game.backbufferContext.arc(centroid.x - 5, centroid.y - 5, 10, 0,  2 * Math.PI);
        game.backbufferContext.stroke();
    }
});

var Background = _.inherits(Drawable, {
    'image': null,
    'ready': false,
    'constructor': function(initialState) {
        this.constructor.__super__.constructor.call(this, initialState);

        this.image = new Image();
        this.image.onload = _.bind(function() {
            this.ready = true;
        }, this);
        this.image.src = '/posts/game/game-bg.jpg';
    },
    'doDraw': function(centroid, dT, game) {
        if(!this.ready) 
            return;

        if(centroid.y <= 0) 
            centroid.y = game.height;

        game.backbufferContext.drawImage(this.image, 0, this.image.naturalHeight - centroid.y, this.image.naturalWidth, centroid.y, 0, 0, game.width, centroid.y);
        game.backbufferContext.drawImage(this.image, 
            /* sx */0, /* sy */ 0, 
            /* sw */ this.image.naturalWidth, /* sh */ this.image.naturalHeight - centroid.y, 
            /* dx */ 0,  /* dy */ centroid.y,
            /* dw */ game.width, /* dh */ this.image.naturalHeight - centroid.y
        );
    }
});

window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame;


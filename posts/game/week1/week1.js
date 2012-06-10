// Game code for week 1 of [Writing Your First Game Using HTML5 and Canvas](/blog/2012/05/27/writing-your-first-game-using-html5-canvas/)
// The game code uses [underscore.js](http://documentcloud.github.com/underscore/), and 
// some utility methods defined in [week1-util.js](week1-util.html)
//
// Currently, we have 3 objects: `Game`, `Drawable`, and `Background` (which uses 
// `Drawable` as its prototype.)


// `Drawable` is the prototype for all objects that can exist in our world. It currently
// provides in interface and some convenience methods to deal with drawing, and will
// later also deal with collision detection and input handling.
var Drawable = _.inherits(function() { }, {
    // Store the position and velocity of the current object.
    'state': { x: 0, y: 0, vX: 0, vY: 0 },
    // The constructor takes an initial state of the object, and merges it in with the defaults
    'constructor': function(initialState) {
        this.state = _.extend({}, this.state, initialState);
    },
    // Draw is called in the game loop, receiving the elapsed time `dT` and the game object.
    'draw': function(dT, game) {
    	// Update the x and y coordinates using the current velocities. 
    	// (This is sometimes called "integrating".)
        var centroid = {
            x: this.state.vX * dT + this.state.x,
            y: this.state.vY * dT + this.state.y,
        };

		// Hand off to the actual drawing method. Descendant objects override this to implement
		// custom drawing logic.
        this.doDraw(centroid, dT, game);

		// Finally update the state of the object.
        this.state.x = centroid.x;
        this.state.y = centroid.y;
    },
    // By default `Drawable` draws a circle at the current position
    'doDraw': function(centroid, dT, game) {
        game.backbufferContext.beginPath(centroid.x, centroid.y);
        game.backbufferContext.arc(centroid.x - 5, centroid.y - 5, 10, 0,  2 * Math.PI);
        game.backbufferContext.stroke();
    }
});

// `Background` is a `Drawable` that shows a scrolling background.
var Background = _.inherits(Drawable, {
    'image': null,
    'ready': false,
    // The constructor calls the constructor of `Drawable`, and fetches the background image.
    'constructor': function(initialState) {
        this.constructor.__super__.constructor.call(this, initialState);

        this.image = new Image();
        this.image.onload = _.bind(function() {
            this.ready = true;
        }, this);
        this.image.src = '/posts/game/game-bg.jpg';
    },
    // `doDraw` gets called by the logic in `Drawable`. In this case we override it to draw
    // the tiling background.
    'doDraw': function(centroid, dT, game) {
        // Don't begin drawing until the image has downloaded.
        if(!this.ready) 
            return;

		// Make the background wrap around the canvas.
        if(centroid.y <= 0) 
            centroid.y = game.height;

        // The tiling background is drawn in two slices. 
        //
        // `drawImage` takes a rectangle from the source image stretching from the 
        // coordinates (sx, xy) to (sx + sw, sy + sh), and draws it to the canvas in 
        // a rectangle defined similarly.
		//
		// We use this to draw a top slice and a bottom slice that move up in unison.
        game.backbufferContext.drawImage(
            this.image, 
            /* sx */ 0, 
            /* sy */ this.image.naturalHeight - centroid.y, 
            /* sw */ this.image.naturalWidth, 
            /* sh */ centroid.y, 
            /* dx */ 0, 
            /* dy */ 0, 
            /* dw */ game.width, 
            /* dh */ centroid.y);

        game.backbufferContext.drawImage(
            this.image, 
            /* sx */ 0, /* sy */ 0, 
            /* sw */ this.image.naturalWidth,
            /* sh */ this.image.naturalHeight - centroid.y, 
            /* dx */ 0,
            /* dy */ centroid.y,
            /* dw */ game.width,
            /* dh */ this.image.naturalHeight - centroid.y
        );
    }
});
// Define our game object. It has methods for setting up the rendering environment,
// initializing objects, and running the game. 
var Game = _.inherits(function() { }, {
    // The speed that objects in the game move at.
    'gameSpeed': -.15,
    'constructor': function() {
    	// Initialize the lastPaint time, which we use to calculate the elapsed time (`dt`)
    	// between frames.
        this.lastPaint = Date.now();

		// Use two canvas elements to do double-buffering, which prevents the user from
		// seeing flickering as we draw the scene.
		//
		// `canvas` is the element currently used to display the scene,  `backbufferCanvas`
		// is a hidden element that we draw the scene to.
		// 
		// When the scene is finished drawing, we swap the two.
        this.canvii = document.querySelectorAll('#sample1 canvas');

        this.canvas = this.canvii[0];

        this.backbufferCanvas = this.canvii[1];

        this.context = this.canvas.getContext('2d');
        this.backbufferContext = this.backbufferCanvas.getContext('2d');

		// `canvIdx` holds the index of the current display buffer. We flip this back and 
		// forth between 0 and 1 to swap the two canvases.
        this.canvIdx = 0;

        // Convenience methods for accessing the canvas size
        this.width = this.canvas.width;
        this.height = this.canvas.height;

		// We will put all the drawable objects in this array, later we loop over the 
		// array to draw the objects.
        this.objects = [];

        this.initBackground();

		// Draw a circle in the center as a placeholder for the player
        var centerObj = new Drawable({
            x: this.width/2,
            y: this.height/2
        });
        this.objects.push(centerObj);   

        // `_.bind` ensures that `this` always refers to the `Game` object when `draw`
        // is called from other contexts. We need this since `draw` is called from
        // `window.requestAnimationFrame`.
        this.draw = _.bind(this._draw, this);


		// These are used to track the framerate as a moving average.
        this.frames = 0;
        this.times = [];
        this.start = Date.now();
    },
    'initBackground': function() {
        // Initialize the background and add it to beginning of the objects array. It 
        // extends `Drawable`, so we can make it move just by
        // passing in an initial speed.
        this.objects.unshift(new Background({
            vY: this.gameSpeed,
            y: this.height
        }));
    },
    // `draw` starts the game loop. It will continue to call itself using 
    // [`requestAnimationFrame`](https://developer.mozilla.org/en/DOM/window.requestAnimationFrame)
    // until the game is told to stop. 
    '_draw': function() {
        if(!this.stop) {
            window.requestAnimationFrame(this.draw);
        }
        // Calculate the amount of time since the loop last ran (`dT`), also save the
        // time that we started drawing, for performance tracking.
        var dT = Date.now() - this.lastPaint;
        var drawStart = Date.now();

		// Clear the backbuffer, then ask the objects to draw themselves.
        this.backbufferContext.clearRect(0, 0, this.width, this.height);
        this.objects.forEach(function(obj) {
            obj.draw(dT, this);
        }, this);


        // Increment the frame counter. Every 12 frames (5 times per second, since we 
        // run at 60 fps), calculate a new moving average framerate.
        this.frames++;
        if(this.frames % 12 == 0) {
            this.fr = this.frames*1000/(Date.now() - this.start);
            this.frames = 0;
            this.start = Date.now();
        }

        // Store the time drawing ended.
        this.lastPaint = Date.now();

        // Draw the framerate.
        this.backbufferContext.strokeText(this.fr, 900, 20);

        // Finally, swap the backbuffer and the display buffer, which shows the new scene 
        // to the user.
        this.swapsies();
    },
    // Swaps the two canvas elements, and their contexts. Neat trick courtesy of [Fedor van Eldijk via StackOverflow](http://stackoverflow.com/questions/2795269/does-html5-canvas-support-double-buffering)
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

// A quick and dirty shim for `requestAnimationFrame`.
window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame;


// Now simply start the game by initializing it and calling the draw method.
//
// It can be stopped by setting `game.stop` to true.


// That's all the code so far! 
//
//[↩ return to the post](/blog/2012/05/27/writing-your-first-game-using-html5-canvas/)

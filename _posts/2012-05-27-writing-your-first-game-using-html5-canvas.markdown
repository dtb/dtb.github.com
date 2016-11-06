---
layout: post
title: Writing your first game using html5 and canvas
summary: "A lightweight structure for your html5 game that keeps you moving fast"
permalink: /blog/:year/:month/:day/:title
styles: "
article img {
    border:1px solid #CCC;
}
canvas{
    position:absolute;
    top:0;
    left:0;
    visibility:hidden;
}
#sample1 {
    width:980px;
    height:551px;
    border:1px inset #ccc;
    position:relative;
    margin-left:-190px;
}
#sample1 #shim {
    width:980px;
    height:551px;
    position:absolute;
    top:0;
    left:0;
    background:white;
    cursor:pointer;
    z-index:2;
}
#shim div {
    text-align: center;
    font-size: 24px;
    margin-top: 239px;
    color: blue;
    text-decoration: underline;
}
#sample1 button {
    position:absolute;
    bottom:3px;
    right:5px;
}
"
---

# Writing <del>your</del> <del>my</del> our first game using html5 and canvas

<span class="pubdate">published 9 jun 2012</span>

I recently decided to write an HTML5 game using the `canvas` tag. I'd made some little animated toys using `canvas` 
with my [particle systems](/blog/2011/06/22/drawing-simple-particle-systems-with-html5-canvas-tag/),
but now I wanted to do something bigger and more interactive. Even on the small projects 
before, the code had a habit of turning into a horrible fucking mess of procedural crap 
that was too hard to follow. I couldn't imagine building something more ambitious in that 
same ad-hoc style.

Like everything that can be accomplished with programming, I've always assumed I know how
to write a game. After all, I know to program. The rest is just filling in the details. 
With this game, I decided to put that theory to the test. 

## Choosing my first game

For my first game, I wanted to write something simple, but still with the key components of
a game, like animation, collision detection, and player input. I picked a
game I remembered played on my TI-83 calculator in high school:

<div>
	<img src="/media/falling.mockup.jpeg" alt="game concept" />
</div>

In the game, you control the blue circle. As the platforms move up, you have to steer yourself
into the gaps to avoid getting crushed to a poorly-rendered red pulp by the spikes.

## Structuring a game

The structure of a game in pseudo-code is as follows. In reality, we want to split the 
game up into some nice objects, so that it's clearer who plays what role, but this is the 
basic skeleton.

{% highlight javascript %}
function game() {
    initialize();

    // do the following in a loop that executes at 60 frames per 
    // second
    window.setInterval(function() {
        //receive input 
        handleInput();

        //update the state and position of objects
        update();

        // handle collisions
        collide();

        // draw the scene
        draw();
    }, 1000/60);
}
{% endhighlight %}

## Getting started

Now, we want to fill in some of the objects we'll use to structure our game. If you'd like
more detail, check out the [annotated source](/posts/game/week1/docs/week1.html).

Much of the skeleton we saw before is reflected in the `Game` object. The Game object
is the boss that handles coordinating the objects and running the animation loop. 

{% highlight javascript %}
// _.inherits sets up the prototype chain, so that the first argument 
// is the prototype for the object in the second argument.
var Game = _.inherits(function() { }, {
    'constructor': function() {
        // initialize canvases
        // create drawable objects
        // prepare for drawing
    }, 
    'draw': function() {
        // calculate time since last draw
        // loop over and draw each of our drawable objects
    }
});
{% endhighlight %}

Like any good leader, the Game object delegates the detail work to various specialists
that know exactly how to do their jobs. The `Drawable` object specializes in—surprise!—drawing.
The `Game` can draw all the objects in our world without caring about the specific way that happens.
Drawable also forms the prototype for more-specialized drawing objects.

{% highlight javascript %}
var Drawable = _.inherits(function() { }, {
    'state': { x: 0, y: 0, vX: 0, vY: 0 },
    'constructor': function(initialState) {
        // initialize state object with initial given state
    },
    'draw': function(dT, game) {
        // multiply the velocity by the time to get a new position

        // draw -- this function will be replaced in descendant classes
        this.doDraw(centroid, dT, game);

        // save state
    },
    'doDraw': function(centroid, dT, game) {
        // draw the actual object
    }
});
{% endhighlight %}

An example of a specialized `Drawable` is the `Background` object, which handles drawing
the scrolling background for the game.

{% highlight javascript %}
// Background's prototype is the Drawable class
var Background = _.inherits(Drawable, {
    'image': null,
    'ready': false,
    'constructor': function(initialState) {
        // call the parent constructor
        this.constructor.__super__.constructor.call(this, initialState);

        // fetch the image, and track when it loads
        this.image = new Image();
        this.image.onload = _.bind(function() {
            this.ready = true;
        }, this);
        this.image.src = '/posts/game/game-bg.jpg';
    },
    'doDraw': function(centroid, dT, game) {
        if(!this.ready) return;
        if(centroid.y <= 0) 
            centroid.y = game.height;

        // draw the image in two slices

        // first the top slice
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

        // and second the bottom slice 
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
{% endhighlight %}

At this point, we have a nice structure for a game, and an animating background to boot.
If you'd like, you can read the full, [annotated source for the game](/posts/game/week1/docs/week1.html), and here it 
is in action:


<div id="sample1">
    <div id="shim"> 
        <div>Click to start</div>
    </div>
    <canvas width="980" height="551">
    </canvas>
    <canvas width="980" height="551">
    </canvas>
    <button id="stop">◼ Stop</button>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"> </script>
<script src="/posts/game/week1/week1-util.js"> </script>
<script src="/posts/game/week1/week1.js"> </script>
<script>
    var game = new Game();
    document.getElementById('shim').onclick = function() {
        this.style.display = 'none';
        game.draw();
    };

    document.getElementById('stop').onclick = function() {
        game.stop = true;
    };
</script>

## Next steps

At this point, if I told you this was a game, you'd call me a goddamn liar. Next we'll add 
input handling, so the player can move, and then obstacles and collision detection.

## Resources

Here's the best of the million tabs I had open while I was doing this first part of the game.

- This [HTML5 Canvas Cheat Sheet](http://blog.nihilogic.dk/2009/02/html5-canvas-cheat-sheet.html) 
  for a quick reference on `canvas`. This is always open in a tab when I'm working on 
  canvas stuff.
- In case you missed it, the full [annotated source](/posts/game/week1/docs/week1.html) for this game so far.
- MDN's [Canvas tutorials](https://developer.mozilla.org/en/Canvas_tutorial) for a basic
  introduction to drawing with the 2d context. Their [Using images](https://developer.mozilla.org/en/Canvas_tutorial/Using_images) page
  in particular has some helpful images for understanding image slicing.
- The [canvas 2dcontext spec](http://www.w3.org/TR/2dcontext/) from the w3, for when you need 
  to know *exactly* what your code should do.
- The [annotated source](http://documentcloud.github.com/backbone/docs/backbone.html) for
  thinking about prototypal inheritance in js, especially the 
  [inherits method](http://documentcloud.github.com/backbone/docs/backbone.html#section-176).
- [Douglas Crockfords take](http://javascript.crockford.com/prototypal.html) on protypal
  inheritance in JS.

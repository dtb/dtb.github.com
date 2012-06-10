---
layout: post
title: Writing your first game using html5 and canvas
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

I recently started writing my first game using html5 and canvas, and thought
I would turn it into a series of blog posts. This tutorial series should be 
great for people who comfortable with programming javascript and are interested
in making interactive toys using HTML5's canvas tag.

This game will allow us to learn about many of the basic elements of a game:

1. Simple graphics
1. Animation
3. Handling input from the player
2. Simple collision detection

## Choosing our first game

For our first game, we want to write something simple that will touch on all the 
basic aspects of a game. The game I picked is a
game I remembered played on my TI-83 calculator in high school:

![game concept.](/media/falling.mockup.jpeg)

In the game, you control the blue circle. Your goal is to continue falling through the 
gaps in the moving platforms as long as you can without hitting the spikes on the
ceiling. This game isn't going to knock anyone's socks off, but I wasted a reasonable 
amount of time in math class playing it, which is a pretty good target to shoot for on a 
first game.

## Structuring a game

The first thing we want to do is establish a basic structure and then we'll get some 
movement going. The structure of a game in pseudo-code is as follows:

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
more detail, check out the [annotated source](/posts/game/week1/docs/week1.html). First is
the `Game` object, which manages all the objects in the game, runs the animation loop, 
and provides the interface to the game from the outside world.

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

Next, is the `Drawable` object, which provides a simple interface to be drawn to the 
canvas. This object allows the `Game` to draw all drawable objects without caring about
the specific implementation or appearance of the object. It also gives us a common place
to put drawing and update related functionality. It is the prototype ("base class") for 
all drawable objects.


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

Finally, an example `Drawable` instance is the `Background` object, which handles drawing
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
<script src="http://documentcloud.github.com/underscore/underscore-min.js"> </script>
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

As a "game" this is obviously quite dissatisfactory. Next we'll add input handling, so 
the player can move, and then obstacles and collision detection.

## Resources

I'll try to put together a list of helpful resources each week. For this week:

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

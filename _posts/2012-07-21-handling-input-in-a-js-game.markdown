---
layout: post
title: Handling input in a javascript game
styles: "
"
---

# Handling input in a javascript game

<span class="pubdate">published 21 jul 2012</span>

In my last post about [writing html5/js games](/blog/2012/05/27/writing-your-first-game-using-html5-canvas/),
I focused on how to structure your game to keep the code manageable. I established a simple
structure consisting of a simple `Game` object that manages the objects in the world and
the animation loop, and a `Drawable` object that provides a simple interface for the `Game`
object to draw and interact with objects that exist.

In this post, I'm going to continue with the same game concept, this time adding input handling,
which will allow the player to move their little guy around.

If you think about it, there are really two parts to being able to handle input. The first
part is keeping track of what the actual input is—in this case, what keyboard keys are pressed— 
and the second is reacting to that input. For this game, I created an `InputManager` object
to track the input, and then the `Player` or `Drawable` objects can react accordingly.

Handling input is actually really easy. All we need to do is add a listener on the window or canvas' `keydown` event
that stores the key being pressed, and then another listener on `keyup` that removes that 
key from the list of active keys. The `InputManager` is below:

{% highlight javascript %}
var InputManager = inherits(function() { }, {
  // keycodes from jQuery UI: 
  // https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.core.js
  // thanks guys!
  'Keys': {
    'BACKSPACE': 8,
    'COMMA': 188,
    'DELETE': 46,
    'DOWN': 40,
    'END': 35,
    'ENTER': 13,
    'ESCAPE': 27,
    'HOME': 36,
    'LEFT': 37,
    'NUMPAD_ADD': 107,
    'NUMPAD_DECIMAL': 110,
    'NUMPAD_DIVIDE': 111,
    'NUMPAD_ENTER': 108,
    'NUMPAD_MULTIPLY': 106,
    'NUMPAD_SUBTRACT': 109,
    'PAGE_DOWN': 34,
    'PAGE_UP': 33,
    'PERIOD': 190,
    'RIGHT': 39,
    'SPACE': 32,
    'TAB': 9,
    'UP': 38
  },
  '_keysDown': {},
  'constructor': function() {
    window.addEventListener('keydown', _.bind(this._onkeydown, this));
    window.addEventListener('keyup', _.bind(this._onkeyup, this));
  },
  '_onkeydown': function(ev) {
    // ev is the event object, and it has the "which" member,
    // that says which key is pressed.
    this._keysDown[ev.which] = true;
  },
  '_onkeyup': function(ev) {
    this._keysDown[ev.which] = false;
  },
  'keyDown': function(key) {
    // simply returning this._keysDown[key] would give "undefined"
    // instead of false if the key was never pressed. Adding two 
    // "!"s makes sure that it's always either true or false
    return !!this._keysDown[key];
  }
});
{% endhighlight %}

The `Game` object creates an `InputManager` object when it starts, and then holds on to
it. The `Drawable` objects all receive the `Game` object when their `draw` function is called,
so if they need to handle input, they can just use the `InputManager`.

Here is an example of a player `Drawable`, which checks for the left or right arrow keys,
and then moves the player left or right accordingly.

{% highlight javascript %}
var Player = inherits(Drawable, {
  'doDraw': function(centroid, dT, game) {
    if(game.inputManager.keyDown(game.inputManager.Keys.LEFT)) {
      centroid.x -= 20;
    }

    if(game.inputManager.keyDown(game.inputManager.Keys.RIGHT)) {
      centroid.x += 20;
    }
    if(centroid.x - 5 < 0) {
      centroid.x = 20;
    }
    if(centroid.x + 5 >= game.width) {
      centroid.x = game.width - 6;
    }

    this.constructor.__super__.doDraw.call(this, centroid, dT, game);
  }
});
{% endhighlight %}


Now we have a nice object we can use to make our game interactive, and have properly separated
out functionality between utility objects—`InputManager`—and the actual objects that are 
part of the game—like `Player`. Aside from being nice and easy to read, this means
that when we go on to write our second game, we'll have built up a nice library of objects
we can use to speed up the development process.

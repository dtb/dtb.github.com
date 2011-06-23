---
layout: post
title: Drawing Simple Particle Systems with HTML5's Canvas Tag
styles: ".canvasgroup {
	text-align:center;
}
canvas {
	border: 1px inset #999;
	background:white;
}
"
---

# Drawing Simple Particle Systems with HTML5's Canvas Tag

Inspired by [this awesome series of articles][insp] on BIT-101 (Keith Peters' blog, which I found via a tweet from Paul irish)
intended to introduce Flash developers to `<canvas>`, I finally decided to get down to learning some canvas tag for myself. 
Here's a few things I made.

## Basics: a vibrating particle system

To start off, I wanted to just get a handle on drawing and animating the particles using the 2D canvas API. First,
I made an array of points with a randomized x and y position. Then, using `setInterval`, I made timer that every
20 milliseconds moved those particles a random amount, and then redrew them.

<div class="canvasgroup">
	<div class="canvascontainer">
			<canvas width="400" height="400" id="random"></canvas>
	</div>
	<script src="/canvas2/random.particles.js"> </script>
	<script> 
		var randomDrawing = drawRandom("random"); 
	</script>
	<button class="start" onclick="randomDrawing.start();"> ► Start</button>
	<button class="stop" onclick="randomDrawing.stop();"> ◼ Stop</button>
</div>

## Less chaos: falling particles

Next, I wanted to animate the particles in a more systematic way, so I made them fall with gravity. For this first
example, I used the formula `x=.5*a*t^2+v0*t+x0`, where `x0` means the initial position, `t` is the elapsed time, and
`a` is the acceleration. In practice, I just tweaked `a` until it fell at a rate I found appealing. I also gave
the particles a randomized initial velocity. Once they hit the ground, they stay there.

<div class="canvasgroup">
	<div class="canvascontainer"><canvas width="400" height="400" id="falling"></canvas></div>
	<script src="/canvas2/falling.particles.js"> </script>
	<script> 
		var fallingDrawing = falling("falling"); 
	</script>
	<button class="start" onclick="fallingDrawing.start();"> ► Start</button>
	<button class="stop" onclick="fallingDrawing.stop();">◼ Stop</button>
</div>

## More chaos! Bouncing particles

Another simple addition to this was to make the particles bounce off the walls. Learning from the previous code, instead
of calculating the position using a formula, I simply tracked the x and y velocities of the particle and changed their 
velocities. Then, I moved the particle `vX` and `vY` units each time step. 

<div class="canvasgroup">
	<div class="canvascontainer"><canvas width="400" height="400" id="bouncing"></canvas></div>
	<script src="/canvas2/bouncing.particles.js"> </script>
	<script> 
		var bouncingDrawing = bouncy("bouncing"); 
	</script>
	<button class="start" onclick="bouncingDrawing.start();"> ► Start</button>
	<button class="stop" onclick="bouncingDrawing.stop();">◼ Stop</button>
</div>

## Emitting Particles

The first three follow from each other in a pretty straightforward way, so I wanted to do something else. One of the next steps
suggested by BIT-101 was to make a particle emitter. Particles emerge from a selected point (the emitter) and are given an x and 
y velocity. As they go off screen, the emitter recycles them, spewing them out again with a new velocity. I was also tired of my 
ugly black-border circles, so I changed to using filled circles of random radius, which actually look pretty nice.

<div class="canvasgroup">
	<div class="canvascontainer"><canvas width="400" height="400" id="emit"></canvas></div>
	<script src="/canvas2/emitted.particles.js"> </script>
	<script> 
		var emitDrawing = emit("emit"); 
	</script>
	<button class="start" onclick="emitDrawing.start();"> ► Start</button>
	<button class="stop" onclick="emitDrawing.stop();">◼ Stop</button>
</div>

## Particle networks!

Finally I wanted to do something way different, so I looked again at BIT-101. Keith has a series of articles ([start here][pretty])
where he draws a series of connected points that end up looking [very pretty][pretty2]. I figured I wanted to do something along
those lines.

In my case, I decided I'd draw simple points that floated around and made connections with the nearby points around them. To keep
from drawing connections between points twice (which ends up looking bad), I had to made a connectivity matrix— a matrix such that
`matrix[i][j] == matrix[j][i] == 1` iff a line has been drawn between `points[i]` and `points[j]`. Incidentally, finding
nearby points is done using a dumb `O(n^2)` search. I'd be intrigued if there's a way of doing it faster. Pretty curves
are drawn between points using `drawQuadraticCurveTo` (2nd order b-splines!)

<div class="canvasgroup">
	<div class="canvascontainer"><canvas width="400" height="400" id="connect"></canvas></div>
	<script src="/canvas2/connected.particles.js"> </script>
	<script> 
		var connectedDrawing = connected("connect"); 
	</script>
	<button class="start" onclick="connectedDrawing.start();"> ► Start</button>
	<button class="stop" onclick="connectedDrawing.stop();">◼ Stop</button>
</div>




[insp]: http://www.bit-101.com/blog/?cat=17
[pretty]: http://www.bit-101.com/blog/?p=3214
[pretty2]: http://www.bit-101.com/jscanvas/mar25.html
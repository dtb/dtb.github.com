function emit(canvasId)
{
	var NUM_POINTS = 50;
	var canvas = document.getElementById(canvasId);
	var context = canvas.getContext("2d");
	
	var points = [],
		width = canvas.width,
		height = canvas.height,
		interval;
	
	var gravity = .25;
	
	var emitter = { x: randBtwn(0, width), y: randBtwn(0, height) };
	
	
	function randBtwn(min, max)
	{
		return min + (max - min) * Math.random();
	}
	
	function resetPoint(p)
	{
		p.x  = emitter.x;
		p.y  = emitter.y;
		p.vY = randBtwn(-3, 5);
		p.vX = randBtwn(-3, 5);
		p.radius = randBtwn(6, 12);
	}
	
	function initPoint()
	{	
		var p = { };
		resetPoint(p);
		return p;
	}
	
	function addPoint()
	{
		if(points.length < NUM_POINTS)
			points.push(initPoint());
	}
	
	var circRadius = 4;//pix
	function draw()
	{
		context.clearRect(0, 0, width, height);
		var point, i;
		for(i = 0; i < points.length; i++)
		{
			point = points[i];
			context.beginPath(point.x, point.y);
			context.fillStyle = 'rgba(0,0,0, '+ emitter.y/point.y - 1  +')'
			context.arc(point.x, point.y, point.radius, 0, 2*Math.PI);
			context.fill();
		}
	}
	
	function move(t)
	{
		points.forEach(function(point)
		{
			if((point.y > (height - point.radius) || point.y < point.radius)
				||
				(point.x > (width - point.radius) || point.x < point.radius))
			{
				resetPoint(point);
			}
			point.vY += gravity;
			
			point.x += point.vX;
			point.y += point.vY;
		});
	}
	return {
		'start': function() {
			var start = new Date();
			
			points = [];
			window.clearInterval(interval);
			interval = window.setInterval(function(){ addPoint(); move(new Date() - start); draw(); }, 1000/30);	
		},
		'stop': function() {
			window.clearInterval(interval);
		}
	};
	
}

var drawRandom = function(canvasId) 
{
	var NUM_POINTS = 50;
	
	var canvas = document.getElementById(canvasId);
	var context = canvas.getContext("2d");
	
	var points = [],
		width = canvas.width,
		height = canvas.height,
		interval;
	
	function randBtwn(min, max)
	{
		return min + (max - min) * Math.random();
	}
	
	function init()
	{
		for(var i = 0; i < NUM_POINTS; i++)
		{
			points.push({
				x: Math.random() * width,
				y: Math.random() * height
			});
		}
	}
	
	var circRadius = 6;//pix
	function draw()
	{
		context.clearRect(0, 0, width, height);
		var point, i;
		for(i = 0; i < points.length; i++)
		{
			point = points[i];
			context.beginPath(point.x, point.y);
			context.arc(point.x, point.y, circRadius, 0, 2*Math.PI);
			context.stroke();
		}
	}
	
	function move()
	{
		points.forEach(function(point)
		{
			point.x = (point.x + randBtwn(-1, 1) * 2) % width;
			point.y = (point.y + randBtwn(-1, 1) * 2) % height;
		});
	}
	
	init();
	
	return {
	    'stop': function() {
	        window.clearInterval(interval);
	    },
	    'start': function() {
	        window.clearInterval(interval);
	        points = [];
	        init();
	        interval = window.setInterval(function(){ move(); draw(); }, 20);
	    }
	}
};

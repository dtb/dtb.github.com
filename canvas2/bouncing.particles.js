function bouncy(canvasId) {
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
		points = [];
		
		for(var i = 0; i < NUM_POINTS; i++)
		{
			var x = Math.random() * width
				, y = Math.random() * height
				, vX = randBtwn(-3, 3)
				, vY = randBtwn(-3, 3);
				
			points.push({
				x: x,
				y: y,
				vY: vY,
				vX: vX,
				vY0: vY,
				vX0: vX
			})
		}
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
			context.arc(point.x, point.y, circRadius, 0, 2*Math.PI);
			context.stroke();
		}
	}
	
	function move(t)
	{
		points.forEach(function(point)
		{
			if(point.y > (height - circRadius) || point.y < circRadius)
			{
				point.vY *= -1;
			}
			
			if(point.x > (width - circRadius) || point.x < circRadius)
			{
				point.vX *= -1;
			}
			
			point.x += point.vX;
			point.y += point.vY;
		});
	}
	
	return {
		'start': function() {
			window.clearInterval(interval);
			
        	init();
			var start = new Date();
			interval = window.setInterval(function(){ move(new Date() - start); draw(); }, 20);
		},
		'stop': function() {
			window.clearInterval(interval)
		}
	};	
};
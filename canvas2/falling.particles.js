var falling = function(canvasId)
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
        points = [];
    	for(var i = 0; i < NUM_POINTS; i++)
    	{
    		var x = Math.random() * width
    			, y = Math.random() * height
    			, initVy = randBtwn(-.1, .1);
			
    		points.push({
    			x: x,
    			y: y,
    			initX: x,
    			initY: y,
    			initVy: initVy
    		})
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

    function move(t)
    {
    	points.forEach(function(point)
    	{
    		pos = .5 * -.0001  * t * t + point.initY + point.initVy * t;
    		point.y = height - (pos > circRadius ? pos : circRadius);
    	});
    }

    init();
    
    return {
      "start": function() {
          window.clearInterval(interval);
          var start = new Date();
          interval = window.setInterval(function(){ move(new Date() - start); draw(); }, 20);
      },
      'stop': function() {
          window.clearInterval(interval);
      }
        
    };
    
};
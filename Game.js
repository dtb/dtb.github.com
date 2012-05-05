(function(Falling, _) {

	Falling.Game = _.inherits(function() { }, {
		'canvas': null,
		'width': 0,
		'height': 0,
		'context': null,
		'backbufferCanvas': null,
		'backbufferContext': null,
		'lastPaint': null,
		'objects': [],
		'gameSpeed': -.25,
		'canvIdx': 0,
		'framerate' : 0,
		'inputManager': null,
		'_debugLines': [],
		'constructor': function(canvasId) {
			this.canvii = document.getElementsByTagName('canvas');

			this.swapsies();

			this.width = this.canvas.width;
			this.height = this.canvas.height;

			this.draw = _.bind(this._draw, this);
			this.debugObject = _.bind(this._debugObject, this);

			this.frames = 0;
			this.times = [];
			this.start = Date.now();

			this.lastPaint = Date.now();

			this.inputManager = new Falling.InputManager();

			this.initObjects();
		},
		'initObjects': function() {
			var centerObj = new Falling.Player({
				x: this.width/2,
				y: this.height/2
			});
			this.objects.push(centerObj);	

			this.initBackground();
		},
		'initBackground': function() {
			this.objects.unshift(new Falling.Background({
				vY:this.gameSpeed,
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
				this.framerate = this.frames*1000/(Date.now() - this.start);
				this.frames = 0;
				this.start = Date.now();

			}
			this.lastPaint = Date.now();
			this.debug(_.round(this.framerate, 3) + " fps");
			this.drawDebug();
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
			this.backbufferContext.clearRect(0,0,this.width, this.height);
		},
		'debug': function(obj) {
			if(_.isPrimitive(obj)) {
				this._debugLines.push(obj);
			} else if(_.isObject(obj)) {
				var self = this;
				this._debugLines.push('object {');
				_.each(obj, this.debugObject);
				this._debugLines.push('}');
			}
		},
		'_debugObject': function(v, k, l, indent) {
			indent = indent || 1;
			var tabs = _.repeatStr("  ", indent);
			if(_.isArray(v) && _.all(v, _.isPrimitive)) {
				this._debugLines.push(tabs + k + ': [' + v.map(this.debugPrimitive).join(', ') + ']');
			} else if(_.isObject(v) || _.isArray(v)) {
				if(_.isArray(v)){
					var syms = ['{', '}'];
				} else {
					var syms = ['[', ']'];
				}
				this._debugLines.push(tabs + k + ': ' + syms[0]);
				_.each(v, function(v, k, l) { this.debugObject(v, k, l, indent + 1) }, this);
				this._debugLines.push(tabs + syms[1]);
			} else {
				this._debugLines.push(tabs + k + ': ' + this.debugPrimitive(v));
			}
		},
		'debugPrimitive': function(v) {
			if(_.isString(v)) {
				return '"' + v + '"';
			} else {
				return v.toString();
			}
		},
		'printDebug': function() {
			console.log(this._debugLines.join("\n"));
			this.debugLines = [];
		},
		'drawDebug': function() {
			var pos = 15;
			this.backbufferContext.font = '10px courier';
			_.each(this._debugLines, function(v) {
				this.backbufferContext.fillText(v, 5, pos);	
				pos += 18;
			}, this);
			this._debugLines = [];
		}
	});
})(window.Falling, _);

(function(Falling, _) {

	Falling.Game = _.inherits(function() { }, {
		'canvas': null,
		'width': 0,
		'height': 0,
		'context': null,
		'backbufferCanvas': null,
		'backbufferContext': null,
		'lastUpdate': null,
		'objects': [],
		'canvIdx': 0,
		'framerate' : 0,
		'inputManager': null,
		'obstacleHeight': 15,
		'obstacles':[],
		'_debugLines': [],
		'player': null,
		'constructor': function(canvasId) {
			this.canvii = document.getElementsByTagName('canvas');

			this.swapsies();

			this.width = this.canvas.width;
			this.height = this.canvas.height;

			this.debugObject = _(this._debugObject).bind(this);
			this.loop = _(this._loop).bind(this);

			this.frames = 0;
			this.times = [];
			this.start = Date.now();

			this.lastUpdate = Date.now();

			this.inputManager = new Falling.InputManager();

			this.initObjects();
		},
		'shouldMakeObstacles' : function() {
			return this.obstacles.length < 10;
		},
		'updateObstacles': function() {
			this.obstacles = this.obstacles.filter(function(obst) {
				return !(obst.state.x > this.width || obst.state.x < 0
					|| (obst.state.y) > this.height || (obst.state.y + obst.height) < 0);
			}, this);

			if(this.obstacles.length > 0) {
				var curPos = this.obstacles[this.obstacles.length - 1].state.y + 5 * this.obstacleHeight;
			} else {
				var curPos = this.height/2;
			}
			while(this.shouldMakeObstacles()) {
				var width = _.randBetween(80, this.width - 80);
				this.obstacles.push(new Falling.Obstacle({
					'holePos': _.randBetween(0, this.width),
					'height': this.obstacleHeight,
					'y': curPos,
				}, this));

				curPos += 5 * this.obstacleHeight

			}
		},
		'initObjects': function() {
			this.initBackground();

			this.player = new Falling.Player({
				x: this.width/2,
				y: this.height/2
			});
			this.objects.push(this.player);	

			this.updateObstacles();

		},
		'initBackground': function() {
			this.background = new Falling.Background({
				vY:Falling.gameSpeed,
				y: this.height
			});
			this.objects.push(this.background);
		},
		'_loop': function() {
			var dT = Date.now() - this.lastUpdate;
			var drawStart = Date.now();

			if(!this.stop && this.objects.length > 1) {
				window.requestAnimationFrame(this.loop);
			}

			this.updateObstacles();
			this.obstacles.forEach(function(obst) {
				if(this.player.checkCollision(obst)) {
					this.player.handleCollision(obst);
				}
			}, this);

			this.background.update(dT, this);
			this.player.update(dT, this);
			_(this.obstacles).invoke('update', dT, this);

			this.draw(dT);

			this.lastUpdate = Date.now();
		},
		'draw': function(dT) {

			this.backbufferContext.clearRect(0, 0, this.width, this.height);

			_(this.objects).invoke('draw', dT, this);
			_(this.obstacles).invoke('draw', dT, this);

			this.frames++;
			if(this.frames % 12 == 0) {
				this.framerate = this.frames*1000/(Date.now() - this.start);
				this.frames = 0;
				this.start = Date.now();
			}

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

(function(Falling, _) {
	Falling.Drawable = _.inherits(function() { }, {
		'state': { x: 0, y: 0, vX: 0, vY: 0 },
		//todo: do we need this?
		'initialState': { },
		'constructor': function(initialState) {
			this.state = _.extend({}, this.state, initialState);
			this.initialState = _.extend({}, this.initialState, this.state);
		},
		'draw': function(dT, game) {
			var centroid = {
				x: this.state.vX * dT + this.state.x,
				y: this.state.vY * dT + this.state.y,
			};

			this.doDraw(centroid, dT, game);

			this.state.x = centroid.x;
			this.state.y = centroid.y;
		},
		'doDraw': function(centroid, dT, game) {
			game.backbufferContext.beginPath(centroid.x, centroid.y);
			game.backbufferContext.arc(centroid.x - 5, centroid.y - 5, 10, 0,  2 * Math.PI);
			game.backbufferContext.stroke();
		}
	});

})(window.Falling, _);

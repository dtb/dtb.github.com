(function(Falling, _) {
	Falling.Drawable = _.inherits(function() { }, {
		'state': { x: 0, y: 0, vX: 0, vY: 0 },
		'hasGravity': false,
		//todo: do we need this?
		'initialState': { },
		'constructor': function(initialState) {
			this.state = _.extend({}, this.state, initialState);
			this.initialState = _.extend({}, this.initialState, this.state);
		},
		'update': function(dT, game) {
			this.state.x = this.state.vX * dT + this.state.x;
			this.state.y = this.state.vY * dT + this.state.y;
			if(this.hasGravity) {
				this.state.vY += Falling.G * dT;
			}
		},
		'draw': function(dT, game) {
			game.backbufferContext.beginPath(this.state.x, this.state.y);
			game.backbufferContext.arc(this.state.x, this.state.y, 10, 0,  2 * Math.PI);
			if(this.stroke) {
				game.backbufferContext.save();
				game.backbufferContext.strokeStyle = this.stroke;
			}
			game.backbufferContext.stroke();
			game.backbufferContext.restore();
			delete this.stroke;

		}
	});

})(window.Falling, _);

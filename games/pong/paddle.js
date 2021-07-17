export default class Paddle {
	constructor(game, acceleration, maxSpeed, player = 1, controllable = false, playerId = null) {
		this.game = game;
		this.context = game.contexts.game.context;
		this.canvas = game.contexts.game.canvas;

		this.acceleration = acceleration;
		this.maxSpeed = maxSpeed;
		this.player = player;
		this.controllable = controllable;
		this.playerId = playerId;

		this.width = this.canvas.width / 46;
		this.height = this.canvas.height / 3.5;
		this.x = 0;
		this.y = 0;
		this.dx = 0;
		this.dy = 0;
		this.color = '#ffffff';

		//the second player's paddle should be on the right side of the screen
		if (player === 2) {
			this.x = this.canvas.width - this.width;
		}

		//use a different color for the playlable/controllable paddle
		if (this.controllable) {
			this.color = '#b47afd';
		}
	}

	move() {
		if (this.controllable) {
			const inputs = this.playerId ? this.game.inputs[this.playerId] : this.game.inputs;
			this.processInputs(inputs);
		}

		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
	}

	draw() {
		this.context.fillStyle = this.color;
		this.context.fillRect(this.x, this.y, this.width, this.height);
	}

	moveAndDraw() {
		this.move();
		this.draw();
	}

	processInputs(inputs) {
		//up
		if (inputs.up) {
			if (this.dy > (this.maxSpeed * -1)) {
				this.dy = this.dy - this.acceleration;
			}
		}

		//down
		if (inputs.down) {
			if (this.dy < this.maxSpeed) {
				this.dy = this.dy + this.acceleration;
			}
		}
	}

	/**
	 * Returns the paddle hitbox
	 * @returns {Object}
	 */
	getHitbox() {
		return {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height
		};
	}

	getState() {
		return {
			player: this.player,
			x: this.x,
			y: this.y,
			dx: this.dx,
			dy: this.dy
		};
	}

	setState(state) {
		this.x = state.x;
		this.y = state.y;
		this.dx = state.dx;
		this.dy = state.dy;
	}
}

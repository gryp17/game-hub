export default class Paddle {
	constructor(game, player = 1, controllable = false, playerId = null) {
		this.game = game;
		this.context = game.contexts.game.context;
		this.canvas = game.contexts.game.canvas;

		this.player = player;
		this.controllable = controllable;
		this.playerId = playerId;

		this.width = 20;
		this.height = 220;
		this.x = 0;
		this.y = 0;
		this.dx = 0;
		this.dy = 0;
		this.maxSpeed = 8;

		//the second player's paddle should be on the right side of the screen
		if (player === 2) {
			this.x = this.canvas.width - this.width;
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
		this.context.fillRect(this.x, this.y, this.width, this.height);
	}

	moveAndDraw() {
		this.move();
		this.draw();
	}

	processInputs(inputs) {
		//up
		if (inputs.UP) {
			if (this.dy > (this.maxSpeed * -1)) {
				this.dy = this.dy - 2;
			}
		}

		//down
		if (inputs.DOWN) {
			if (this.dy < this.maxSpeed) {
				this.dy = this.dy + 2;
			}
		}

		//left
		if (inputs.LEFT) {
			this.dx = this.dx - 2;
		}

		//right
		if (inputs.RIGHT) {
			this.dx = this.dx + 2;
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

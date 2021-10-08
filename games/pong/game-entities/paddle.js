/**
 * Paddle class
 */
export default class Paddle {
	/**
	 * Creates a new paddle instance
	 * @param {Object} game
	 * @param {Number} size
	 * @param {Number} acceleration
	 * @param {Number} maxSpeed
	 * @param {Number} player
	 * @param {Boolean} controllable
	 * @param {Number} playerId
	 */
	constructor(game, size, acceleration, maxSpeed, player = 1, controllable = false, playerId = null) {
		this.game = game;
		this.context = game.contexts.game.context;
		this.canvas = game.contexts.game.canvas;

		this.acceleration = acceleration;
		this.maxSpeed = maxSpeed;
		this.player = player;
		this.controllable = controllable;
		this.playerId = playerId;

		this.width = this.canvas.width / 46;
		this.height = this.canvas.height * (size / 100);
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

	/**
	 * Moves the paddle
	 * If the paddle is controllable it processes the current inputs state first
	 */
	move() {
		if (this.controllable) {
			const inputs = this.playerId ? this.game.inputs[this.playerId] : this.game.inputs;
			this.processInputs(inputs);
		}

		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
	}

	/**
	 * Draws the paddle
	 */
	draw() {
		this.context.fillStyle = this.color;
		this.context.fillRect(this.x, this.y, this.width, this.height);
	}

	/**
	 * Moves and draws the paddle
	 */
	moveAndDraw() {
		this.move();
		this.draw();
	}

	/**
	 * Processes the inputs state and moves the paddle up or down
	 * @param {Object} inputs
	 */
	processInputs(inputs) {
		//stop moving
		if (!inputs.down && !inputs.up) {
			this.dy = 0;
		}

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

	/**
	 * Returns the paddle's state
	 * @returns {Object}
	 */
	getState() {
		return {
			player: this.player,
			x: this.x,
			y: this.y,
			dx: this.dx,
			dy: this.dy
		};
	}

	/**
	 * Sets the paddle's state
	 * @param {Object} state
	 */
	setState(state) {
		this.x = state.x;
		this.y = state.y;
		this.dx = state.dx;
		this.dy = state.dy;
	}
}

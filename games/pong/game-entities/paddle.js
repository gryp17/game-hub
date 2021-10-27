import Entity from '../../common/entity';

/**
 * Paddle class
 */
export default class Paddle extends Entity {
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
		super(game, game.contexts.game);

		this.acceleration = acceleration;
		this.maxSpeed = maxSpeed;
		this.player = player;
		this.controllable = controllable;
		this.playerId = playerId;

		this.width = this.canvas.width / 46;
		this.height = this.canvas.height * (size / 100);

		this.color = '#ffffff';

		//the second player's paddle should be on the right side of the screen
		if (player === 2) {
			this.x = this.canvas.width - this.width;
		}

		//use a different color for the playlable/controllable paddle
		if (this.controllable) {
			this.color = '#b47afd';
		}

		this.moveToCenter();
	}

	/**
	 * Returns the paddle's state
	 * @returns {Object}
	 */
	get state() {
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
	set state(state) {
		super.state = state;
	}

	/**
	 * Moves the paddle to the center of the screen
	 */
	moveToCenter() {
		this.y = (this.canvas.height / 2) - (this.height / 2);
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

		super.move();
		this.handleCollisions();
	}

	/**
	 * Draws the paddle
	 */
	draw() {
		this.context.fillStyle = this.color;
		this.context.fillRect(this.x, this.y, this.width, this.height);
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
	 * Handles all paddle collisions
	 */
	handleCollisions() {
		//top end of screen
		if (this.top < 0) {
			this.top = 0;
			this.dy = 0;
		}

		//bottom end of screen
		if (this.bottom > this.canvas.height) {
			this.bottom = this.canvas.height;
			this.dy = 0;
		}
	}
}

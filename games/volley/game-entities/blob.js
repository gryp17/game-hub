import Entity from './entity';

/**
 * Blob class
 */
export default class Blob extends Entity {
	/**
	 * Creates a new blob instance
	 * @param {Object} game
	 */
	constructor(game) {
		super(game, game.contexts.game);

		this.width = this.canvas.width / 10;
		this.height = this.canvas.height / 4;
		this.x = 100;
		this.y = this.game.background.ground - this.height;
		this.dx = 0;
		this.dy = 0;

		this.maxSpeed = 10;
		this.acceleration = 2;
		this.jumpAcceleration = 12;

		this.color = '#ffffff';
		this.jumping = false;

		this.maxJumpHeight = this.canvas.height - (this.height * 2);
	}

	/**
	 * Moves the blob
	 * If the blob is controllable it processes the current inputs state first
	 */
	move() {
		const inputs = this.game.inputs;
		this.processInputs(inputs);

		//maximum jump height reached
		if (this.jumping && this.y <= this.maxJumpHeight) {
			this.dy = this.dy * -1;
		}

		super.move();
	}

	/**
	 * Draws the blob
	 */
	draw() {
		this.context.fillStyle = this.color;
		this.context.fillRect(this.x, this.y, this.width, this.height);
	}

	/**
	 * Processes the inputs state and moves the blob
	 * @param {Object} inputs
	 */
	processInputs(inputs) {
		//stop moving
		if (!inputs.left && !inputs.right) {
			this.dx = 0;
		}

		//up
		if (inputs.up) {
			if (!this.jumping) {
				this.jumping = true;
				this.dy = this.dy - this.jumpAcceleration;
			}
		}

		//left
		if (inputs.left) {
			if (this.dx > (this.maxSpeed * -1)) {
				this.dx = this.dx - this.acceleration;
			}
		}

		//right
		if (inputs.right) {
			if (this.dx < this.maxSpeed) {
				this.dx = this.dx + this.acceleration;
			}
		}
	}
}

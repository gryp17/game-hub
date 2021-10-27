import Entity from '../../common/entity';
import Utils from '../../common/utils';
import Shadow from './shadow';

/**
 * Ball class
 */
export default class Ball extends Entity {
	/**
	 * Creates a ball instance
	 * @param {Object} game
	 */
	constructor(game) {
		super(game, game.contexts.ball);

		this.width = 100;
		this.height = 100;
		this.x = 0;
		this.y = 0;
		this.dx = 0;
		this.dy = 0;

		//gravity, friction etc.
		this.gravity = 25;
		this.dt = 0.17;
		this.frictionX = 0.9;
		this.frictionY = 0.85;

		this.rotationSpeed = 1.1;
		this.angle = 0;

		if (!game.isServer) {
			this.image = game.images.ballYellow;
		}

		this.moveToCenter();

		this.shadow = new Shadow(game, this);
	}

	/**
	 * Returns the ball state
	 * @returns {Object}
	 */
	get state() {
		return {
			x: this.x,
			y: this.y,
			dx: this.dx,
			dy: this.dy,
			rotationSpeed: this.rotationSpeed,
			angle: this.angle
		};
	}

	/**
	 * Sets the ball state
	 * @param {Object} state
	 */
	set state(state) {
		this.x = state.x;
		this.y = state.y;
		this.dx = state.dx;
		this.dy = state.dy;
		this.rotationSpeed = state.rotationSpeed;
		this.angle = state.angle;
	}

	/**
	 * Puts the ball in the canvas center
	 */
	moveToCenter() {
		// this.x = (this.canvas.width / 2) - (this.width / 2);
		// this.y = (this.canvas.height / 2) - (this.height / 2);

		this.y = 80;
		this.x = 350;
		// this.dx = 5;
	}

	/**
	 * Moves the ball
	 */
	move() {
		//apply gravity
		this.dy = this.dy + (this.gravity * this.dt);

		this.x = this.x + this.dx;

		//magic gravity formula
		this.y = this.y + (this.dy * this.dt) + (0.5 * this.gravity * this.dt * this.dt);

		//stop moving the ball once it gets too slow (this might not be needed in the final game)
		if (Math.abs(this.dx) < 0.5) {
			this.dx = 0;
		}

		this.rotate();

		this.shadow.move();
	}

	/**
	 * Rotates the ball if it's moving
	 */
	rotate() {
		//rotate the ball only if it's moving
		if (this.dx === 0) {
			return;
		}

		const speed = Math.abs(this.dx) * this.rotationSpeed;
		const rotation = this.dx > 0 ? speed : speed * -1;

		this.angle = this.angle + rotation;
	}

	/**
	 * Draws the ball
	 */
	draw() {
		Utils.drawRotatedImage(this.context, this.image, this.angle, this.x, this.y, this.width, this.height);

		this.shadow.draw();
	}
}

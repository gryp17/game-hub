import _ from 'lodash';
import Entity from '../../common/entity';
import Utils from '../../common/utils';

/**
 * Ball class
 */
export default class Ball extends Entity {
	/**
	 * Creates a ball instance
	 * @param {Object} game
	 * @param {Number} size
	 * @param {Number} initialSpeed
	 * @param {Number} acceleration
	 * @param {Number} initialRotationSpeed
	 * @param {Number} rotationAcceleration
	 */
	constructor(game, size, initialSpeed, acceleration, initialRotationSpeed, rotationAcceleration) {
		super(game, game.contexts.ball, size, size);

		this.initialSpeed = initialSpeed;
		this.acceleration = acceleration;
		this.initialRotationSpeed = initialRotationSpeed;
		this.rotationSpeed = initialRotationSpeed;
		this.rotationAcceleration = rotationAcceleration;
		this.angle = 0;

		if (!game.isServer) {
			this.image = game.images.ball;
		}

		this.moveToCenter();

		//give the players some time before shooting the ball
		setTimeout(() => {
			//shoot the ball in a random direction
			this.dx = _.sample([this.initialSpeed, this.initialSpeed * -1]);
			this.dy = _.sample([this.initialSpeed, this.initialSpeed * -1]);
		}, 2000);
	}

	/**
	 * Returns the ball state
	 * @returns {Object}
	 */
	get state() {
		return {
			...super.state,
			rotationSpeed: this.rotationSpeed,
			angle: this.angle
		};
	}

	/**
	 * Sets the ball state
	 * @param {Object} state
	 */
	set state(state) {
		super.state = state;

		this.rotationSpeed = state.rotationSpeed;
		this.angle = state.angle;
	}

	/**
	 * Increases the ball's vertical or horizontal speed
	 * @param {Number} speed
	 * @param {Number} increment
	 * @returns
	 */
	static increaseSpeed(speed, increment) {
		const directionMultiplier = speed > 0 ? 1 : -1;
		return (Math.abs(speed) + increment) * directionMultiplier;
	}

	/**
	 * Calls the onPlayerScore game method if the code is running on the server
	 * @param {Number} player
	 */
	onPlayerScore(player) {
		if (this.game.isServer) {
			this.game.onPlayerScore(player);
			this.game.triggerEvent('score');
		}
	}

	/**
	 * Triggers the ballHit event
	 */
	onBallHit() {
		if (this.game.isServer) {
			this.game.triggerEvent('ballHit');
		}
	}

	/**
	 * Puts the ball in the canvas center
	 */
	moveToCenter() {
		this.x = (this.canvas.width / 2) - (this.width / 2);
		this.y = (this.canvas.height / 2) - (this.height / 2);
	}

	/**
	 * Resets the ball to it's initial (center) position and shoots it after a delay
	 */
	reset() {
		this.moveToCenter();

		//check the current ball direction
		const directionMultiplier = this.dx > 0 ? 1 : -1;

		this.dx = 0;
		this.dy = 0;
		this.rotationSpeed = this.initialRotationSpeed;
		this.angle = 0;

		//start moving the ball again after some delay
		setTimeout(() => {
			//shoot the ball in the opposite horizontal direction and a random vertical direction
			this.dx = this.initialSpeed * directionMultiplier;
			this.dy = _.sample([this.initialSpeed, this.initialSpeed * -1]);
		}, 2000);
	}

	/**
	 * Speeds up the ball after each paddle hit
	 * It uses the paddle vertical speed to change the ball's trajectory
	 * @param {Number} paddleDy
	 */
	speedUp(paddleDy) {
		const paddleForce = Math.abs(paddleDy / 3);
		let verticalAcceleration = 0;

		//when both the paddle and the ball are moving in the same direction apply negative acceleration
		if ((paddleDy < 0 && this.dy < 0) || (paddleDy > 0 && this.dy > 0)) {
			verticalAcceleration = paddleForce * -1;
		} else if ((paddleDy < 0 && this.dy > 0) || (paddleDy > 0 && this.dy < 0)) {
			//otherwise when they are moving in different directions apply positive acceleration
			verticalAcceleration = paddleForce;
		}

		this.dx = Ball.increaseSpeed(this.dx, this.acceleration);
		this.dy = Ball.increaseSpeed(this.dy, verticalAcceleration);

		this.rotationSpeed = this.rotationSpeed + this.rotationAcceleration;
	}

	/**
	 * Moves the ball
	 */
	move() {
		super.move();
		this.rotate();
		this.handleCollisions();
	}

	/**
	 * Rotates the ball if it's moving
	 */
	rotate() {
		//rotate the ball only if it's moving
		if (this.dx === 0) {
			return;
		}

		const speed = this.dx > 0 ? this.rotationSpeed : this.rotationSpeed * -1;
		this.angle = this.angle + speed;
	}

	/**
	 * Draws the ball
	 */
	draw() {
		Utils.drawRotatedImage(this.context, this.image, this.angle, this.x, this.y, this.width, this.height);
	}

	/**
	 * Handles all ball collisions
	 */
	handleCollisions() {
		const paddles = this.game.paddles;

		//top end of screen
		if (this.top < 0) {
			this.top = 0;
			this.dy = this.dy * -1;
		}

		//bottom end of scren
		if (this.bottom > this.canvas.height) {
			this.bottom = this.canvas.height;
			this.dy = this.dy * -1;
		}

		//left end of screen
		if (this.left < 0) {
			this.left = 0;
			this.dx = this.dx * -1;

			this.onPlayerScore(2);
		}

		//right end of screen
		if (this.right > this.canvas.width) {
			this.right = this.canvas.width;
			this.dx = this.dx * -1;

			this.onPlayerScore(1);
		}

		//ball collides with paddle
		paddles.forEach((paddle) => {
			const player = paddle.player;

			if (Utils.collidesWith(paddle.hitbox, this.hitbox)) {
				if (player === 1) {
					this.left = paddle.right;
				} else {
					this.right = paddle.left;
				}

				this.dx = this.dx * -1;

				//speed up the ball and use the paddle acceleration to calculate the ball's vertical acceleration
				this.speedUp(paddle.dy);

				this.onBallHit();
			}
		});
	}
}

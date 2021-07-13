import _ from 'lodash';

export default class Ball {
	constructor(game, size, initialSpeed, acceleration) {
		this.context = game.contexts.game.context;
		this.canvas = game.contexts.game.canvas;

		this.width = size;
		this.height = size;
		this.x = 0;
		this.y = 0;
		this.dx = 0;
		this.dy = 0;
		this.initialSpeed = initialSpeed;
		this.acceleration = acceleration;

		// TODO: load this image in a different way and save it in the "game" object
		if (!game.isServer) {
			this.image = new Image();
			this.image.src = 'https://www.pinclipart.com/picdir/big/544-5446703_transparent-background-red-ball-icon-clipart.png';
		}

		this.center();

		//give the players some time before shooting the ball
		setTimeout(() => {
			//shoot the ball in a random direction
			this.dx = _.sample([this.initialSpeed, this.initialSpeed * -1]);
			this.dy = _.sample([this.initialSpeed, this.initialSpeed * -1]);
		}, 2000);
	}

	static increaseSpeed(speed, increment) {
		const directionMultiplier = speed > 0 ? 1 : -1;
		return (Math.abs(speed) + increment) * directionMultiplier;
	}

	center() {
		this.x = (this.canvas.width / 2) - (this.width / 2);
		this.y = (this.canvas.height / 2) - (this.height / 2);
	}

	reset() {
		this.center();

		//check the current ball direction
		const directionMultiplier = this.dx > 0 ? 1 : -1;

		this.dx = 0;
		this.dy = 0;

		//start moving the ball again after some delay
		setTimeout(() => {
			//shoot the ball in the opposite horizontal direction and a random vertical direction
			this.dx = this.initialSpeed * directionMultiplier;
			this.dy = _.sample([this.initialSpeed, this.initialSpeed * -1]);
		}, 2000);
	}

	speedUp(paddleAcceleration) {
		//if there is any paddle acceleration use it to increase the ball vertical acceleration - otherwise use the default speed increase
		const verticalAcceleration = paddleAcceleration !== 0 ? paddleAcceleration : this.acceleration;

		this.dx = Ball.increaseSpeed(this.dx, this.acceleration);
		this.dy = Ball.increaseSpeed(this.dy, verticalAcceleration);
	}

	move() {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
	}

	draw() {
		this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

	moveAndDraw() {
		this.move();
		this.draw();
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

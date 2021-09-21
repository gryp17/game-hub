import _ from 'lodash';

export default class Ball {
	constructor(game, size, initialSpeed, acceleration, initialRotationSpeed, rotationAcceleration) {
		this.context = game.contexts.ball.context;
		this.canvas = game.contexts.ball.canvas;

		this.width = size;
		this.height = size;
		this.x = 0;
		this.y = 0;
		this.dx = 0;
		this.dy = 0;
		this.initialSpeed = initialSpeed;
		this.acceleration = acceleration;
		this.initialRotationSpeed = initialRotationSpeed;
		this.rotationSpeed = initialRotationSpeed;
		this.rotationAcceleration = rotationAcceleration;
		this.angle = 0;

		if (!game.isServer) {
			this.image = game.images.ball;
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
		this.rotationSpeed = this.initialRotationSpeed;
		this.angle = 0;

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

		this.rotationSpeed = this.rotationSpeed + this.rotationAcceleration;
	}

	move() {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		this.rotate();
	}

	rotate() {
		//rotate the ball only if it's moving
		if (this.dx === 0) {
			return;
		}

		const speed = this.dx > 0 ? this.rotationSpeed : this.rotationSpeed * -1;
		this.angle = this.angle + speed;
	}

	draw() {
		this.context.save();

		//move to the middle of where we want to draw our image
		this.context.translate(this.x + this.width / 2, this.y + this.height / 2);

		//rotate around that point, converting our angle from degrees to radians
		this.context.rotate((this.angle * Math.PI) / 180);

		//draw it up and to the left by half the width and height of the image
		this.context.drawImage(this.image, -(this.width / 2), -(this.height / 2), this.width, this.height);

		//and restore the co-ords to how they were when we began
		this.context.restore();
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
			dy: this.dy,
			rotationSpeed: this.rotationSpeed,
			angle: this.angle
		};
	}

	setState(state) {
		this.x = state.x;
		this.y = state.y;
		this.dx = state.dx;
		this.dy = state.dy;
		this.rotationSpeed = state.rotationSpeed;
		this.angle = state.angle;
	}
}

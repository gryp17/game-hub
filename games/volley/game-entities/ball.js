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

		this.handleCollisions();

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

	/**
	 * Handles all ball collisions
	 */
	handleCollisions() {
		const background = this.game.background;
		const dummies = this.game.dummies;
		const net = this.game.net;

		//bottom end of scren
		if (this.bottom >= background.ground) {
			this.bottom = background.ground;
			this.dy = this.dy * -1;

			//apply friction
			this.dx = this.dx * this.frictionX;
			this.dy = this.dy * this.frictionY;
		}

		//left end of screen
		if (this.left < 0) {
			this.left = 0;

			//apply friction
			this.dx = this.dx * this.frictionX;

			this.dx = this.dx * -1;
		}

		//right end of screen
		if (this.right > this.canvas.width) {
			this.right = this.canvas.width;

			//apply friction
			this.dx = this.dx * this.frictionX;

			this.dx = this.dx * -1;
		}

		//collisions with dummies
		dummies.forEach((dummy) => {
			const collisionWithDummy = Utils.getCollisionPoint(dummy, this);
			if (collisionWithDummy) {
				const addedForce = dummy.minForce;
				const verticalForceWhenJumping = dummy.verticalForce * -1;
				const horizontalForceWhenJumping = dummy.horizontalForce;

				//straight top collision
				if (collisionWithDummy === 'top') {
					this.top = dummy.top - this.height - dummy.dy;

					if (dummy.jumping) {
						this.dy = verticalForceWhenJumping;
					} else {
						this.dy = (Math.abs(this.dy) * this.frictionY) * -1;
					}
				}

				//left collision
				if (collisionWithDummy === 'left') {
					this.right = dummy.left;
					this.dx = (Math.abs(this.dx) + Math.abs(dummy.dx) + addedForce) * -1;
				}

				//right collision
				if (collisionWithDummy === 'right') {
					this.left = dummy.right;
					this.dx = Math.abs(this.dx) + Math.abs(dummy.dx) + addedForce;
				}

				//left corner collision
				if (collisionWithDummy === 'topLeft') {
					this.top = dummy.top - this.height - dummy.dy;

					if (dummy.jumping) {
						this.dy = verticalForceWhenJumping;
						this.dx = horizontalForceWhenJumping * -1;
					} else {
						this.dy = (Math.abs(this.dy)) * -1;
						this.dx = (Math.abs(this.dx) + addedForce) * -1;
					}
				}

				//right corner collision
				if (collisionWithDummy === 'topRight') {
					this.top = dummy.top - this.height - dummy.dy;

					if (dummy.jumping) {
						this.dy = verticalForceWhenJumping;
						this.dx = horizontalForceWhenJumping;
					} else {
						this.dy = (Math.abs(this.dy)) * -1;
						this.dx = (Math.abs(this.dx) + addedForce);
					}
				}
			}
		});

		//collisions with net
		const collisionWithNet = Utils.getCollisionPoint(net, this);
		if (collisionWithNet) {
			//straight top collision
			if (collisionWithNet === 'top') {
				this.bottom = net.top;
				this.dy = (this.dy * this.frictionY) * -1;
			}

			//left collision
			if (collisionWithNet === 'left') {
				this.right = net.left;
				this.dx = this.dx * -1;
			}

			//right collision
			if (collisionWithNet === 'right') {
				this.left = net.right;
				this.dx = this.dx * -1;
			}

			//left corner collision
			if (collisionWithNet === 'topLeft') {
				this.bottom = net.top;

				if (this.dx > 0) {
					this.dx = this.dx * -1;
				}

				this.dy = Math.abs(this.dy) * -1;
			}

			//right corner collision
			if (collisionWithNet === 'topRight') {
				this.bottom = net.top;

				if (this.dx < 0) {
					this.dx = this.dx * -1;
				}

				this.dy = Math.abs(this.dy) * -1;
			}
		}
	}
}

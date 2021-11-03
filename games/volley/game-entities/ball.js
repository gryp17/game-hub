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

		this.serving = false;
		this.serveTimeout = 6000;
		this.serveTimeoutId;

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

		this.reset(1);

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
			angle: this.angle,
			serving: this.serving
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
		this.serving = state.serving;
	}

	/**
	 * Resets the ball to it's initial position depending on the player that serves
	 * @param {Number} player
	 */
	reset(player) {
		if (player === 1) {
			this.x = (this.canvas.width / 4) - (this.width / 2);
		} else {
			this.x = this.canvas.width - (this.canvas.width / 4) - (this.width / 2);
		}

		this.y = this.canvas.height / 2;

		this.serving = true;

		//start the serve timeout that gives the player X seconds to interact with the ball before it falls
		this.startServeTimeout();
	}

	/**
	 * Clears the serve timeout
	 */
	clearServeTimeout() {
		if (this.serveTimeoutId) {
			clearTimeout(this.serveTimeoutId);
		}
	}

	/**
	 * Starts the serve timeout that waits X seconds before letting the ball fall
	 */
	startServeTimeout() {
		this.clearServeTimeout();

		this.serveTimeoutId = setTimeout(() => {
			this.serving = false;
		}, this.serveTimeout);
	}

	/**
	 * Moves the ball
	 */
	move() {
		//make the ball stand still in the air while the serving flag is raised
		if (this.serving) {
			this.dx = 0;
			this.dy = 0;
		} else {
			//apply gravity
			this.dy = this.dy + (this.gravity * this.dt);

			this.x = this.x + this.dx;

			//magic gravity formula
			this.y = this.y + (this.dy * this.dt) + (0.5 * this.gravity * this.dt * this.dt);

			this.rotate();
		}

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
	 * Plays the hit sound effect
	 */
	playHitSound() {
		if (!this.game.isServer) {
			this.game.playTrack('volleyHit');
		}
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

			//player scores
			if (this.game.isServer) {
				if (this.center.x < this.canvas.width / 2) {
					this.game.onPlayerScore(2);
				} else {
					this.game.onPlayerScore(1);
				}
			}
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

				//clear the serve timeout and reset the serving value so the ball can be launched again
				this.clearServeTimeout();
				this.serving = false;

				//straight top collision
				if (collisionWithDummy === 'top') {
					this.bottom = dummy.top;

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

				this.playHitSound();
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

			this.playHitSound();
		}
	}
}

import Utils from '../../common/utils';

/**
 * Class used for handling all game object collisions
 */
export default class CollisionsManager {
	/**
	 * Creates a CollisionManager instance
	 * @param {Object} game
	 */
	constructor(game) {
		this.game = game;
	}

	/**
	 * Handles the collisions for all game objects
	 */
	handleCollisions() {
		this.handleBall();
		this.handleDummies();
		this.handleNet();
	}

	/**
	 * Handles all ball collisions
	 */
	handleBall() {
		const ball = this.game.ball;
		const background = this.game.background;

		//bottom end of scren
		if (ball.bottom >= background.ground) {
			ball.bottom = background.ground;
			ball.dy = ball.dy * -1;

			//apply friction
			ball.dx = ball.dx * ball.frictionX;
			ball.dy = ball.dy * ball.frictionY;
		}

		//left end of screen
		if (ball.left < 0) {
			ball.left = 0;

			//apply friction
			ball.dx = ball.dx * ball.frictionX;

			ball.dx = ball.dx * -1;
		}

		//right end of screen
		if (ball.right > ball.canvas.width) {
			ball.right = ball.canvas.width;

			//apply friction
			ball.dx = ball.dx * ball.frictionX;

			ball.dx = ball.dx * -1;
		}
	}

	/**
	 * Handles all dummies collisions
	 */
	handleDummies() {
		const ball = this.game.ball;
		const background = this.game.background;

		this.game.dummies.forEach((dummy) => {
			//bottom end of scren
			if (dummy.bottom >= background.ground) {
				dummy.bottom = background.ground;
				dummy.stopJumping();
			}

			//left end of screen
			if (dummy.left < 0) {
				dummy.left = 0;
			}

			//right end of screen
			if (dummy.right >= dummy.canvas.width) {
				dummy.right = dummy.canvas.width;
			}

			//collisions with ball
			const collisionWithBall = Utils.getCollisionPoint(dummy, ball);
			if (collisionWithBall) {
				const addedForce = dummy.strength;

				//straight top collision
				if (collisionWithBall === 'top') {
					ball.top = dummy.top - ball.height - dummy.dy;

					if (dummy.jumping) {
						ball.dy = (Math.abs(ball.dy) + Math.abs(dummy.dy) + addedForce) * -1;
					} else {
						ball.dy = (Math.abs(ball.dy) * ball.frictionY) * -1;
					}
				}

				//left collision
				if (collisionWithBall === 'left') {
					ball.right = dummy.left;
					ball.dx = (Math.abs(ball.dx) + Math.abs(dummy.dx) + addedForce) * -1;
				}

				//right collision
				if (collisionWithBall === 'right') {
					ball.left = dummy.right;
					ball.dx = Math.abs(ball.dx) + Math.abs(dummy.dx) + addedForce;
				}

				//left corner collision
				if (collisionWithBall === 'topLeft') {
					ball.top = dummy.top - ball.height - dummy.dy;

					ball.dx = (Math.abs(ball.dx) + addedForce) * -1;

					if (dummy.jumping) {
						ball.dy = (Math.abs(ball.dy) + Math.abs(dummy.dy) + addedForce) * -1;
					} else {
						ball.dy = (Math.abs(ball.dy)) * -1;
					}
				}

				//right corner collision
				if (collisionWithBall === 'topRight') {
					ball.top = dummy.top - ball.height - dummy.dy;

					ball.dx = (Math.abs(ball.dx) + addedForce);

					if (dummy.jumping) {
						ball.dy = (Math.abs(ball.dy) + Math.abs(dummy.dy) + addedForce) * -1;
					} else {
						ball.dy = (Math.abs(ball.dy)) * -1;
					}
				}
			}
		});
	}

	/**
	 * Handles all net collisions
	 */
	handleNet() {
		const ball = this.game.ball;
		const net = this.game.net;

		//collisions with ball
		const collisionWithBall = Utils.getCollisionPoint(net, ball);
		if (collisionWithBall) {
			//straight top collision
			if (collisionWithBall === 'top') {
				ball.bottom = net.top;
				ball.dy = (ball.dy * ball.frictionY) * -1;
			}

			//left collision
			if (collisionWithBall === 'left') {
				ball.right = net.left;
				ball.dx = ball.dx * -1;
			}

			//right collision
			if (collisionWithBall === 'right') {
				ball.left = net.right;
				ball.dx = ball.dx * -1;
			}

			//left corner collision
			if (collisionWithBall === 'topLeft') {
				ball.bottom = net.top;

				if (ball.dx > 0) {
					ball.dx = ball.dx * -1;
				}

				ball.dy = Math.abs(ball.dy) * -1;
			}

			//right corner collision
			if (collisionWithBall === 'topRight') {
				ball.bottom = net.top;

				if (ball.dx < 0) {
					ball.dx = ball.dx * -1;
				}

				ball.dy = Math.abs(ball.dy) * -1;
			}
		}

		//collisions with dummies
		this.game.dummies.forEach((dummy) => {
			const collisionWithDummy = Utils.getCollisionPoint(net, dummy);

			if (collisionWithDummy) {
				if (collisionWithDummy === 'left') {
					dummy.right = net.left;
				}

				if (collisionWithDummy === 'right') {
					dummy.left = net.right;
				}
			}
		});
	}
}

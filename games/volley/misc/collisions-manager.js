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
		this.handleBlobs();
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
	 * Handles all blobs collisions
	 */
	handleBlobs() {
		const ball = this.game.ball;
		const background = this.game.background;

		this.game.blobs.forEach((blob) => {
			//bottom end of scren
			if (blob.bottom >= background.ground) {
				blob.bottom = background.ground;
				blob.jumping = false;
			}

			//left end of screen
			if (blob.left < 0) {
				blob.left = 0;
			}

			//right end of screen
			if (blob.right >= blob.canvas.width) {
				blob.right = blob.canvas.width;
			}

			//collisions with ball
			if (Utils.collidesWith(blob.hitbox, ball.hitbox)) {
				// TODO: don't hardcode this
				const addedForce = 3;

				//straight top collision
				if (ball.center.y < blob.top && (ball.center.x >= blob.left && ball.center.x <= blob.right)) {
					ball.top = blob.top - ball.height - blob.dy;

					if (blob.jumping) {
						ball.dy = (Math.abs(ball.dy) + Math.abs(blob.dy) + addedForce) * -1;
					} else {
						ball.dy = (Math.abs(ball.dy) * ball.frictionY) * -1;
					}

					return;
				}

				//left collision
				if (ball.center.x < blob.left && ball.center.y > blob.top) {
					ball.right = blob.left;
					ball.dx = (Math.abs(ball.dx) + Math.abs(blob.dx) + addedForce) * -1;

					return;
				}

				//right collision
				if (ball.center.x > blob.right && ball.center.y > blob.top) {
					ball.left = blob.right;
					ball.dx = Math.abs(ball.dx) + Math.abs(blob.dx) + addedForce;

					return;
				}

				//left corner collision
				if (ball.center.y < blob.top && ball.center.x < blob.left) {
					ball.top = blob.top - ball.height - blob.dy;

					ball.dx = (Math.abs(ball.dx) + addedForce) * -1;

					if (blob.jumping) {
						ball.dy = (Math.abs(ball.dy) + Math.abs(blob.dy) + addedForce) * -1;
					} else {
						ball.dy = (Math.abs(ball.dy)) * -1;
					}

					return;
				}

				//right corner collision
				if (ball.center.y < blob.top && ball.center.x > blob.left) {
					ball.top = blob.top - ball.height - blob.dy;

					ball.dx = (Math.abs(ball.dx) + addedForce);

					if (blob.jumping) {
						ball.dy = (Math.abs(ball.dy) + Math.abs(blob.dy) + addedForce) * -1;
					} else {
						ball.dy = (Math.abs(ball.dy)) * -1;
					}
				}
			}
		});
	}
}

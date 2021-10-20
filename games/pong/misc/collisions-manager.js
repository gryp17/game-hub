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
		this.handlePaddles();
		this.handleBall();
	}

	/**
	 * Handles all paddles collisions
	 */
	handlePaddles() {
		const paddles = this.game.paddles;
		const ball = this.game.ball;

		paddles.forEach((paddle) => {
			const player = paddle.player;

			//top end of screen
			if (paddle.top < 0) {
				paddle.top = 0;
				paddle.dy = 0;
			}

			//bottom end of screen
			if (paddle.bottom > paddle.canvas.height) {
				paddle.bottom = paddle.canvas.height;
				paddle.dy = 0;
			}

			//paddle collides with ball
			if (Utils.collidesWith(paddle.hitbox, ball.hitbox)) {
				if (player === 1) {
					ball.left = paddle.right;
				} else {
					ball.right = paddle.left;
				}

				ball.dx = ball.dx * -1;

				//speed up the ball and use the paddle acceleration to calculate the ball's vertical acceleration
				ball.speedUp(paddle.dy);
			}
		});
	}

	/**
	 * Handles all ball collisions
	 */
	handleBall() {
		const ball = this.game.ball;

		//top end of screen
		if (ball.top < 0) {
			ball.top = 0;
			ball.dy = ball.dy * -1;
		}

		//bottom end of scren
		if (ball.bottom > ball.canvas.height) {
			ball.bottom = ball.canvas.height;
			ball.dy = ball.dy * -1;
		}

		//left end of screen
		if (ball.left < 0) {
			ball.left = 0;
			ball.dx = ball.dx * -1;

			if (this.game.isServer) {
				this.game.onPlayerScore(2);
			}
		}

		//right end of screen
		if (ball.right > ball.canvas.width) {
			ball.right = ball.canvas.width;
			ball.dx = ball.dx * -1;

			if (this.game.isServer) {
				this.game.onPlayerScore(1);
			}
		}
	}
}

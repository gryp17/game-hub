import Utils from './utils';

/**
 * Class used for handling all game object collisions
 * @param {Game} game
 * @returns {CollisionsManager}
 */
export default class CollisionsManager {
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
		const ballHitbox = ball.getHitbox();

		paddles.forEach((paddle) => {
			const paddleHitbox = paddle.getHitbox();
			const player = paddle.player;

			//top end of screen
			if (paddle.y < 0) {
				paddle.y = 0;
				paddle.dy = 0;
			}

			//bottom end of screen
			if (paddle.y + paddle.height > paddle.canvas.height) {
				paddle.y = paddle.canvas.height - paddle.height;
				paddle.dy = 0;
			}

			//paddle collides with ball
			if (Utils.collidesWith(paddleHitbox, ballHitbox)) {
				if (player === 1) {
					ball.x = paddle.x + paddle.width;
				} else {
					ball.x = paddle.x - ball.width;
				}

				ball.dx = ball.dx * -1;
			}
		});
	}

	handleBall() {
		const ball = this.game.ball;

		//top end of screen
		if (ball.y < 0) {
			ball.y = 0;
			ball.dy = ball.dy * -1;
		}

		//bottom end of scren
		if (ball.y + ball.height > ball.canvas.height) {
			ball.y = ball.canvas.height - ball.height;
			ball.dy = ball.dy * -1;
		}

		//left end of screen
		if (ball.x < 0) {
			ball.x = 0;
			ball.dx = ball.dx * -1;

			if (this.game.isServer) {
				this.game.onPlayerScore(2);
			}
		}

		//right end of screen
		if (ball.x + ball.width > ball.canvas.width) {
			ball.x = ball.canvas.width - ball.width;
			ball.dx = ball.dx * -1;

			if (this.game.isServer) {
				this.game.onPlayerScore(1);
			}
		}
	}
}

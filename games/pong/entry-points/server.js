import GameServer from '../../common/game-server';
import Paddle from '../game-entities/paddle';
import Ball from '../game-entities/ball';

/**
 * Pong server class
 */
export default class Pong extends GameServer {
	/**
	 * Creates a new pong servver instance
	 * @param {Number} id
	 * @param {Object} config
	 * @param {Object} customSettings
	 * @param {Array} players
	 * @param {Object} events
	 */
	constructor(id, config, customSettings, players, { onUpdate, onGameOver }) {
		//mocked contexts/canvas objects (not really used on the server apart from the canvas size)
		const canvasIds = {
			game: 'game-canvas',
			ball: 'ball-canvas'
		};

		super(id, config, customSettings, players, { onUpdate, onGameOver }, canvasIds);

		this.paddles = [];
		this.ball;
	}

	/**
	 * Merges the defaultConfig and the customSettings
	 * @param {Object} defaultConfig
	 * @param {Object} customSettings
	 * @returns {Object}
	 */
	applySettings(defaultConfig, customSettings) {
		const settingsPathMap = {
			gameLength: 'maxScore',
			paddleSize: 'paddle.size',
			ballSize: 'ball.size',
			ballSpeed: 'ball.initialSpeed'
		};

		return super.applySettings(defaultConfig, customSettings, settingsPathMap);
	}

	/**
	 * Called when one of the players scores
	 * @param {Number} player
	 */
	onPlayerScore(player) {
		super.onPlayerScore(player);

		if (this.scores[player].score < this.config.maxScore) {
			//reset the ball position and after some timeout shoot it again in some random direction
			this.ball.reset();
		}
	}

	/**
	 * Sends an update to the clients with the current game state
	 */
	onGameStateUpdate() {
		const paddlesState = this.paddles.map((paddle) => {
			return paddle.state;
		});

		super.onGameStateUpdate({
			paddles: paddlesState,
			ball: this.ball.state,
			scores: this.scores,
			gameOver: this.gameOver
		});
	}

	/**
	 * Initializes the game entities and starts the game
	 */
	start() {
		this.paddles = this.players.map((player, index) => {
			const playerIndex = index + 1;
			return new Paddle(this, this.config.paddle.size, this.config.paddle.acceleration, this.config.paddle.maxSpeed, playerIndex, true, player.socketId);
		});

		this.ball = new Ball(
			this,
			this.config.ball.size,
			this.config.ball.initialSpeed,
			this.config.ball.acceleration,
			this.config.ball.initialRotationSpeed,
			this.config.ball.rotationAcceleration
		);

		const gameLoop = () => {
			this.paddles.forEach((paddle) => {
				paddle.move();
			});
			this.ball.move();
		};

		super.start(gameLoop);
	}
}

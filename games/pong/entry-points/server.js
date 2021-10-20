import _ from 'lodash';
import Paddle from '../game-entities/paddle';
import Ball from '../game-entities/ball';
import CollisionsManager from '../misc/collisions-manager';

/**
 * Pong server class
 */
export default class Pong {
	/**
	 * Creates a new pong servver instance
	 * @param {Number} id
	 * @param {Object} config
	 * @param {Object} customSettings
	 * @param {Array} players
	 * @param {Object} events
	 */
	constructor(id, config, customSettings, players, { onUpdate, onGameOver }) {
		this.isServer = typeof window === 'undefined';
		this.id = id;
		this.config = this.applySettings(config, customSettings);
		this.players = players;
		this.onUpdate = onUpdate;
		this.onGameOver = onGameOver;
		this.gameLoopInterval;
		this.paddles = [];
		this.scores = {};
		this.gameOver = false;

		this.inputs = {};

		players.forEach((player, index) => {
			this.inputs[player.socketId] = {
				UP: false,
				DOWN: false
			};

			//generate the player 1 and player 2 scores
			this.scores[index + 1] = {
				id: player.id,
				username: player.username,
				score: 0
			};
		});

		this.ball;

		//mocked contexts/canvas objects (not really needed on the server)
		this.contexts = {
			game: {
				context: {},
				canvas: {
					width: this.config.width,
					height: this.config.height
				}
			},
			ball: {
				context: {},
				canvas: {
					width: this.config.width,
					height: this.config.height
				}
			}
		};

		//initialize the collisions manager
		this.collisionsManager = new CollisionsManager(this);
	}

	/**
	 * Merges the defaultConfig and the customSettings
	 * @param {Object} defaultConfig
	 * @param {Object} customSettings
	 * @returns {Object}
	 */
	applySettings(defaultConfig, customSettings) {
		const config = {
			...defaultConfig
		};

		//map each setting type to the path in the config that it corresponds to
		const settingsPathMap = {
			gameLength: 'maxScore',
			paddleSize: 'paddle.size',
			ballSize: 'ball.size',
			ballSpeed: 'ball.initialSpeed'
		};

		if (!customSettings) {
			return config;
		}

		_.forOwn(defaultConfig.configurableSettings, (predefinedValues, settingType) => {
			if (customSettings[settingType]) {
				const path = settingsPathMap[settingType];
				const value = predefinedValues[customSettings[settingType]];
				_.set(config, path, value);
			}
		});

		return config;
	}

	/**
	 * Updates the inputs belonging to the provided socketId/player
	 * @param {Object} data
	 */
	updateInputs({ socketId, inputs }) {
		this.inputs[socketId] = inputs;
	}

	/**
	 * Ends the game
	 * @param {Object} winner
	 * @param {Boolean} ragequit
	 */
	gameIsOver(winner, ragequit = false) {
		const scores = {};

		//format the scores object
		Object.keys(this.scores).forEach((key) => {
			const user = this.scores[key];
			scores[user.id] = user.score;
		});

		//stop the game loop, mark the game as game over and update the game state one last time
		this.stop();
		this.gameOver = true;
		this.onGameStateUpdate();
		this.onGameOver(winner, scores, ragequit);
	}

	/**
	 * Called when one of the players scores
	 * @param {Number} player
	 */
	onPlayerScore(player) {
		this.scores[player].score = this.scores[player].score + 1;

		if (this.scores[player].score === this.config.maxScore) {
			this.gameIsOver(this.players[player - 1]);
		} else {
			//otherwise reset the ball position and after some timeout shoot it again in some random direction
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

		this.onUpdate({
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

		this.gameLoopInterval = setInterval(() => {
			this.paddles.forEach((paddle) => {
				paddle.move();
			});
			this.ball.move();

			//handle all game collisions
			this.collisionsManager.handleCollisions();

			this.onGameStateUpdate();
		}, 1000 / this.config.fps);
	}

	/**
	 * Stops the game
	 */
	stop() {
		clearInterval(this.gameLoopInterval);
	}
}

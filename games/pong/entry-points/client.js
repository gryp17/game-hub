import _ from 'lodash';
import GameClient from '../../common/game-client';
import Keyboard from '../../common/inputs/keyboard';
import Touchscreen from '../inputs/touchscreen';
import Paddle from '../game-entities/paddle';
import Ball from '../game-entities/ball';
import gameImages from '../resources/images';

/**
 * Pong client class
 */
export default class Pong extends GameClient {
	/**
	 * Creates a new pong client instance
	 * @param {Object} canvasIds
	 * @param {String} canvasWrapper
	 * @param {Object} images
	 * @param {Object} config
	 * @param {Number} player
	 * @param {Object} events
	 */
	constructor(canvasIds, canvasWrapper, images, config, player, { onUpdateInputs, playMusic, playTrack }) {
		super(canvasIds, canvasWrapper, images, config, player, { onUpdateInputs, playMusic, playTrack });

		this.paddles = [];
		this.ball;

		//initialize the keyboard and touchscreen controls
		this.keyboard = new Keyboard(this.gameControls, this.contexts.game.canvas);
		this.touchscreen = new Touchscreen(this.gameControls, this.contexts.game.canvas);
	}

	/**
	 * Preloads all the game images and calls the provided callback when done
	 * @param {Function} callback
	 */
	static preloadGameImages(callback) {
		super.preloadGameImages(gameImages, callback);
	}

	/**
	 * Initializes the game entities and starts the game
	 */
	start() {
		//game objects
		this.paddles = [...Array(this.config.maxPlayers).keys()].map((value, index) => {
			const playerIndex = index + 1;
			const controllable = this.player === playerIndex;
			return new Paddle(this, this.config.paddle.size, this.config.paddle.acceleration, this.config.paddle.maxSpeed, playerIndex, controllable);
		});

		this.ball = new Ball(
			this,
			this.config.ball.size,
			this.config.ball.initialSpeed,
			this.config.ball.acceleration,
			this.config.ball.initialRotationSpeed,
			this.config.ball.rotationAcceleration
		);

		//listen for the keyboard and touchscreen events
		this.keyboard.listen();
		this.touchscreen.listen();

		super.start();
	}

	/**
	 * Stops the game
	 */
	stop() {
		//clear all input event listeners
		this.keyboard.removeAllEventListeners();
		this.touchscreen.removeAllEventListeners();

		super.stop();
	}

	/**
	 * Updates the game state with the data received from the server
	 * @param {Object} data
	 */
	updateData({ events, paddles, ball, scores, gameOver }) {
		paddles.forEach((paddle, index) => {
			this.paddles[index].state = paddle;
		});

		this.ball.state = ball;

		super.updateData({ events, scores, gameOver });
	}

	/**
	 * Handles the server events
	 * @param {Object} events
	 */
	handleServerEvents(events) {
		if (events.ballHit) {
			this.playHitSound();
		}

		if (events.score) {
			this.playScoreSound();
		}
	}

	/**
	 * Plays the score sound effect
	 */
	playScoreSound() {
		this.playTrack('whistle', 0.2);
	}

	/**
	 * Plays the hit sound effect
	 */
	playHitSound() {
		this.playTrack('pongHit');
	}

	/**
	 * Returns the current inputs state
	 * @returns {Object}
	 */
	getInputs() {
		const result = {};

		const controllablePaddle = this.paddles.find((paddle) => {
			return paddle.controllable;
		});

		//get both types of inputs
		const keyboardInputs = this.keyboard.getInputs();
		const touchscreenInputs = this.touchscreen.getInputs(controllablePaddle);

		//and merge them
		_.forOwn(this.gameControls, (data, key) => {
			result[key] = keyboardInputs[key] || touchscreenInputs[key];
		});

		return result;
	}

	/**
	 * The game logic that runs every game tick
	 */
	gameLoop() {
		super.gameLoop();

		this.paddles.forEach((paddle) => {
			paddle.move();
		});
		this.ball.move();
	}

	/**
	 * Draws the game entities
	 */
	drawGame() {
		const drawEntities = () => {
			this.paddles.forEach((paddle) => {
				paddle.draw();
			});

			this.ball.draw();
		};

		super.drawGame(drawEntities);
	}
}

import _ from 'lodash';
import GameClient from '../../common/game-client';
import Utils from '../../common/utils';
import Keyboard from '../../common/inputs/keyboard';
import Touchscreen from '../inputs/touchscreen';
import Paddle from '../game-entities/paddle';
import Ball from '../game-entities/ball';
import gameImages from '../resources/images';

window.requestAnimFrame = Utils.getRequestAnimationFrame();

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

		clearInterval(this.gameLoopInterval);
	}

	/**
	 * Updates the game state with the data received from the server
	 * @param {Object} data
	 */
	updateData({ paddles, ball, scores, gameOver }) {
		paddles.forEach((paddle, index) => {
			this.paddles[index].state = paddle;
		});

		this.ball.state = ball;

		this.scores = scores;

		if (gameOver) {
			this.stop();
		}
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
		//get the current inputs status
		const oldInputs = {
			...this.inputs
		};

		this.inputs = this.getInputs();

		//emit the updateInputs only if the inputs have changed
		if (!_.isEqual(oldInputs, this.inputs)) {
			this.onUpdateInputs(this.inputs);
		}

		//when any key has been pressed try to play the music tracks
		//this is a firefox autoplay hack
		this.tryToPlayMusic();

		this.paddles.forEach((paddle) => {
			paddle.move();
		});
		this.ball.move();
	}

	/**
	 * Draws the game entities
	 */
	drawGame() {
		//clear the whole canvas before drawing anything (this used to be in the paddle class)
		_.forOwn(this.contexts, (value, key) => {
			this.contexts[key].context.clearRect(0, 0, this.contexts[key].canvas.width, this.contexts[key].canvas.height);
		});

		this.paddles.forEach((paddle) => {
			paddle.draw();
		});
		this.ball.draw();

		window.requestAnimFrame(() => {
			this.drawGame();
		});
	}
}

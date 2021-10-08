import _ from 'lodash';
import Context from '../misc/context';
import Keyboard from '../inputs/keyboard';
import Touchscreen from '../inputs/touchscreen';
import Paddle from '../game-entities/paddle';
import Ball from '../game-entities/ball';
import CollisionsManager from '../misc/collisions-manager';
import ImageRepository from '../misc/image-repository';
import gameImages from '../resources/images';

/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function anim() {
	return window.requestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function anim(callback, element) {
				window.setTimeout(callback, 1000);
			};
}());

/**
 * Pong client class
 */
export default class Pong {
	/**
	 * Creates a new pong client instance
	 * @param {String} gameCanvasId
	 * @param {String} ballCanvasId
	 * @param {Object} images
	 * @param {Object} config
	 * @param {Number} player
	 * @param {Object} events
	 */
	constructor(gameCanvasId, ballCanvasId, images, config, player, { onUpdateInputs }) {
		this.isServer = typeof window === 'undefined';
		this.config = config;
		this.player = player;
		this.gameLoopInterval;
		this.inputs;
		this.images = images;
		this.paddles = [];
		this.scores = {};
		this.ball;

		//events
		this.onUpdateInputs = onUpdateInputs;

		this.gameControls = config.controls;

		//canvas/context objects
		this.contexts = {
			game: new Context(gameCanvasId),
			ball: new Context(ballCanvasId)
		};

		_.forOwn(this.contexts, (value, key) => {
			this.contexts[key].setSize(this.config.width, this.config.height);
		});

		//initialize the keyboard and touchscreen controls
		this.keyboard = new Keyboard(this.gameControls, this.contexts.game.canvas);
		this.touchscreen = new Touchscreen(this.gameControls, this.contexts.game.canvas);

		this.collisionsManager = new CollisionsManager(this);
	}

	/**
	 * Preloads all the game images and calls the provided callback when done
	 * @param {Function} callback
	 */
	static preloadGameImages(callback) {
		new ImageRepository(gameImages, callback);
	}

	/**
	 * Initializes the game entities and starts the game
	 */
	start() {
		this.contexts.game.show();
		this.contexts.ball.show();
		this.contexts.game.focus();

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

		this.gameLoopInterval = setInterval(() => {
			this.gameLoop();
		}, 1000 / this.config.fps);

		requestAnimationFrame(() => {
			this.drawGame();
		});
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
			this.paddles[index].setState(paddle);
		});

		this.ball.setState(ball);

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

		this.paddles.forEach((paddle) => {
			paddle.move();
		});
		this.ball.move();

		//handle all game collisions
		this.collisionsManager.handleCollisions();
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

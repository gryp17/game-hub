import _ from 'lodash';
import Context from '../../common/context';
import Keyboard from '../inputs/keyboard';
import Touchscreen from '../inputs/touchscreen';
import Ball from '../game-entities/ball';
import Blob from '../game-entities/blob';
import CollisionsManager from '../misc/collisions-manager';
import ImageRepository from '../../common/image-repository';
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
 * Volley client class
 */
export default class Volley {
	/**
	 * Creates a new volley client instance
	 * @param {String} gameCanvasId
	 * @param {String} ballCanvasId
	 * @param {Object} images
	 * @param {Object} config
	 * @param {Object} events
	 */
	constructor(gameCanvasId, ballCanvasId, images, config, { onUpdateInputs }) {
		this.isServer = typeof window === 'undefined';
		this.config = config;
		this.gameLoopInterval;
		this.inputs;
		this.images = images;
		this.scores = {};
		this.ball;
		this.blobs = [];

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

		this.ball = new Ball(
			this
		);

		this.blobs = [
			new Blob(this)
		];

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
	 * Returns the current inputs state
	 * @returns {Object}
	 */
	getInputs() {
		const result = {};

		//get both types of inputs
		const keyboardInputs = this.keyboard.getInputs();

		//and merge them
		_.forOwn(this.gameControls, (data, key) => {
			result[key] = keyboardInputs[key];
		});

		return result;
	}

	/**
	 * The game logic that runs every game tick
	 */
	gameLoop() {
		this.inputs = this.getInputs();

		this.blobs.forEach((blob) => {
			blob.move();
		});

		this.ball.move();

		//handle all game collisions
		this.collisionsManager.handleCollisions();
	}

	/**
	 * Draws the game entities
	 */
	drawGame() {
		//clear the whole canvas before drawing anything (this used to be in the blob class)
		_.forOwn(this.contexts, (value, key) => {
			this.contexts[key].context.clearRect(0, 0, this.contexts[key].canvas.width, this.contexts[key].canvas.height);
		});

		this.blobs.forEach((blob) => {
			blob.draw();
		});

		this.ball.draw();

		window.requestAnimFrame(() => {
			this.drawGame();
		});
	}
}

import _ from 'lodash';
import Utils from '../../common/utils';
import Context from '../../common/context';
import Keyboard from '../inputs/keyboard';
import Touchscreen from '../inputs/touchscreen';
import Background from '../game-entities/background';
import Ball from '../game-entities/ball';
import Dummy from '../game-entities/dummy';
import Net from '../game-entities/net';
import CollisionsManager from '../misc/collisions-manager';
import ImageRepository from '../../common/image-repository';
import gameImages from '../resources/images';

window.requestAnimFrame = Utils.getRequestAnimationFrame();

/**
 * Volley client class
 */
export default class Volley {
	/**
	 * Creates a new volley client instance
	 * @param {Object} canvas
	 * @param {Object} images
	 * @param {Object} config
	 * @param {Object} events
	 */
	constructor(canvas, images, config, { onUpdateInputs }) {
		this.isServer = typeof window === 'undefined';
		this.config = config;
		this.gameLoopInterval;
		this.inputs;
		this.images = images;
		this.groundHeight = config.groundHeight;
		this.scores = {};
		this.background;
		this.ball;
		this.dummies = [];
		this.net;

		//events
		this.onUpdateInputs = onUpdateInputs;

		this.gameControls = config.controls;

		//initialize the canvas/context objects
		this.contexts = {};

		_.forOwn(canvas, (canvasId, name) => {
			this.contexts[name] = new Context(canvasId);
			this.contexts[name].setSize(this.config.width, this.config.height);
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
		//show all contexts and focus the game context where the inputs are handled
		_.forOwn(this.contexts, (context) => {
			context.show();
		});
		this.contexts.game.focus();

		//game objects

		this.background = new Background(this);

		this.ball = new Ball(this);

		this.net = new Net(this);

		this.dummies = [
			new Dummy(this)
		];

		//listen for the keyboard and touchscreen events
		this.keyboard.listen();
		this.touchscreen.listen();

		this.gameLoopInterval = setInterval(() => {
			this.gameLoop();
		}, 1000 / this.config.fps);

		window.requestAnimFrame(() => {
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

		this.dummies.forEach((dummy) => {
			dummy.move();
		});

		this.ball.move();

		//handle all game collisions
		this.collisionsManager.handleCollisions();
	}

	/**
	 * Draws the game entities
	 */
	drawGame() {
		//clear the whole canvas before drawing anything (this used to be in the dummy class)
		_.forOwn(this.contexts, (value, key) => {
			this.contexts[key].context.clearRect(0, 0, this.contexts[key].canvas.width, this.contexts[key].canvas.height);
		});

		this.background.draw();

		this.net.draw();

		this.dummies.forEach((dummy) => {
			dummy.draw();
		});

		this.ball.draw();

		window.requestAnimFrame(() => {
			this.drawGame();
		});
	}
}

import _ from 'lodash';
import Utils from '../../common/utils';
import Context from '../../common/context';
import Keyboard from '../../common/inputs/keyboard';
import Touchscreen from '../inputs/touchscreen';
import Background from '../game-entities/background';
import Ball from '../game-entities/ball';
import Dummy from '../game-entities/dummy';
import Net from '../game-entities/net';
import ImageRepository from '../../common/image-repository';
import gameImages from '../resources/images';

window.requestAnimFrame = Utils.getRequestAnimationFrame();

/**
 * Volley client class
 */
export default class Volley {
	/**
	 * Creates a new volley client instance
	 * @param {String} canvasWrapper
	 * @param {Object} images
	 * @param {Object} config
	 * @param {Number} player
	 * @param {Object} events
	 */
	constructor(canvasWrapper, images, config, player, { onUpdateInputs, playMusic, playTrack }) {
		this.isServer = typeof window === 'undefined';
		this.canvasWrapper = canvasWrapper;
		this.musicIsPlaying = false;
		this.config = config;
		this.player = player;
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
		this.playMusic = playMusic;
		this.playTrack = playTrack;

		this.gameControls = config.controls;

		//initialize the canvas/context objects and generate the canvas HTML elements
		this.canvasIds = {
			background: 'background-canvas',
			ball: 'ball-canvas',
			game: 'game-canvas'
		};

		this.contexts = {};

		_.forOwn(this.canvasIds, (canvasId, name) => {
			this.contexts[name] = new Context(canvasId, this.canvasWrapper, this.config.width, this.config.height);
		});

		//initialize the keyboard and touchscreen controls
		this.keyboard = new Keyboard(this.gameControls, this.contexts.game.canvas);
		this.touchscreen = new Touchscreen(this.gameControls, this.contexts.game.canvas);
	}

	/**
	 * Preloads all the game images and calls the provided callback when done
	 * @param {Function} callback
	 */
	static preloadGameImages(callback) {
		new ImageRepository(gameImages, callback);
	}

	/**
	 * Tries to play the music track
	 * This helper function is called after an user input in order to avoid the firefox autoplay limitations
	 */
	tryToPlayMusic() {
		if (this.musicIsPlaying) {
			return;
		}

		const anyKeyPressed = Object.values(this.inputs).find((status) => {
			return status === true;
		});

		if (anyKeyPressed) {
			this.musicIsPlaying = true;
			this.playMusic();
		}
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

		this.dummies = [...Array(this.config.maxPlayers).keys()].map((value, index) => {
			const playerIndex = index + 1;
			const controllable = this.player === playerIndex;
			return new Dummy(
				this,
				this.config.dummy.minForce,
				this.config.dummy.verticalForce,
				this.config.dummy.horizontalForce,
				playerIndex,
				controllable
			);
		});

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
	 * Updates the game state with the data received from the server
	 * @param {Object} data
	 */
	updateData({ dummies, ball, net, background, scores, gameOver }) {
		dummies.forEach((dummy, index) => {
			this.dummies[index].state = dummy;
		});

		this.ball.state = ball;
		this.net.state = net;
		this.background.state = background;

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

		const controllableDummy = this.dummies.find((dummy) => {
			return dummy.controllable;
		});

		//get both types of inputs
		const keyboardInputs = this.keyboard.getInputs();
		const touchscreenInputs = this.touchscreen.getInputs(controllableDummy, this.net);

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

		this.dummies.forEach((dummy) => {
			dummy.move();
		});

		this.ball.move();
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

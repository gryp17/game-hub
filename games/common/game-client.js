import _ from 'lodash';
import Utils from './utils';
import Context from './context';
import ImageRepository from './image-repository';

window.requestAnimFrame = Utils.getRequestAnimationFrame();

/**
 * An abstract GameClient class that contains the base client logic
 */
export default class GameClient {
	/**
	 * Creates a new GameClient instance
	 * @param {Object} canvasIds
	 * @param {String} canvasWrapper
	 * @param {Object} images
	 * @param {Object} config
	 * @param {Number} player
	 * @param {Object} events
	 */
	constructor(canvasIds, canvasWrapper, images, config, player, { onUpdateInputs, playMusic, playTrack }) {
		this.isServer = typeof window === 'undefined';
		this.canvasIds = canvasIds;
		this.canvasWrapper = canvasWrapper;
		this.musicIsPlaying = false;
		this.config = config;
		this.player = player;
		this.gameLoopInterval;
		this.inputs;
		this.images = images;
		this.scores = {};

		//events
		this.onUpdateInputs = onUpdateInputs;
		this.playMusic = playMusic;
		this.playTrack = playTrack;

		this.gameControls = config.controls;

		//initialize the canvas/context objects and generate the canvas HTML elements
		this.contexts = {};

		_.forOwn(this.canvasIds, (canvasId, name) => {
			this.contexts[name] = new Context(canvasId, this.canvasWrapper, this.config.width, this.config.height);
		});
	}

	/**
	 * Preloads all the game images and calls the provided callback when done
	 * @param {Object} gameImages
	 * @param {Function} callback
	 */
	static preloadGameImages(gameImages, callback) {
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
		clearInterval(this.gameLoopInterval);
	}

	/**
	 * Updates the game state with the data received from the server
	 * @param {Object} data
	 */
	updateData({ events, scores, gameOver }) {
		this.scores = scores;

		this.handleServerEvents(events);

		if (gameOver) {
			this.stop();
		}
	}

	/**
	 * Handles the server events
	 * @param {Object} events
	 */
	handleServerEvents(events) {
		throw new Error('Method "handleServerEvents()" must be implemented.');
	}

	/**
	 * Returns the current inputs state
	 * @returns {Object}
	 */
	getInputs() {
		throw new Error('Method "getInputs()" must be implemented.');
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
	}

	/**
	 * Draws the game entities
	 * @param {Function} drawEntities
	 */
	drawGame(drawEntities) {
		//clear the whole canvas before drawing anything
		_.forOwn(this.contexts, (value, key) => {
			this.contexts[key].context.clearRect(0, 0, this.contexts[key].canvas.width, this.contexts[key].canvas.height);
		});

		drawEntities();

		window.requestAnimFrame(() => {
			this.drawGame();
		});
	}
}

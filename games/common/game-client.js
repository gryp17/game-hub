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
	 * @param {Object} controls
	 * @param {Number} player
	 * @param {Object} events
	 */
	constructor(canvasIds, canvasWrapper, images, config, controls, player, { onUpdateInputs, playMusic, playTrack }) {
		this.isServer = typeof window === 'undefined';
		this.canvasIds = canvasIds;
		this.canvasWrapper = canvasWrapper;
		this.musicIsPlaying = false;
		this.config = config;
		this.player = player;
		this.inputs;
		this.images = images;
		this.scores = {};

		//events
		this.onUpdateInputs = onUpdateInputs;
		this.playMusic = playMusic;
		this.playTrack = playTrack;

		this.gameControls = controls;

		//initialize the canvas/context objects and generate the canvas HTML elements
		this.contexts = {};

		_.forOwn(this.canvasIds, (canvasId, name) => {
			this.contexts[name] = new Context(canvasId, this.canvasWrapper, this.config.width, this.config.height);
		});
	}

	/**
	 * Returns the game HUD data that needs to be displayed (score/lives etc.)
	 * @returns {Object}
	 */
	get hudData() {
		return {
			scores: Object.values(this.scores)
		};
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

		window.requestAnimFrame(() => {
			this.gameLoop();
		});
	}

	/**
	 * Stops the game
	 */
	stop() {
		throw new Error('Method "stop()" must be implemented.');
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
	 * Moves the game entities every tick
	 */
	moveEntities() {
		throw new Error('Method "moveEntities()" must be implemented.');
	}

	/**
	 * Draws the game entities every tick
	 */
	drawEntities() {
		throw new Error('Method "drawEntities()" must be implemented.');
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

		//clear the whole canvas before drawing anything
		_.forOwn(this.contexts, (value, key) => {
			this.contexts[key].context.clearRect(0, 0, this.contexts[key].canvas.width, this.contexts[key].canvas.height);
		});

		//move and draw the entities
		this.moveEntities();
		this.drawEntities();

		window.requestAnimFrame(() => {
			this.gameLoop();
		});
	}
}

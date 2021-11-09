import _ from 'lodash';
import GameClient from '../../common/game-client';
import Keyboard from '../../common/inputs/keyboard';
import Background from '../game-entities/background';
import Platform from '../game-entities/platform';
import gameImages from '../resources/images';

/**
 * Jumper client class
 */
export default class Jumper extends GameClient {
	/**
	 * Creates a new jumper client instance
	 * @param {Object} canvasIds
	 * @param {String} canvasWrapper
	 * @param {Object} images
	 * @param {Object} config
	 * @param {Number} player
	 * @param {Object} events
	 */
	constructor(canvasIds, canvasWrapper, images, config, player, { onUpdateInputs, playMusic, playTrack }) {
		super(canvasIds, canvasWrapper, images, config, player, { onUpdateInputs, playMusic, playTrack });

		this.groundHeight = config.groundHeight;

		this.background;
		this.platforms = [];

		//initialize the keyboard and touchscreen controls
		this.keyboard = new Keyboard(this.gameControls, this.contexts.game.canvas);
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
		this.background = new Background(this, this.config.background.selectedBackground);
		this.platforms = [
			new Platform(this, 'large', 600, 530),
			new Platform(this, 'medium', 900, 500),
			new Platform(this, 'large', 1060, 520),
			new Platform(this, 'small', 1320, 540),
			new Platform(this, 'medium', 1460, 560),
			new Platform(this, 'large', 1650, 570),
			new Platform(this, 'small', 1920, 500),
			new Platform(this, 'small', 2030, 540)
		];

		//listen for the keyboard and touchscreen events
		this.keyboard.listen();

		super.start();
	}

	/**
	 * Stops the game
	 */
	stop() {
		//clear all input event listeners
		this.keyboard.removeAllEventListeners();

		super.stop();
	}

	/**
	 * Updates the game state with the data received from the server
	 * @param {Object} data
	 */
	updateData({ events, background, scores, gameOver }) {
		this.background.state = background;

		super.updateData({ events, scores, gameOver });
	}

	/**
	 * Handles the server events
	 * @param {Object} events
	 */
	handleServerEvents(events) {

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
		super.gameLoop();

		this.background.move();
		this.platforms.forEach((platform) => {
			platform.move();
		});
	}

	/**
	 * Draws the game entities
	 */
	drawGame() {
		const drawEntities = () => {
			this.background.draw();

			this.platforms.forEach((platform) => {
				platform.draw();
			});
		};

		super.drawGame(drawEntities);
	}
}

import _ from 'lodash';
import GameClient from '../../common/game-client';
import Keyboard from '../../common/inputs/keyboard';
import Background from '../game-entities/background';
import Platform from '../game-entities/platform';
import Bat from '../game-entities/bat';
import Ghost from '../game-entities/ghost';
import Spider from '../game-entities/spider';
import Dummy from '../game-entities/dummy';
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

		this.background;
		this.platforms = [];
		this.enemies = [];
		this.dummies = [];

		// TODO: update this value with the data received from the server
		this.gameSpeed = this.config.initialSpeed;
		this.speedIncrease = this.config.speedIncrease;
		this.speedUpInterval = this.config.speedUpInterval;

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
	 * Speeds up the game
	 */
	speedUp() {
		this.gameSpeed = parseFloat((this.gameSpeed + this.speedIncrease).toFixed(1));
	}

	/**
	 * Initializes the game entities and starts the game
	 */
	start() {
		const platformsConfig = [
			this.config.platform.sizes,
			this.config.platform.minDistance,
			this.config.platform.maxDistance,
			this.config.platform.minHeight,
			this.config.platform.maxHeight,
			this.config.platform.chanceToFloat,
			this.config.platform.floatSpeed,
			this.config.platform.minFloatDistance,
			this.config.platform.maxFloatDistance
		];

		const dummiesConfig = [
			this.config.dummy.width,
			this.config.dummy.height,
			this.config.dummy.lives,
			this.config.dummy.invincibilityDuration,
			this.config.dummy.acceleration,
			this.config.dummy.maxSpeed,
			this.config.dummy.fallSpeed,
			this.config.dummy.fallSpeedDead,
			this.config.dummy.jumpAcceleration,
			this.config.dummy.maxJumpHeight
		];

		//game objects
		this.background = new Background(
			this,
			this.config.background.speed,
			this.config.background.selectedBackground
		);

		this.platforms = [
			new Platform(this, 'large', 600, 530, ...platformsConfig),
			new Platform(this, 'medium', 900, 500, ...platformsConfig),
			new Platform(this, 'large', 1060, 520, ...platformsConfig),
			new Platform(this, 'small', 1320, 540, ...platformsConfig),
			new Platform(this, 'medium', 1460, 560, ...platformsConfig),
			new Platform(this, 'large', 1650, 570, ...platformsConfig),
			new Platform(this, 'small', 1920, 500, ...platformsConfig),
			new Platform(this, 'small', 2030, 540, ...platformsConfig)
		];

		this.enemies = [
			new Spider(this, 80, 1200, 0),
			new Ghost(this, 100, 1290, 300),
			new Bat(this, 100, 1100, 200)
		];

		this.dummies = [
			new Dummy(this, ...dummiesConfig, 1, true)
		];

		//listen for the keyboard and touchscreen events
		this.keyboard.listen();

		//TODO: move this logic to the server and send the updated value to the clients
		setInterval(() => {
			this.speedUp();
		}, this.speedUpInterval);

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

		this.enemies.forEach((enemy) => {
			enemy.move();
		});

		this.dummies.forEach((dummy) => {
			dummy.move();
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

			this.enemies.forEach((enemy) => {
				enemy.draw();
			});

			this.dummies.forEach((dummy) => {
				dummy.draw();
			});
		};

		super.drawGame(drawEntities);
	}
}

import _ from 'lodash';
import GameClient from '../../common/game-client';
import Keyboard from '../../common/inputs/keyboard';
import Touchscreen from '../inputs/touchscreen';
import Background from '../game-entities/background';
import Ball from '../game-entities/ball';
import Dummy from '../game-entities/dummy';
import Net from '../game-entities/net';
import gameImages from '../resources/images';

/**
 * Volley client class
 */
export default class Volley extends GameClient {
	/**
	 * Creates a new volley client instance
	 * @param {Object} canvasIds
	 * @param {String} canvasWrapper
	 * @param {Object} images
	 * @param {Object} config
	 * @param {Object} controls
	 * @param {Number} player
	 * @param {Object} events
	 */
	constructor(canvasIds, canvasWrapper, images, config, controls, player, { onUpdateInputs, playMusic, playTrack }) {
		super(canvasIds, canvasWrapper, images, config, controls, player, { onUpdateInputs, playMusic, playTrack });

		this.groundHeight = config.groundHeight;

		this.background;
		this.ball;
		this.dummies = [];
		this.net;

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
		this.background = new Background(this, this.config.background.selectedBackground);

		this.ball = new Ball(
			this,
			this.config.ball.size,
			this.config.ball.initialRotationSpeed,
			this.config.ball.gravity,
			this.config.ball.dt,
			this.config.ball.horizontalFriction,
			this.config.ball.verticalFriction,
			this.config.ball.maxHits,
			this.config.ball.serveTimeout
		);
		this.net = new Net(this, this.config.net.height);

		this.dummies = [...Array(this.config.maxPlayers).keys()].map((value, index) => {
			const playerIndex = index + 1;
			const controllable = this.player === playerIndex;
			return new Dummy(
				this,
				this.config.dummy.acceleration,
				this.config.dummy.maxSpeed,
				this.config.dummy.jumpAcceleration,
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

		super.start();
	}

	/**
	 * Stops the game
	 */
	stop() {
		//clear all input event listeners
		this.keyboard.removeAllEventListeners();
		this.touchscreen.removeAllEventListeners();
	}

	/**
	 * Updates the game state with the data received from the server
	 * @param {Object} data
	 */
	updateData({ events, dummies, ball, net, background, scores, gameOver }) {
		dummies.forEach((dummy, index) => {
			this.dummies[index].state = dummy;
		});

		this.ball.state = ball;
		this.net.state = net;
		this.background.state = background;

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
		this.playTrack('volleyHit');
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
	 * Moves the game entities every tick
	 */
	moveEntities() {
		this.dummies.forEach((dummy) => {
			dummy.move();
		});

		this.ball.move();
	}

	/**
	 * Draws the game entities every tick
	 */
	drawEntities() {
		this.background.draw();

		this.net.draw();

		this.dummies.forEach((dummy) => {
			dummy.draw();
		});

		this.ball.draw();
	}
}

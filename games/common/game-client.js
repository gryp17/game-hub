import _ from 'lodash';
import Context from './context';
import ImageRepository from './image-repository';

/**
 * An abstract GameClient class that contains the base client logic
 */
export default class GameClient {
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
		// TODO: check if this is necessary
		// this.contexts.game.focus();

		this.gameLoopInterval = setInterval(() => {
			this.gameLoop();
		}, 1000 / this.config.fps);

		window.requestAnimFrame(() => {
			this.drawGame();
		});
	}
}

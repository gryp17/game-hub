import _ from 'lodash';

/**
 * An abstract GameServer class that contains the base server logic
 */
export default class GameServer {
	/**
	 * Creates a new GameServer instance
	 * @param {Number} id
	 * @param {Object} config
	 * @param {Object} customSettings
	 * @param {Array} players
	 * @param {Object} events
	 * @param {Object} canvasIds
	 */
	constructor(id, config, customSettings, players, { onUpdate, onGameOver }, canvasIds) {
		if (this.constructor === GameServer) {
			throw new Error('Abstract class "GameServer" can not be instantiated');
		}

		this.isServer = typeof window === 'undefined';
		this.id = id;
		this.config = this.applySettings(config, customSettings);
		this.players = players;
		this.onUpdate = onUpdate;
		this.onGameOver = onGameOver;
		this.gameLoopInterval;

		this.gameOver = false;

		this.inputs = {};
		this.scores = {};

		this.canvasIds = canvasIds;
		this.contexts = {};

		players.forEach((player, index) => {
			//set all player inputs to false
			this.inputs[player.socketId] = {};

			_.forOwn(this.config.controls, (data, input) => {
				this.inputs[player.socketId][input] = false;
			});

			//generate the player 1 and player 2 scores
			this.scores[index + 1] = {
				id: player.id,
				username: player.username,
				score: 0
			};
		});

		//generate the mocked contexts/canvas objects (not really used on the server apart from the canvas size)
		_.forOwn(this.canvasIds, (canvasId, name) => {
			this.contexts[name] = {
				context: {},
				canvas: {
					width: this.config.width,
					height: this.config.height
				}
			};
		});
	}

	/**
	 * Merges the defaultConfig and the customSettings
	 * @param {Object} defaultConfig
	 * @param {Object} customSettings
	 * @param {Object} settingsPathMap
	 * @returns {Object}
	 */
	applySettings(defaultConfig, customSettings, settingsPathMap) {
		const config = {
			...defaultConfig
		};

		_.forOwn(defaultConfig.configurableSettings, (predefinedValues, settingType) => {
			if (customSettings && customSettings[settingType]) {
				const path = settingsPathMap[settingType];
				const value = predefinedValues[customSettings[settingType]];
				_.set(config, path, value);
			}
		});

		return config;
	}

	/**
	 * Updates the inputs belonging to the provided socketId/player
	 * @param {Object} data
	 */
	updateInputs({ socketId, inputs }) {
		this.inputs[socketId] = inputs;
	}

	/**
	 * Ends the game
	 * @param {Object} winner
	 * @param {Boolean} ragequit
	 */
	gameIsOver(winner, ragequit = false) {
		const scores = {};

		//format the scores object
		Object.keys(this.scores).forEach((key) => {
			const user = this.scores[key];
			scores[user.id] = user.score;
		});

		//stop the game loop, mark the game as game over and update the game state one last time
		this.stop();
		this.gameOver = true;
		this.onGameStateUpdate();
		this.onGameOver(winner, scores, ragequit);
	}

	/**
	 * Called when one of the players scores
	 * @param {Number} player
	 */
	onPlayerScore(player) {
		this.scores[player].score = this.scores[player].score + 1;

		if (this.scores[player].score === this.config.maxScore) {
			this.gameIsOver(this.players[player - 1]);
		}
	}

	/**
	 * Sends an update to the clients with the current game state
	 * @param {Object} state
	 */
	onGameStateUpdate(state) {
		this.onUpdate(state);
	}

	/**
	 * Initializes the game entities and starts the game
	 * @param {Function} gameLoop
	 */
	start(gameLoop) {
		this.gameLoopInterval = setInterval(() => {
			gameLoop();
			this.onGameStateUpdate();
		}, 1000 / this.config.fps);
	}

	/**
	 * Stops the game
	 */
	stop() {
		clearInterval(this.gameLoopInterval);
	}
}

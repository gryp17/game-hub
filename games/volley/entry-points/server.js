import _ from 'lodash';
import GameServer from '../../common/game-server';
import Dummy from '../game-entities/dummy';
import Ball from '../game-entities/ball';
import Net from '../game-entities/net';
import Background from '../game-entities/background';

/**
 * Volley server class
 */
export default class Volley extends GameServer {
	/**
	 * Creates a new volley server instance
	 * @param {Number} id
	 * @param {Object} config
	 * @param {Object} customSettings
	 * @param {Array} players
	 * @param {Object} events
	 */
	constructor(id, config, customSettings, players, { onUpdate, onGameOver }) {
		const canvasIds = {
			background: 'background-canvas',
			ball: 'ball-canvas',
			game: 'game-canvas'
		};

		super(id, config, customSettings, players, { onUpdate, onGameOver }, canvasIds);

		this.groundHeight = config.groundHeight;
		this.dummies = [];
		this.ball;
		this.background;
		this.net;
	}

	/**
	 * Merges the defaultConfig and the customSettings
	 * @param {Object} defaultConfig
	 * @param {Object} customSettings
	 * @returns {Object}
	 */
	applySettings(defaultConfig, customSettings) {
		//map each setting type to the path in the config that it corresponds to
		const settingsPathMap = {
			gameLength: 'maxScore',
			background: 'background.selectedBackground',
			netHeight: 'net.height',
			hitLimit: 'ball.maxHits'
		};

		const config = super.applySettings(defaultConfig, customSettings, settingsPathMap);

		//pick a random background if the default option was selected
		if (!customSettings || customSettings.background === 'default') {
			config.background.selectedBackground = _.sample(config.background.availableBackgrounds);
		}

		return config;
	}

	/**
	 * Called when one of the players scores
	 * @param {Number} player
	 */
	onPlayerScore(player) {
		super.onPlayerScore(player);

		if (this.scores[player].score < this.config.maxScore) {
			//otherwise reset the ball position
			this.ball.reset(player);
		}
	}

	/**
	 * Sends an update to the clients with the current game state
	 */
	onGameStateUpdate() {
		const dummiesState = this.dummies.map((dummy) => {
			return dummy.state;
		});

		super.onGameStateUpdate({
			dummies: dummiesState,
			ball: this.ball.state,
			net: this.net.state,
			background: this.background.state,
			scores: this.scores,
			gameOver: this.gameOver
		});
	}

	/**
	 * Initializes the game entities and starts the game
	 */
	start() {
		this.background = new Background(this, this.config.background.selectedBackground);
		this.net = new Net(this, this.config.net.height);
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

		this.dummies = this.players.map((player, index) => {
			const playerIndex = index + 1;
			return new Dummy(
				this,
				this.config.dummy.maxSpeed,
				this.config.dummy.acceleration,
				this.config.dummy.jumpAcceleration,
				this.config.dummy.minForce,
				this.config.dummy.verticalForce,
				this.config.dummy.horizontalForce,
				playerIndex,
				true,
				player.socketId
			);
		});

		const gameLoop = () => {
			this.dummies.forEach((dummy) => {
				dummy.move();
			});
			this.ball.move();
		};

		super.start(gameLoop);
	}
}

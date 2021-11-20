import _ from 'lodash';
import GameServer from '../../common/game-server';
import Dummy from '../game-entities/dummy';
import Background from '../game-entities/background';
import Platform from '../game-entities/platform';
import Bat from '../game-entities/bat';
import Spider from '../game-entities/spider';
import Ghost from '../game-entities/ghost';

/**
 * Jumper server class
 */
export default class Jumper extends GameServer {
	/**
	 * Creates a new jumper server instance
	 * @param {Number} id
	 * @param {Object} config
	 * @param {Object} customSettings
	 * @param {Array} players
	 * @param {Object} events
	 */
	constructor(id, config, customSettings, players, { onUpdate, onGameOver }) {
		const canvasIds = {
			background: 'background-canvas',
			game: 'game-canvas',
			enemies: 'enemies-canvas'
		};

		super(id, config, customSettings, players, { onUpdate, onGameOver }, canvasIds);

		this.gameSpeed = this.config.initialSpeed;
		this.speedIncrease = this.config.speedIncrease;
		this.speedUpInterval = this.config.speedUpInterval;
		this.speedUpIntervalId;

		this.background;
		this.platforms = [];
		this.enemies = [];
		this.dummies = [];
	}

	/**
	 * Speeds up the game
	 */
	speedUp() {
		this.gameSpeed = parseFloat((this.gameSpeed + this.speedIncrease).toFixed(1));
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
			gameSpeed: 'speedUpInterval',
			background: 'background.selectedBackground',
			lives: 'dummy.lives',
			platformsDistance: 'platform.maxDistance'
		};

		const config = super.applySettings(defaultConfig, customSettings, settingsPathMap);

		//pick a random background if the default option was selected
		if (!customSettings || customSettings.background === 'default') {
			config.background.selectedBackground = _.sample(config.background.availableBackgrounds);
		}

		return config;
	}

	/**
	 * Sends an update to the clients with the current game state
	 */
	onGameStateUpdate() {
		const platformsState = this.platforms.map((platform) => {
			return platform.state;
		});

		const dummiesState = this.dummies.map((dummy) => {
			return dummy.state;
		});

		const enemiesState = this.enemies.map((enemy) => {
			return enemy.state;
		});

		super.onGameStateUpdate({
			platforms: platformsState,
			dummies: dummiesState,
			enemies: enemiesState,
			gameSpeed: this.gameSpeed,
			scores: this.scores,
			gameOver: this.gameOver
		});
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
			new Spider(
				this,
				this.config.spider.size,
				1300,
				this.config.spider.size * -1,
				this.config.spider.netWidth,
				this.config.spider.speed,
				this.config.spider.fallingSpeed,
				this.config.spider.minSpawnDistance,
				this.config.spider.maxSpawnDistance,
				this.config.spider.minHangOffset,
				this.config.spider.maxHangOffset,
				this.config.spider.minHangTime,
				this.config.spider.maxHangTime
			),
			new Ghost(
				this,
				this.config.ghost.size,
				4000,
				300,
				this.config.ghost.speed,
				this.config.ghost.deadSpeed,
				this.config.ghost.fallingSpeed,
				this.config.ghost.deadRotationSpeed,
				this.config.ghost.deadFadeSpeed,
				this.config.ghost.deadShrinkSpeed,
				this.config.ghost.minSpawnDistance,
				this.config.ghost.maxSpawnDistance,
				this.config.ghost.minSpawnHeight,
				this.config.ghost.maxSpawnHeight,
				this.config.ghost.minFloatDistance,
				this.config.ghost.maxFloatDistance,
				this.config.ghost.floatSpeed
			),
			new Bat(
				this,
				this.config.bat.size,
				4700,
				200,
				this.config.bat.speed,
				this.config.bat.deadSpeed,
				this.config.bat.fallingSpeed,
				this.config.bat.deadRotationSpeed,
				this.config.bat.minSpawnDistance,
				this.config.bat.maxSpawnDistance,
				this.config.bat.minSpawnHeight,
				this.config.bat.maxSpawnHeight
			)
		];

		this.dummies = this.players.map((player, index) => {
			const playerIndex = index + 1;
			return new Dummy(this, ...dummiesConfig, playerIndex, true, player);
		});

		const gameLoop = () => {
			this.platforms.forEach((platform) => {
				platform.move();
			});

			this.enemies.forEach((enemy) => {
				enemy.move();
			});

			this.dummies.forEach((dummy) => {
				dummy.move();
			});
		};

		this.speedUpIntervalId = setInterval(() => {
			this.speedUp();
		}, this.speedUpInterval);

		super.start(gameLoop);
	}

	/**
	 * Stops the game
	 */
	stop() {
		clearInterval(this.speedUpIntervalId);
		super.stop();
	}
}

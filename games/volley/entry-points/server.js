import Dummy from '../game-entities/dummy';
import Ball from '../game-entities/ball';
import Net from '../game-entities/net';
import Background from '../game-entities/background';

/**
 * Volley server class
 */
export default class Volley {
	/**
	 * Creates a new volley server instance
	 * @param {Number} id
	 * @param {Object} config
	 * @param {Object} customSettings
	 * @param {Array} players
	 * @param {Object} events
	 */
	constructor(id, config, customSettings, players, { onUpdate, onGameOver }) {
		this.isServer = typeof window === 'undefined';
		this.id = id;
		this.config = config;
		this.players = players;
		this.onUpdate = onUpdate;
		this.onGameOver = onGameOver;
		this.gameLoopInterval;
		this.groundHeight = config.groundHeight;
		this.dummies = [];
		this.scores = {};
		this.gameOver = false;

		this.inputs = {};

		players.forEach((player, index) => {
			this.inputs[player.socketId] = {
				UP: false,
				LEFT: false,
				RIGHT: false
			};

			//generate the player 1 and player 2 scores
			this.scores[index + 1] = {
				id: player.id,
				username: player.username,
				score: 0
			};
		});

		this.ball;
		this.background;
		this.net;

		//mocked contexts/canvas objects (not really needed on the server)
		this.contexts = {
			game: {
				context: {},
				canvas: {
					width: this.config.width,
					height: this.config.height
				}
			},
			ball: {
				context: {},
				canvas: {
					width: this.config.width,
					height: this.config.height
				}
			},
			background: {
				context: {},
				canvas: {
					width: this.config.width,
					height: this.config.height
				}
			}
		};
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
		} else {
			//otherwise reset the ball position and after some timeout shoot it again in some random direction
			this.ball.reset();
		}
	}

	/**
	 * Sends an update to the clients with the current game state
	 */
	onGameStateUpdate() {
		const dummiesState = this.dummies.map((dummy) => {
			return dummy.state;
		});

		this.onUpdate({
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
		this.background = new Background(this);
		this.net = new Net(this);
		this.ball = new Ball(this);

		this.dummies = this.players.map((player, index) => {
			const playerIndex = index + 1;
			return new Dummy(
				this,
				this.config.dummy.minForce,
				this.config.dummy.verticalForce,
				this.config.dummy.horizontalForce,
				playerIndex,
				true,
				player.socketId
			);
		});

		this.gameLoopInterval = setInterval(() => {
			this.dummies.forEach((dummy) => {
				dummy.move();
			});
			this.ball.move();

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

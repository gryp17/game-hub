import Paddle from '../paddle';
import Ball from '../ball';
import CollisionsManager from '../collisions-manager';

export default class Pong {
	constructor(id, config, players, { onUpdate }) {
		this.isServer = typeof window === 'undefined';
		this.id = id;
		this.config = config;
		this.players = players;
		this.onUpdate = onUpdate;
		this.gameLoopInterval;
		this.paddles = [];
		this.scores = {};

		this.inputs = {};

		players.forEach((player, index) => {
			this.inputs[player.socketId] = {
				UP: false,
				DOWN: false
			};

			//generate the player 1 and player 2 scores
			this.scores[index + 1] = {
				id: player.id,
				username: player.username,
				score: 0
			};
		});

		this.ball;

		this.contexts = {
			game: {
				context: {},
				canvas: {
					width: this.config.width,
					height: this.config.height
				}
			}
		};

		//initialize the collisions manager
		this.collisionsManager = new CollisionsManager(this);
	}

	updateInputs({ socketId, inputs }) {
		this.inputs[socketId] = inputs;
	}

	onPlayerScore(player) {
		this.scores[player].score = this.scores[player].score + 1;

		if (this.scores[player].score === this.config.maxScore) {
			// TODO: end the game
		} else {
			// TODO: otherwise reset the ball position and after some timeout shoot it again in some random direction
			this.ball.reset();
		}
	}

	start() {
		this.paddles = this.players.map((player, index) => {
			const playerIndex = index + 1;
			return new Paddle(this, this.config.paddle.acceleration, this.config.paddle.maxSpeed, playerIndex, true, player.socketId);
		});

		this.ball = new Ball(this, this.config.ball.size, this.config.ball.initialSpeed, this.config.ball.acceleration);

		this.gameLoopInterval = setInterval(() => {
			this.paddles.forEach((paddle) => {
				paddle.move();
			});
			this.ball.move();

			const paddlesState = this.paddles.map((paddle) => {
				return paddle.getState();
			});

			this.onUpdate({
				paddles: paddlesState,
				ball: this.ball.getState(),
				scores: this.scores
			});

			//handle all game collisions
			this.collisionsManager.handleCollisions();
		}, 1000 / this.config.fps);
	}

	stop() {
		clearInterval(this.gameLoopInterval);
	}
}

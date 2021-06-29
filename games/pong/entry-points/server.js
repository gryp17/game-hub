import Paddle from '../paddle';
import Ball from '../ball';
import CollisionsManager from '../collisions-manager';

export default class Pong {
	constructor(id, fps, canvas, players, { onUpdate }) {
		this.isServer = typeof window === 'undefined';
		this.id = id;
		this.fps = fps;
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
				canvas
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
	}

	start() {
		this.paddles = [
			new Paddle(this, 1, true, this.players[0].socketId),
			new Paddle(this, 2, true, this.players[1].socketId)
		];

		this.ball = new Ball(this, 200, 200, 10, 10);

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
		}, 1000 / this.fps);
	}

	stop() {
		clearInterval(this.gameLoopInterval);
	}
}

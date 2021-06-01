import Paddle from '../../games/pong/paddle';
import Ball from '../../games/pong/ball';
import CollisionsManager from '../../games/pong/collisions-manager';

export default class Pong {
	constructor(id, fps, canvas, players, { onUpdate }) {
		this.isServer = typeof window === 'undefined';
		this.id = id;
		this.fps = fps;
		this.players = players;
		this.onUpdate = onUpdate;
		this.gameLoop;
		this.paddles = [];

		this.inputs = {};

		players.forEach((socketId) => {
			this.inputs[socketId] = {
				UP: false,
				DOWN: false
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

	playerBelongsToGame(socketId) {
		return this.players.includes(socketId);
	}

	updateInputs({ socketId, inputs }) {
		this.inputs[socketId] = inputs;
	}

	start() {
		this.paddles = [
			new Paddle(this, 1, true, this.players[0]),
			new Paddle(this, 2, true, this.players[1])
		];

		this.ball = new Ball(this, 200, 200, 10, 10);

		this.gameLoop = setInterval(() => {
			this.paddles.forEach((paddle) => {
				paddle.move();
			});
			this.ball.move();

			const paddlesState = this.paddles.map((paddle) => {
				return paddle.getState();
			});

			this.onUpdate({
				paddles: paddlesState,
				ball: this.ball.getState()
			});

			//handle all game collisions
			this.collisionsManager.handleCollisions();
		}, 1000 / this.fps);
	}

	stop() {
		clearInterval(this.gameLoop);
	}
}

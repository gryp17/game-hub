import Context from '../context';
import Keyboard from '../keyboard';
import Paddle from '../paddle';
import Ball from '../ball';
import CollisionsManager from '../collisions-manager';
import ImageRepository from '../image-repository';
import gameImages from '../resources/images';

/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function anim() {
	return window.requestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function anim(callback, element) {
				window.setTimeout(callback, 1000);
			};
}());

export default class Pong {
	constructor(canvasId, config, player, { onGameReady, onUpdateInputs }) {
		this.isServer = typeof window === 'undefined';
		this.config = config;
		this.player = player;
		this.gameLoopInterval;
		this.inputs;
		this.images = {};
		this.paddles = [];
		this.scores = {};
		this.ball;

		//events
		this.onUpdateInputs = onUpdateInputs;
		this.onGameReady = onGameReady;

		this.gameControls = config.controls;

		//initialize the keyboard controls
		this.keyboard = new Keyboard(this.gameControls);

		//canvas/context objects
		this.contexts = {
			game: new Context(canvasId)
		};

		this.contexts.game.setSize(this.config.width, this.config.height);

		this.collisionsManager = new CollisionsManager(this);

		new ImageRepository(gameImages, (images) => {
			this.images = images;
			this.onGameReady();
		});
	}

	start() {
		this.contexts.game.show();
		this.contexts.game.focus();

		//game objects
		this.paddles = [...Array(this.config.maxPlayers).keys()].map((value, index) => {
			const playerIndex = index + 1;
			const controllable = this.player === playerIndex;
			return new Paddle(this, this.config.paddle.acceleration, this.config.paddle.maxSpeed, playerIndex, controllable);
		});

		this.ball = new Ball(this, this.config.ball.size, this.config.ball.initialSpeed, this.config.ball.acceleration);

		//listen for the keyboard events
		this.keyboard.listen();

		this.gameLoopInterval = setInterval(() => {
			this.gameLoop();
		}, 1000 / this.config.fps);

		requestAnimationFrame(() => {
			this.drawGame();
		});
	}

	stop() {
		clearInterval(this.gameLoopInterval);
	}

	updateData({ paddles, ball, scores, gameOver }) {
		paddles.forEach((paddle, index) => {
			this.paddles[index].setState(paddle);
		});

		this.ball.setState(ball);

		this.scores = scores;

		if (gameOver) {
			this.stop();
		}
	}

	gameLoop() {
		//get the current inputs status
		const oldInputs = {
			...this.inputs
		};
		this.inputs = this.keyboard.getInputs();

		//emit the updateInputs only if the inputs have changed
		if (!_.isEqual(oldInputs, this.inputs)) {
			this.onUpdateInputs(this.inputs);
		}

		this.paddles.forEach((paddle) => {
			paddle.move();
		});
		this.ball.move();

		//handle all game collisions
		this.collisionsManager.handleCollisions();
	}

	drawGame() {
		//clear the whole canvas before drawing anything (this used to be in the paddle class)
		this.contexts.game.context.clearRect(0, 0, this.contexts.game.canvas.width, this.contexts.game.canvas.height);

		this.paddles.forEach((paddle) => {
			paddle.draw();
		});
		this.ball.draw();

		window.requestAnimFrame(() => {
			this.drawGame();
		});
	}
}

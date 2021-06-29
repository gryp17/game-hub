import Context from '../context';
import Keyboard from '../keyboard';
import Paddle from '../paddle';
import Ball from '../ball';
import CollisionsManager from '../collisions-manager';

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
	constructor(canvasId, { onUpdateInputs }) {
		this.isServer = typeof window === 'undefined';
		this.gameLoopInterval;
		this.inputs;
		this.paddles = [];
		this.scores = {};
		this.ball;

		//events
		this.onUpdateInputs = onUpdateInputs;

		// TODO: move to a config or something
		this.gameControls = {
			UP: {
				keys: [38, 87] //arrow up, W
			},
			DOWN: {
				keys: [40, 83] //arrow down, S
			}
		};

		//initialize the keyboard controls
		this.keyboard = new Keyboard(this.gameControls);

		//canvas/context objects
		this.contexts = {
			game: new Context(canvasId)
		};

		this.collisionsManager = new CollisionsManager(this);
	}

	start(fps, canvas, player) {
		console.log(`######### START GAME WITH FPS ${fps} AS PLAYER ${player}`);

		this.contexts.game.setSize(canvas.width, canvas.height);
		this.contexts.game.show();
		this.contexts.game.focus();

		//game objects
		this.paddles = [
			new Paddle(this, 1, player === 1),
			new Paddle(this, 2, player === 2)
		];
		this.ball = new Ball(this, 200, 200, 10, 10);

		//listen for the keyboard events
		this.keyboard.listen();

		this.gameLoopInterval = setInterval(() => {
			this.gameLoop();
		}, 1000 / fps);

		requestAnimationFrame(() => {
			this.drawGame();
		});
	}

	stop() {
		clearInterval(this.gameLoopInterval);
	}

	updateData({ paddles, ball, scores }) {
		paddles.forEach((paddle, index) => {
			this.paddles[index].setState(paddle);
		});

		this.ball.setState(ball);

		this.scores = scores;
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

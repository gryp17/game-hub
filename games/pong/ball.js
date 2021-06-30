import _ from 'lodash';

export default class Ball {
	constructor(game, x = 0, y = 0, dx = 0, dy = 0) {
		this.context = game.contexts.game.context;
		this.canvas = game.contexts.game.canvas;

		this.width = 60;
		this.height = 60;
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;

		// TODO: load this image in a different way and save it in the "game" object
		if (!game.isServer) {
			this.image = new Image();
			this.image.src = 'https://www.pinclipart.com/picdir/big/544-5446703_transparent-background-red-ball-icon-clipart.png';
		}
	}

	resetPosition() {
		this.x = (this.canvas.width / 2) - (this.width / 2);
		this.y = (this.canvas.height / 2) - (this.height / 2);

		const directionMultiplier = this.dx > 0 ? 1 : -1;

		this.dx = 0;
		this.dy = 0;

		//start moving the ball again after some delay
		setTimeout(() => {
			this.dx = 10 * directionMultiplier;
			this.dy = _.random(-10, 10);
		}, 3000);
	}

	move() {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
	}

	draw() {
		this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

	moveAndDraw() {
		this.move();
		this.draw();
	}

	/**
	 * Returns the paddle hitbox
	 * @returns {Object}
	 */
	getHitbox() {
		return {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height
		};
	}

	getState() {
		return {
			x: this.x,
			y: this.y,
			dx: this.dx,
			dy: this.dy
		};
	}

	setState(state) {
		this.x = state.x;
		this.y = state.y;
		this.dx = state.dx;
		this.dy = state.dy;
	}
}

import Entity from '../../common/entity';
import Sprite from '../../common/sprite';
import SpiderNet from './spider-net';

/**
 * Spider class
 */
export default class Spider extends Entity {
	/**
	 * Creates a new spider instance
	 * @param {Object} game
	 */
	constructor(game, size, x, y) {
		super(game, game.contexts.enemies, size, size, x, y);

		//TODO: move this to config
		this.speed = 1;
		this.fallingSpeed = 8;

		this.dx = this.game.background.dx;
		this.dy = this.speed;

		this.minHangPosition;
		this.maxHangPosition;
		this.hangTimeoutId;

		this.idle = false;
		this.dead = false;

		if (!game.isServer) {
			this.deadImage = this.game.images.spider.dead;
			this.idleImage = this.game.images.spider.idle;
			this.movingSprite = new Sprite(this.game.images.spider.moving, 10, true);

			this.image = this.idleImage;
		}

		this.spiderNet = new SpiderNet(game, this);

		this.randomizeHangParameters();

		setTimeout(() => {
			// this.die();
		}, 5000);
	}

	/**
	 * Makes the spider die
	 */
	die() {
		this.dead = true;
		this.dy = this.fallingSpeed;
		clearTimeout(this.hangTimeoutId);
	}

	/**
	 * Randomizes the hang parameters
	 */
	randomizeHangParameters() {
		this.minHangPosition = _.random(0, this.height);
		this.maxHangPosition = _.random(this.minHangPosition + 200, this.minHangPosition + 350);
	}

	/**
	 * Moves the spider
	 */
	move() {
		if (this.right < 0 || this.top > this.canvas.height) {
			this.reset();
		}

		if (!this.dead && !this.idle) {
			this.hang();
		}

		super.move();

		this.spiderNet.move();
	}

	/**
	 * Resets the spider
	 */
	reset() {
		this.dead = false;
		this.idle = false;
		this.x = this.canvas.width + _.random(50, 200);
		this.y = this.height * -1;
		this.dx = this.game.background.dx;
		this.dy = this.speed;

		clearTimeout(this.hangTimeoutId);
		this.randomizeHangParameters();
	}

	/**
	 * Triggers handing logic (makes the spider move up and down on its net)
	 */
	hang() {
		//stop moving down
		if (this.dy > 0 && this.bottom >= this.maxHangPosition) {
			this.bottom = this.maxHangPosition;
			this.dy = 0;
			this.idle = true;

			//start moving up after some delay
			this.startMovingAfterDelay('up');
		}

		//stop moving up
		if (this.dy < 0 && this.top <= this.minHangPosition) {
			this.top = this.minHangPosition;
			this.dy = 0;
			this.idle = true;

			//start moving down after some delay
			this.startMovingAfterDelay('down');
		}
	}

	/**
	 * Waits X seconds and starts moving the spider in the specified direction
	 * @param {String} direction
	 */
	startMovingAfterDelay(direction) {
		//TODO: use config for the min and max values
		const delay = _.random(1000, 6000);

		clearTimeout(this.hangTimeoutId);
		this.hangTimeoutId = setTimeout(() => {
			this.idle = false;
			this.dy = direction === 'up' ? this.speed * -1 : this.speed;
		}, delay);
	}

	/**
	 * Draws the dummy
	 */
	draw() {
		//update the image with the correct sprite image
		this.updateSprite();

		if (!this.dead) {
			this.spiderNet.draw();
		}

		this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

	/**
	 * Updates the image property with the correct sprite image
	 */
	updateSprite() {
		if (this.dead) {
			this.image = this.deadImage;
		} else if (this.dy === 0) {
			this.image = this.idleImage;
		} else {
			this.image = this.movingSprite.move();
		}
	}
}

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
		this.maxY = 300;

		this.dx = this.game.background.dx;
		this.dy = this.speed;

		this.idle = false;
		this.dead = false;

		if (!game.isServer) {
			//TODO: add dead image and logic
			this.deadImage = this.game.images.spider.dead;
			this.idleImage = this.game.images.spider.idle;
			this.movingSprite = new Sprite(this.game.images.spider.moving, 10, true);

			this.image = this.idleImage;
		}

		this.spiderNet = new SpiderNet(game, this);

		setTimeout(() => {
			this.die();
		}, 5000);
	}

	/**
	 * Makes the spider die
	 */
	die() {
		this.dead = true;
		this.dy = this.fallingSpeed;
	}

	/**
	 * Moves the spider
	 */
	move() {
		if (this.right < 0 || this.top > this.canvas.height) {
			this.reset();
		}

		//stop moving
		if (!this.dead && this.bottom >= this.maxY) {
			this.bottom = this.maxY;
			this.idle = true;
		}

		super.move();

		this.spiderNet.move();
	}

	/**
	 * Resets the spider
	 */
	reset() {
		this.dead = false;
		this.x = this.canvas.width + _.random(50, 200);
		this.y = 0;
		this.dx = this.game.background.dx;
		this.dy = this.speed;
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
		} else if (this.idle) {
			this.image = this.idleImage;
		} else {
			this.image = this.movingSprite.move();
		}
	}
}

import _ from 'lodash';
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
	 * @param {Number} size
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} speed
	 * @param {Number} fallingSpeed
	 * @param {Number} minSpawnDistance
	 * @param {Number} maxSpawnDistance
	 * @param {Number} minHangOffset
	 * @param {Number} maxHangOffset
	 * @param {Number} minHangTime
	 * @param {Number} maxHangTime
	 */
	constructor(game, size, x, y, netWidth, speed, fallingSpeed, minSpawnDistance, maxSpawnDistance, minHangOffset, maxHangOffset, minHangTime, maxHangTime) {
		super(game, game.contexts.enemies, size, size, x, y);

		this.speed = speed;
		this.fallingSpeed = fallingSpeed;
		this.minSpawnDistance = minSpawnDistance;
		this.maxSpawnDistance = maxSpawnDistance;
		this.minHangOffset = minHangOffset;
		this.maxHangOffset = maxHangOffset;
		this.minHangTime = minHangTime;
		this.maxHangTime = maxHangTime;

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

		this.spiderNet = new SpiderNet(game, this, netWidth);

		if (this.game.isServer) {
			this.randomizeHangParameters();
		}
	}

	/**
	 * Returns the spider state
	 * @returns {Object}
	 */
	get state() {
		return {
			...super.state,
			dead: this.dead,
			idle: this.idle
		};
	}

	/**
	 * Sets the spider state
	 * @param {Object} state
	 */
	set state(state) {
		super.state = state;

		this.dead = state.dead;
		this.idle = state.idle;
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
		this.maxHangPosition = _.random(this.minHangPosition + this.minHangOffset, this.minHangPosition + this.maxHangOffset);
	}

	/**
	 * Moves the spider
	 */
	move() {
		const isOutOfScreen = this.right < 0 || this.top > this.canvas.height;

		if (this.game.isServer && isOutOfScreen) {
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
		this.x = this.canvas.width + _.random(this.minSpawnDistance, this.maxSpawnDistance);
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
			if (this.game.isServer) {
				this.startMovingAfterDelay('up');
			}
		}

		//stop moving up
		if (this.dy < 0 && this.top <= this.minHangPosition) {
			this.top = this.minHangPosition;
			this.dy = 0;
			this.idle = true;

			//start moving down after some delay
			if (this.game.isServer) {
				this.startMovingAfterDelay('down');
			}
		}
	}

	/**
	 * Waits X seconds and starts moving the spider in the specified direction
	 * @param {String} direction
	 */
	startMovingAfterDelay(direction) {
		const delay = _.random(this.minHangTime, this.maxHangTime);

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

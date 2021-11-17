import _ from 'lodash';
import Entity from '../../common/entity';
import Sprite from '../../common/sprite';
import Utils from '../../common/utils';

/**
 * Bat class
 */
export default class Bat extends Entity {
	/**
	 * Creates a new bat instance
	 * @param {Object} game
	 * @param {Number} size
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} speed
	 * @param {Number} deadSpeed
	 * @param {Number} fallingSpeed
	 * @param {Number} deadRotationSpeed
	 * @param {Number} minSpawnDistance
	 * @param {Number} maxSpawnDistance
	 * @param {Number} minSpawnHeight
	 * @param {Number} maxSpawnHeight
	 */
	constructor(game, size, x, y, speed, deadSpeed, fallingSpeed, deadRotationSpeed, minSpawnDistance, maxSpawnDistance, minSpawnHeight, maxSpawnHeight) {
		super(game, game.contexts.enemies, size, size, x, y);

		this.speed = speed * -1;
		this.deadSpeed = deadSpeed * -1;
		this.fallingSpeed = fallingSpeed;
		this.deadRotationSpeed = deadRotationSpeed;
		this.minSpawnDistance = minSpawnDistance;
		this.maxSpawnDistance = maxSpawnDistance;
		this.minSpawnHeight = minSpawnHeight;
		this.maxSpawnHeight = maxSpawnHeight;

		this.dx = this.speed;
		this.dy = 0;

		this.dead = false;
		this.angle = 0;

		if (!game.isServer) {
			this.deadImage = this.game.images.bat.dead;
			this.flyingSprite = new Sprite(this.game.images.bat.flying, 1, true);

			this.image = this.flyingSprite.move();
		}
	}

	/**
	 * Returns the bat state
	 * @returns {Object}
	 */
	get state() {
		return {
			...super.state,
			dead: this.dead,
			angle: this.angle
		};
	}

	/**
	 * Sets the bat state
	 * @param {Object} state
	 */
	set state(state) {
		super.state = state;

		this.dead = state.dead;
		this.angle = state.angle;
	}

	/**
	 * Makes the bat die
	 */
	die() {
		this.dead = true;
		this.dx = this.deadSpeed;
		this.dy = this.fallingSpeed;
	}

	/**
	 * Moves the bat
	 */
	move() {
		const isOutOfScreen = this.right < 0 || this.top > this.canvas.height;

		if (this.game.isServer && isOutOfScreen) {
			this.reset();
		}

		super.move();
	}

	/**
	 * Resets the bat
	 */
	reset() {
		this.dead = false;
		this.angle = 0;
		this.x = this.canvas.width + _.random(this.minSpawnDistance, this.maxSpawnDistance);
		this.y = _.random(this.minSpawnHeight, this.maxSpawnHeight);
		this.dy = 0;
		this.dx = this.speed;
	}

	/**
	 * Draws the bat
	 */
	draw() {
		//update the image with the correct sprite image
		this.updateSprite();

		Utils.drawRotatedImage(this.context, this.image, this.angle, this.x, this.y, this.width, this.height);
	}

	/**
	 * Updates the image property with the correct sprite image
	 */
	updateSprite() {
		if (this.dead) {
			this.image = this.deadImage;
			this.rotate();
		} else {
			this.image = this.flyingSprite.move();
		}
	}

	/**
	 * Changes the image rotation angle
	 */
	rotate() {
		this.angle = this.angle - this.deadRotationSpeed;
	}
}

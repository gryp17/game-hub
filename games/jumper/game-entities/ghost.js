import _ from 'lodash';
import Entity from '../../common/entity';
import Sprite from '../../common/sprite';
import Utils from '../../common/utils';

/**
 * Ghost class
 */
export default class Ghost extends Entity {
	/**
	 * Creates a new ghost instance
	 * @param {Object} game
	 * @param {Number} size
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} speed
	 * @param {Number} deadSpeed
	 * @param {Number} fallingSpeed
	 * @param {Number} deadRotationSpeed
	 * @param {Number} deadFadeSpeed
	 * @param {Number} deadShrinkSpeed
	 * @param {Number} minSpawnDistance
	 * @param {Number} maxSpawnDistance
	 * @param {Number} minSpawnHeight
	 * @param {Number} maxSpawnHeight
	 * @param {Number} minFloatDistance
	 * @param {Number} maxFloatDistance
	 * @param {Number} floatSpeed
	 */
	constructor(game, size, x, y, speed, deadSpeed, fallingSpeed, deadRotationSpeed, deadFadeSpeed, deadShrinkSpeed, minSpawnDistance, maxSpawnDistance, minSpawnHeight, maxSpawnHeight, minFloatDistance, maxFloatDistance, floatSpeed) {
		super(game, game.contexts.enemies, size, size, x, y);

		this.defaultSize = size;
		this.speed = speed * -1;

		//dead animation parameters
		this.deadSpeed = deadSpeed * -1;
		this.fallingSpeed = fallingSpeed * -1;
		this.deadRotationSpeed = deadRotationSpeed;
		this.deadFadeSpeed = deadFadeSpeed;
		this.deadShrinkSpeed = deadShrinkSpeed;

		this.minSpawnDistance = minSpawnDistance;
		this.maxSpawnDistance = maxSpawnDistance;
		this.minSpawnHeight = minSpawnHeight;
		this.maxSpawnHeight = maxSpawnHeight;

		//float parameters
		this.initialPosition = this.y;
		this.minFloatDistance = minFloatDistance;
		this.maxFloatDistance = maxFloatDistance;
		this.floatDistance = 0;
		this.floatSpeed = floatSpeed;

		this.minSize = this.defaultSize / 5;

		this.dx = this.speed;
		this.dy = this.floatSpeed;

		this.dead = false;
		this.alpha = 1;
		this.angle = 0;

		if (!game.isServer) {
			this.flyingSprite = new Sprite(this.game.images.ghost.flying, 2, true);
			this.image = this.flyingSprite.move();
		}

		if (this.game.isServer) {
			this.randomizeFloatParameters();
		}
	}

	/**
	 * Returns the ghost state
	 * @returns {Object}
	 */
	get state() {
		return {
			...super.state,
			dead: this.dead,
			alpha: this.alpha,
			angle: this.angle
		};
	}

	/**
	 * Sets the ghost state
	 * @param {Object} state
	 */
	set state(state) {
		super.state = state;

		this.dead = state.dead;
		this.alpha = state.alpha;
		this.angle = state.angle;
	}

	/**
	 * Randomizes the float parameters
	 */
	randomizeFloatParameters() {
		this.floatDistance = _.random(this.minFloatDistance, this.maxFloatDistance);
	}

	/**
	 * Makes the ghost die
	 */
	die() {
		this.dead = true;
		this.dx = this.deadSpeed;
		this.dy = this.fallingSpeed;
	}

	/**
	 * Makes the ghost move
	 */
	move() {
		const isOutOfScreen = this.right < 0 || this.top < 0;

		if (this.game.isServer && isOutOfScreen) {
			this.reset();
		}

		//apply the dead effects
		if (this.dead) {
			this.fade();
			this.rotate();
			this.shrink();
		} else {
			this.float();
		}

		super.move();
	}

	/**
	 * Resets the ghost
	 */
	reset() {
		this.dead = false;
		this.width = this.defaultSize;
		this.height = this.defaultSize;
		this.angle = 0;
		this.alpha = 1;
		this.x = this.canvas.width + _.random(this.minSpawnDistance, this.maxSpawnDistance);
		this.y = _.random(this.minSpawnHeight, this.maxSpawnHeight);
		this.dy = this.floatSpeed;
		this.dx = this.speed;

		this.initialPosition = this.y;
		this.randomizeFloatParameters();
	}

	/**
	 * Draws the ghost
	 */
	draw() {
		//update the image with the correct sprite image
		this.updateSprite();

		this.context.save();
		this.context.globalAlpha = this.alpha;
		Utils.drawRotatedImage(this.context, this.image, this.angle, this.x, this.y, this.width, this.height);
		this.context.restore();
	}

	/**
	 * Updates the image property with the correct sprite image
	 */
	updateSprite() {
		this.image = this.flyingSprite.move();
	}

	/**
	 * Slowly reduces the image alpha
	 */
	fade() {
		if (this.alpha > 0) {
			this.alpha = (this.alpha - this.deadFadeSpeed).toFixed(2);
		}
	}

	/**
	 * Changes the image rotation angle
	 */
	rotate() {
		this.angle = this.angle - this.deadRotationSpeed;
	}

	/**
	 * Shrinks the image size
	 */
	shrink() {
		if (this.width > this.minSize) {
			this.width = this.width - this.deadShrinkSpeed;
			this.height = this.height - this.deadShrinkSpeed;
		}
	}

	/**
	 * Makes the ghost fly up and down
	 */
	float() {
		if (this.dy > 0 && this.y >= this.initialPosition + this.floatDistance) {
			this.dy = this.dy * -1;
		} else if (this.dy < 0 && this.y <= this.initialPosition) {
			this.dy = this.dy * -1;
		}
	}
}

import _ from 'lodash';
import Entity from '../../common/entity';

/**
 * Platform class
 */
export default class Platform extends Entity {
	/**
	 * Creates a platform instance
	 * @param {Object} game
	 * @param {String} type
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Object} sizes
	 * @param {Number} minDistance
	 * @param {Number} maxDistance
	 * @param {Number} minHeight
	 * @param {Number} maxHeight
	 * @param {Number} chanceToFloat
	 * @param {Number} floatSpeed
	 * @param {Number} minFloatDistance
	 * @param {Number} maxFloatDistance
	 */
	constructor(game, type, x, y, sizes, minDistance, maxDistance, minHeight, maxHeight, chanceToFloat, floatSpeed, minFloatDistance, maxFloatDistance) {
		super(game, game.contexts.background, sizes[type].width, sizes[type].height, x, y);

		this.type = type;

		this.minDistance = minDistance;
		this.maxDistance = maxDistance;
		this.minHeight = minHeight;
		this.maxHeight = maxHeight;

		//floating related properties
		this.floating = false;
		this.startingPosition = this.center.y;
		this.chanceToFloat = chanceToFloat;
		this.floatSpeed = floatSpeed;
		this.minFloatDistance = minFloatDistance;
		this.maxFloatDistance = maxFloatDistance;

		this.dx = this.game.gameSpeed * -1;
		this.dy = 0;

		if (!game.isServer) {
			if (type === 'large') {
				//pick one of the "large" image variations
				this.image = _.sample(game.images.platform[type]);
			} else {
				this.image = game.images.platform[type];
			}
		}
	}

	/**
	 * Returns the platform state
	 * @returns {Object}
	 */
	get state() {
		return {
			...super.state,
			floating: this.floating
		};
	}

	/**
	 * Sets the platform state
	 * @param {Object} state
	 */
	set state(state) {
		super.state = state;

		this.floating = state.floating;
	}

	/**
	 * Resets the platform poisiton by using the last platform as a reference
	 */
	reset() {
		const sortedPlatforms = [...this.game.platforms].sort((a, b) => {
			return a.right - b.right;
		});

		const lastPlatform = _.last(sortedPlatforms);

		this.x = lastPlatform.right + _.random(this.minDistance, this.maxDistance);
		this.y = _.random(this.minHeight, this.maxHeight);
		this.startingPosition = this.center.y;

		this.randomizeFloatParameters();
	}

	/**
	 * Resets and randomizes the float parameters
	 */
	randomizeFloatParameters() {
		this.dy = 0;
		this.floating = _.random(0, 100) <= this.chanceToFloat;

		if (this.floating) {
			this.dy = _.random(this.floatSpeed * -1, this.floatSpeed, true);
			this.floatDistance = _.random(this.minFloatDistance, this.maxFloatDistance);
		}
	}

	/**
	 * Moves the platform
	 */
	move() {
		const isOutOfScreen = this.right < 0;

		//sync the platform speed with the updated game speed (maybe this should be done using the set state logic once the server is implemented)
		this.dx = this.game.gameSpeed * -1;

		//reset the position once the platform is outside of the viewpoer
		if (this.game.isServer && isOutOfScreen) {
			this.reset();
		}

		if (this.floating) {
			this.float();
		}

		super.move();
	}

	/**
	 * Makes the platform move up or down
	 */
	float() {
		const difference = Math.abs(this.center.y - this.startingPosition);

		//reverse the direction once the platform has moved enough distance
		if (difference >= this.floatDistance) {
			this.dy = this.dy * -1;
		}
	}

	/**
	 * Draws the background
	 */
	draw() {
		this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

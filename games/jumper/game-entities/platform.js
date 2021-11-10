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
	 */
	constructor(game, type, x, y) {
		const sizeMap = {
			large: {
				width: 248,
				height: 57
			},
			medium: {
				width: 140,
				height: 55
			},
			small: {
				width: 96,
				height: 53
			}
		};

		super(game, game.contexts.background, sizeMap[type].width, sizeMap[type].height, x, y);

		this.dx = -0.6;
		this.dy = 0;

		this.type = type;

		this.floating = false;
		this.startingPosition = this.center.y;

		if (!game.isServer) {
			if (type === 'large') {
				//pick one of the "large" image variations
				this.image = _.sample(game.images.platform[type]);
			} else {
				this.image = game.images.platform[type];
			}
		}

		// TODO: move this to the game object or something
		setInterval(() => {
			this.dx = this.dx - 0.1;
		}, 3000);
	}

	/**
	 * Sets the x value
	 * @param {Number} value
	 */
	set x(value) {
		this._x = value;
	}

	/**
	 * Returns the x value
	 * @returns {Number}
	 */
	get x() {
		return this._x;
	}

	/**
	 * Sets the y value
	 * @param {Number} value
	 */
	set y(value) {
		this._y = value;
	}

	/**
	 * Returns the y value
	 * @returns {Number}
	 */
	get y() {
		return this._y;
	}

	/**
	 * Sets the dx value
	 * @param {Number} value
	 */
	set dx(value) {
		this._dx = value;
	}

	/**
	 * Returns the dx value
	 * @returns {Number}
	 */
	get dx() {
		return this._dx;
	}

	/**
	 * Sets the dy value
	 * @param {Number} value
	 */
	set dy(value) {
		this._dy = value;
	}

	/**
	 * Returns the dy value
	 * @returns {Number}
	 */
	get dy() {
		return this._dy;
	}

	/**
	 * Resets the platform poisiton by using the last platform as a reference
	 */
	reset() {
		//TODO: move this to a config or something
		const minHorizontalDifference = 25;
		const maxHorizontalDifference = 200;
		const minY = 500;
		const maxY = 650;

		const sortedPlatforms = [...this.game.platforms].sort((a, b) => {
			return a.right - b.right;
		});

		const lastPlatform = _.last(sortedPlatforms);

		this.x = lastPlatform.right + _.random(minHorizontalDifference, maxHorizontalDifference);
		this.y = _.random(minY, maxY);
		this.startingPosition = this.center.y;

		this.randomizeFloatParameters();
	}

	/**
	 * Resets and randomizes the float parameters
	 */
	randomizeFloatParameters() {
		this.dy = 0;
		this.floating = _.sample([true, false]);

		if (this.floating) {
			this.dy = _.random(-1, 1, true);
			this.floatDistance = _.random(30, 80);
		}
	}

	/**
	 * Moves the platform
	 */
	move() {
		//reset the position once the platform is outside of the viewpoer
		if (this.right < 0) {
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

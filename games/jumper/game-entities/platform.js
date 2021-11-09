import _ from 'lodash';
import Entity from '../../common/entity';

/**
 * Platform class
 */
export default class Platform extends Entity {
	/**
	 * Creates a platform instance
	 * @param {Object} game
	 * @param {String} type,
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

		this.type = type;

		if (!game.isServer) {
			if (type === 'large') {
				//pick one of the "large" image variations
				this.image = _.sample(game.images.platform[type]);
			} else {
				this.image = game.images.platform[type];
			}
		}

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
	}

	/**
	 * Moves the platform
	 */
	move() {
		//reset the position once the platform is outside of the viewpoer
		if (this.right < 0) {
			this.reset();
		}

		super.move();
	}

	/**
	 * Draws the background
	 */
	draw() {
		this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

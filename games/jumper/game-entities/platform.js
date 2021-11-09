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

		super(game, game.contexts.game, sizeMap[type].width, sizeMap[type].height, x, y);

		this.type = type;

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

	move() {
		//move slightly faster than the background speed
		this.dx = this.game.background.dx * 1.5;

		super.move();
	}

	/**
	 * Draws the background
	 */
	draw() {
		this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

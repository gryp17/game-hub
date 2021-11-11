import Entity from '../../common/entity';

/**
 * SpiderNet class
 */
export default class SpiderNet extends Entity {
	/**
	 * Creates a new spider net instance
	 * @param {Object} game
	 * @param {Object} source
	 */
	constructor(game, source) {
		super(game, game.contexts.enemies);

		this.source = source;

		this.width = 1;
		this.height = this.source.center.y;

		this.x = this.source.center.x;
		this.y = 0;

		if (!game.isServer) {
			this.image = game.images.spiderNet;
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

	/**
	 * Moves the spider net
	 */
	move() {
		this.height = this.source.center.y;
		this.x = this.source.center.x;

		super.move();
	}

	/**
	 * Draws the spider net
	 */
	draw() {
		this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

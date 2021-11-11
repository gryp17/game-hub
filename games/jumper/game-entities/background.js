import Entity from '../../common/entity';

/**
 * Background class
 */
export default class Background extends Entity {
	/**
	 * Creates a background instance
	 * @param {Object} game
	 * @param {String} selectedBackground
	 */
	constructor(game, selectedBackground) {
		super(game, game.contexts.background);

		//TODO: move this to the config
		this.dx = -0.5;

		this.selectedBackground = selectedBackground;

		if (!game.isServer) {
			this.image = game.images.background[selectedBackground];
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
	 * Moves the background
	 */
	move() {
		super.move();

		//reset the background horizontal position and start over again
		if (this.x < (this.image.width / 2) * -1) {
			this.x = 0;
		}
	}

	/**
	 * Draws the background
	 */
	draw() {
		this.context.drawImage(this.image, this.x, this.y, this.image.width, this.canvas.height);
	}
}

import Utils from './utils';

/**
 * An abstract Entity class that contains all the common entity logic
 */
export default class Entity {
	/**
	 * Creates a new Entity instance
	 * @param {Object} game
	 * @param {Object} canvas
	 */
	constructor(game, context, width = 0, height = 0, x = 0, y = 0, dx = 0, dy = 0) {
		if (this.constructor === Entity) {
			throw new Error('Abstract class "Entity" can not be instantiated');
		}

		this.game = game;
		this.context = context.context;
		this.canvas = context.canvas;

		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
	}

	/**
	 * Calculates the top, right, bottom and left coordinates of the object
	 * @returns {Object}
	 */
	get position() {
		return Utils.calculatePosition(this);
	}

	/**
	 * Returns the left position of the object
	 * @returns {Number}
	 */
	get left() {
		return this.position.left;
	}

	/**
	 * Sets the left position of the object
	 * @param {Number} value
	 */
	set left(value) {
		this.x = value;
	}

	/**
	 * Returns the right position of the object
	 * @returns {Number}
	 */
	get right() {
		return this.position.right;
	}

	/**
	 * Sets the right position of the object
	 * @param {Number} value
	 */
	set right(value) {
		this.x = value - this.width;
	}

	/**
	 * Returns the top position of the object
	 * @returns {Number}
	 */
	get top() {
		return this.position.top;
	}

	/**
	 * Sets the top position of the object
	 * @param {Number} value
	 */
	set top(value) {
		this.y = value;
	}

	/**
	 * Returns the bottom position of the object
	 * @returns {Number}
	 */
	get bottom() {
		return this.position.bottom;
	}

	/**
	 * Sets the bottom position of the object
	 * @param {Number} value
	 */
	set bottom(value) {
		this.y = value - this.height;
	}

	/**
	 * Returns the horizontal and vertical center points of the object
	 * @returns {Object}
	 */
	get center() {
		return {
			x: this.x + (this.width / 2),
			y: this.y + (this.height / 2)
		};
	}

	/**
	 * Returns the object hitbox
	 * @returns {Object}
	 */
	get hitbox() {
		return {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height
		};
	}

	/**
	 * Returns the object state
	 * @returns {Object}
	 */
	get state() {
		return {
			x: this.x,
			y: this.y,
			dx: this.dx,
			dy: this.dy
		};
	}

	/**
	 * Sets the object state
	 * @param {Object} state
	 */
	set state(state) {
		this.x = state.x;
		this.y = state.y;
		this.dx = state.dx;
		this.dy = state.dy;
	}

	/**
	 * Moves the object
	 */
	move() {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
	}

	/**
	 * Draws the object
	 */
	draw() {
		throw new Error('Method "draw()" must be implemented.');
	}

	/**
	 * Moves and draws the object
	 */
	moveAndDraw() {
		this.move();
		this.draw();
	}

	/**
	 * Processes the inputs state and moves the object if necessary
	 * @param {Object} inputs
	 */
	processInputs(inputs) {
		throw new Error('Method "processInputs()" must be implemented.');
	}
}

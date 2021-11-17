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

		//private properties that should only be accessed/modified using the getters
		this._width = this.roundValue(width);
		this._height = this.roundValue(height);

		this._x = this.roundValue(x);
		this._y = this.roundValue(y);
		this._dx = this.roundValue(dx);
		this._dy = this.roundValue(dy);
	}

	/**
	 * Returns the entity class name
	 */
	get className() {
		return this.constructor.name;
	}

	/**
	 * Sets the width value after rounding it
	 * @param {Number} value
	 */
	set width(value) {
		this._width = this.roundValue(value);
	}

	/**
	 * Returns the width value
	 * @returns {Number}
	 */
	get width() {
		return this._width;
	}

	/**
	 * Sets the height value after rounding it
	 * @param {Number} value
	 */
	set height(value) {
		this._height = this.roundValue(value);
	}

	/**
	 * Returns the height value
	 * @returns {Number}
	 */
	get height() {
		return this._height;
	}

	/**
	 * Sets the x value after rounding it
	 * @param {Number} value
	 */
	set x(value) {
		this._x = this.roundValue(value);
	}

	/**
	 * Returns the x value
	 * @returns {Number}
	 */
	get x() {
		return this._x;
	}

	/**
	 * Sets the y value after rounding it
	 * @param {Number} value
	 */
	set y(value) {
		this._y = this.roundValue(value);
	}

	/**
	 * Returns the y value
	 * @returns {Number}
	 */
	get y() {
		return this._y;
	}

	/**
	 * Sets the dx value after rounding it
	 * @param {Number} value
	 */
	set dx(value) {
		this._dx = this.roundValue(value);
	}

	/**
	 * Returns the dx value
	 * @returns {Number}
	 */
	get dx() {
		return this._dx;
	}

	/**
	 * Sets the dy value after rounding it
	 * @param {Number} value
	 */
	set dy(value) {
		this._dy = this.roundValue(value);
	}

	/**
	 * Returns the dy value
	 * @returns {Number}
	 */
	get dy() {
		return this._dy;
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
			dy: this.dy,
			width: this.width,
			height: this.height
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
		this.width = state.width;
		this.height = state.height;
	}

	/**
	 * Rounds the value to one number after the decimal point
	 * @param {Number} value
	 * @returns {Number}
	 */
	roundValue(value) {
		return parseFloat(value.toFixed(1));
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

	/**
	 * Handles the object collisions
	 */
	handleCollisions() {
		throw new Error('Method "handleCollisions()" must be implemented.');
	}
}

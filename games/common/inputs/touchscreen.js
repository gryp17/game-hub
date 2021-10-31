import InputDevice from './input-device';

/**
 * An abstract touchscreen class that handles all touchscreen inputs.
 * Ideally you only need to override the "getInputs()" method
 */
export default class Touchscreen extends InputDevice {
	/**
	 * Creates a new Touchscreen instance
	 * @param {Object} controls
	 * @param {Object} canvas
	 */
	constructor(controls, canvas) {
		super(controls, canvas);

		this.mousedown = false;
		this.touchPosition;
	}

	/**
	 * Returns all input statuses
	 * @returns {Object}
	 */
	getInputs() {
		throw new Error('Method "getInputs()" must be implemented.');
	}

	/**
	 *  Registers the touchscreen event listeners
	 */
	listen() {
		//touchstart
		this.addEventListener('touchstart', this.onTouchStart);

		//touchmove
		this.addEventListener('touchmove', this.onTouchMove);

		//mousedown
		this.addEventListener('mousedown', this.onMouseDown);

		//mouseup
		this.addEventListener('mouseup', this.onMouseUp);

		//mousemove
		this.addEventListener('mousemove', this.onMouseMove);
	}

	/**
	 * Calculates the relative (game) touch position using the absolute (client/screen) one by using the game width/height and the actual/client canvas width/height
	 * This is needed because the game has a fixed width/height (1000/768) while the actual browser page size might be different
	 * @param {Number} touchX
	 * @param {Number} touchY
	 * @returns {Number}
	 */
	calculateTouchPosition(touchX, touchY) {
		const gameSize = {
			width: this.canvas.attr('width'),
			height: this.canvas.attr('height')
		};

		const clientSize = {
			width: this.body.innerWidth(),
			height: this.body.innerHeight()
		};

		//figure out where is the point/percentage where the touch event has occured on the screen and calculate it's game position
		const percentageX = (touchX / clientSize.width) * 100;
		const percentageY = (touchY / clientSize.height) * 100;
		const relativeTouchX = (percentageX * gameSize.width) / 100;
		const relativeTouchY = (percentageY * gameSize.height) / 100;

		return {
			x: relativeTouchX,
			y: relativeTouchY
		};
	}

	/**
	 * Touchstart event handler
	 * @param {Object} e
	 */
	onTouchStart(e) {
		e.preventDefault();
		e.stopPropagation();
		this.touchPosition = this.calculateTouchPosition(e.touches[0].clientX, e.touches[0].clientY);
	}

	/**
	 * Touchmove event handler
	 * @param {Object} e
	 */
	onTouchMove(e) {
		e.preventDefault();
		e.stopPropagation();
		this.touchPosition = this.calculateTouchPosition(e.touches[0].clientX, e.touches[0].clientY);
	}

	/**
	 * Mousedown event handler
	 * @param {Object} e
	 */
	onMouseDown(e) {
		this.mousedown = true;
		this.touchPosition = this.calculateTouchPosition(e.clientX, e.clientY);
	}

	/**
	 * Mouseup event handler
	 * @param {Object} e
	 */
	onMouseUp(e) {
		this.mousedown = false;
		this.touchPosition = this.calculateTouchPosition(e.clientX, e.clientY);
	}

	/**
	 * Mousemove event handler
	 * @param {Object} e
	 */
	onMouseMove(e) {
		if (this.mousedown) {
			this.touchPosition = this.calculateTouchPosition(e.clientX, e.clientY);
		}
	}
}

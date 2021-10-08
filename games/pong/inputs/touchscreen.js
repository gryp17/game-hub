import InputDevice from './input-device';

/**
 * Touchscreen class that handles all touchscreen inputs
 */
export default class Touchscreen extends InputDevice {
	/**
	 * Creates a new Touchscreen instance
	 * @param {Object} inputs
	 * @param {Object} canvas
	 */
	constructor(inputs, canvas) {
		super(inputs, canvas);

		this.mousedown = false;
		this.touchPosition;
	}

	/**
	 * Returns all input statuses
	 * @returns {Object}
	 */
	getInputs(paddle) {
		const result = {};

		if (this.touchPosition) {
			//use the paddle and touch positions to figure out when to stop moving up or down
			const paddlePosition = (paddle.y + (paddle.height / 2));
			const difference = Math.abs(this.touchPosition - paddlePosition);

			//target reached
			if (difference < 20) {
				this.inputs.down.status = false;
				this.inputs.up.status = false;
				this.touchPosition = null;
			} else if (this.touchPosition > paddlePosition) {
				//go down
				this.inputs.down.status = true;
				this.inputs.up.status = false;
			} else {
				//go up
				this.inputs.down.status = false;
				this.inputs.up.status = true;
			}
		}

		_.forOwn(this.inputs, (data, key) => {
			result[key] = data.status || false;
		});

		return result;
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
	 * Calculates the relative (game) touch position using the absolute (client/screen) one by using the game height and the actual/client canvas height
	 * This is needed because the game has a fixed width/height (1000/768) while the actual browser page size might be different
	 * @param {Number} touchY
	 * @returns {Number}
	 */
	calculateTouchPosition(touchY) {
		const gameHeight = this.canvas.attr('height');
		const clientHeight = this.canvas.innerHeight();

		//figure out where is the point/percentage where the touch event has occured on the screen and calculate it's game position
		const percentage = (touchY / clientHeight) * 100;
		const relativeTouchY = (percentage * gameHeight) / 100;

		return relativeTouchY;
	}

	/**
	 * Touchstart event handler
	 * @param {Object} e
	 */
	onTouchStart(e) {
		e.preventDefault();
		e.stopPropagation();
		this.touchPosition = this.calculateTouchPosition(e.touches[0].clientY);
	}

	/**
	 * Touchmove event handler
	 * @param {Object} e
	 */
	onTouchMove(e) {
		e.preventDefault();
		e.stopPropagation();
		this.touchPosition = this.calculateTouchPosition(e.touches[0].clientY);
	}

	/**
	 * Mousedown event handler
	 * @param {Object} e
	 */
	onMouseDown(e) {
		this.mousedown = true;
		this.touchPosition = e.clientY;
	}

	/**
	 * Mouseup event handler
	 * @param {Object} e
	 */
	onMouseUp(e) {
		this.mousedown = false;
		this.touchPosition = e.clientY;
	}

	/**
	 * Mousemove event handler
	 * @param {Object} e
	 */
	onMouseMove(e) {
		if (this.mousedown) {
			this.touchPosition = e.clientY;
		}
	}
}

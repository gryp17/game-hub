import InputDevice from './input-device';

/**
 * Touchscreen class that handles all touchscreen inputs
 * @param {Object} inputs
 * @param {Object} canvas
 * @returns {Touchscreen}
 */
export default class Touchscreen extends InputDevice {
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
	 * Initializes the touchscreen controls
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
	 * Calculates the relative touch position using the absolute one by using the game height and the actual/client canvas height
	 * @param {Number} touchY
	 * @returns {Number}
	 */
	calculateTouchPosition(touchY) {
		const gameHeight = this.canvas.attr('height');
		const clientHeight = this.canvas.innerHeight();

		const percentage = (touchY / clientHeight) * 100;
		const relativeTouchY = (percentage * gameHeight) / 100;

		return relativeTouchY;
	}

	onTouchStart(e) {
		e.preventDefault();
		e.stopPropagation();
		this.touchPosition = this.calculateTouchPosition(e.touches[0].clientY);
	}

	onTouchMove(e) {
		e.preventDefault();
		e.stopPropagation();
		this.touchPosition = this.calculateTouchPosition(e.touches[0].clientY);
	}

	onMouseDown(e) {
		this.mousedown = true;
		this.touchPosition = e.clientY;
	}

	onMouseUp(e) {
		this.mousedown = false;
		this.touchPosition = e.clientY;
	}

	onMouseMove(e) {
		if (this.mousedown) {
			this.touchPosition = e.clientY;
		}
	}
}

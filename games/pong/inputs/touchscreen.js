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
		this.touchTarget;
	}

	/**
	 * Returns all input statuses
	 * @returns {Object}
	 */
	getInputs(paddle) {
		const result = {};

		if (this.touchTarget) {
			//use the paddle and touch positions to figure out when to stop moving up or down
			const touchY = this.touchTarget;

			const paddlePosition = (paddle.y + (paddle.height / 2));
			const difference = Math.abs(touchY - paddlePosition);

			//target reached
			if (difference < 5) {
				this.inputs.down.status = false;
				this.inputs.up.status = false;
				this.touchTarget = null;
			} else if (touchY > paddlePosition) {
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

	onTouchStart(e) {
		this.touchTarget = e.touches[0].clientY;
	}

	onTouchMove(e) {
		this.touchTarget = e.touches[0].clientY;
	}

	onMouseDown(e) {
		this.mousedown = true;
		this.touchTarget = e.clientY;
	}

	onMouseUp(e) {
		this.mousedown = false;
		this.touchTarget = e.clientY;
	}

	onMouseMove(e) {
		if (this.mousedown) {
			this.touchTarget = e.clientY;
		}
	}
}

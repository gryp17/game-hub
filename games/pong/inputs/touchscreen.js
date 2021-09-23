/**
 * Touchscreen class that handles all touchscreen inputs
 * @param {Object} inputs
 * @returns {Touchscreen}
 */
export default class Touchscreen {
	constructor(inputs) {
		this.inputs = inputs;
		this.mousedown = false;
		this.touchTarget;
	}

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
		$('body').on('touchstart', (e) => {
			this.touchTarget = e.touches[0].clientY;
		});

		//touchmove
		$('body').on('touchmove', (e) => {
			this.touchTarget = e.touches[0].clientY;
		});

		//mousedown
		$('body').on('mousedown', (e) => {
			this.mousedown = true;
			this.touchTarget = e.clientY;
		});

		//mouseup
		$('body').on('mouseup', (e) => {
			this.mousedown = false;
			this.touchTarget = e.clientY;
		});

		//mousemove
		$('body').on('mousemove', (e) => {
			if (this.mousedown) {
				this.touchTarget = e.clientY;
			}
		});
	}
}

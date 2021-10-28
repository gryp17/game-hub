import TouchscreenBase from '../../common/inputs/touchscreen';

/**
 * Touchscreen class that handles all touchscreen inputs
 */
export default class Touchscreen extends TouchscreenBase {
	/**
	 * Returns all input statuses
	 * @returns {Object}
	 */
	getInputs(paddle) {
		//set all inputs to false by default
		_.forOwn(this.controls, (data, key) => {
			this.inputs[key] = false;
		});

		if (this.touchPosition) {
			//use the paddle and touch positions to figure out when to stop moving up or down
			const paddlePosition = paddle.center.y;
			const target = this.touchPosition.y;
			const difference = Math.abs(target - paddlePosition);

			//target reached
			if (difference < 20) {
				this.touchPosition = null;
			} else if (target > paddlePosition) {
				//go down
				this.inputs.down = true;
			} else {
				//go up
				this.inputs.up = true;
			}
		}

		return this.inputs;
	}
}

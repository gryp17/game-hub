import TouchscreenBase from '../../common/inputs/touchscreen';

/**
 * Touchscreen class that handles all touchscreen inputs
 */
export default class Touchscreen extends TouchscreenBase {
	/**
	 * Returns all input statuses
	 * @returns {Object}
	 */
	getInputs(dummy) {
		//set all inputs to false by default
		_.forOwn(this.controls, (data, key) => {
			this.inputs[key] = false;
		});

		if (this.touchPosition) {
			//use the dummy and touch positions to figure out when to stop moving
			const dummyPosition = dummy.center.x;
			const target = this.touchPosition.x;
			const horizontalDifference = Math.abs(target - dummyPosition);
			const isSwipingUp = this.touchPosition.y < (dummy.top - dummy.height);

			//go up
			if (isSwipingUp) {
				this.inputs.up = true;
				this.touchPosition = null;
			} else {
				//horizontal movement target reached
				if (horizontalDifference < 20) {
					this.touchPosition = null;
				} else if (target > dummyPosition) {
					//go right
					this.inputs.right = true;
				} else {
					//go left
					this.inputs.left = true;
				}
			}
		}

		return this.inputs;
	}
}

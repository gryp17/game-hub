import TouchscreenBase from '../../common/inputs/touchscreen';

/**
 * Touchscreen class that handles all touchscreen inputs
 */
export default class Touchscreen extends TouchscreenBase {
	/**
	 * Returns all input statuses
	 * @param {Object} dummy
	 * @param {Object} net
	 * @returns {Object}
	 */
	getInputs(dummy, net) {
		//set all inputs to false by default
		_.forOwn(this.controls, (data, key) => {
			this.inputs[key] = false;
		});

		if (this.touchPosition) {
			//use the dummy and touch positions to figure out when to stop moving
			const dummyPosition = dummy.center.x;
			const netPosition = net.center.x;
			let target = this.touchPosition.x;

			//if the target is beyound the net (unreachable) set it to the net position
			if ((dummyPosition < netPosition && target > netPosition) || (dummyPosition > netPosition && target < netPosition)) {
				target = netPosition;
			}

			const horizontalDifference = Math.abs(target - dummyPosition);
			const differenceOffset = (dummy.width / 2) + (net.width / 2) + 5;
			const isSwipingUp = this.touchPosition.y < (dummy.top - dummy.height / 2);

			//go up
			if (isSwipingUp) {
				this.inputs.up = true;
				this.touchPosition = null;
			} else {
				//horizontal movement target reached
				if (horizontalDifference < differenceOffset) {
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

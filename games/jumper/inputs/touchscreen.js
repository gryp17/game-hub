import TouchscreenBase from '../../common/inputs/touchscreen';

/**
 * Touchscreen class that handles all touchscreen inputs
 */
export default class Touchscreen extends TouchscreenBase {
	/**
	 * Returns all input statuses
	 * @returns {Object}
	 */
	getInputs() {
		const noInputs = this.touchPositions.length === 0;
		const isMultitouch = this.touchPositions.length > 1;

		//set all inputs to false by default
		_.forOwn(this.controls, (data, key) => {
			this.inputs[key] = false;
		});

		if (noInputs) {
			return this.inputs;
		}

		//up (multitouch)
		if (isMultitouch) {
			this.inputs.up = true;
		}

		const canvasCenter = this.canvas.attr('width') / 2;
		const target = this.touchPositions[0];

		//left
		if (target.x < canvasCenter) {
			this.inputs.left = true;
		}

		//right
		if (target.x > canvasCenter) {
			this.inputs.right = true;
		}

		return this.inputs;
	}
}

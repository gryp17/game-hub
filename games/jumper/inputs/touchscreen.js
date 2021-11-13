import TouchscreenBase from '../../common/inputs/touchscreen';

/**
 * Touchscreen class that handles all touchscreen inputs
 */
export default class Touchscreen extends TouchscreenBase {
	constructor(controls, canvas) {
		super(controls, canvas);

		this.touchPositions = [];
	}

	/**
	 *  Registers the touchscreen event listeners
	 */
	listen() {
		super.listen();

		//touchend
		this.addEventListener('touchend', this.onTouchEnd);
	}

	/**
	 * Returns all input statuses
	 * @returns {Object}
	 */
	getInputs() {
		//set all inputs to false by default
		_.forOwn(this.controls, (data, key) => {
			this.inputs[key] = false;
		});

		if (this.touchPositions.length === 0) {
			return this.inputs;
		}

		//up (multitouch)
		if (this.touchPositions.length > 1) {
			this.inputs.up = true;
		}

		const canvasCenter = this.canvas.attr('width') / 2;
		// const canvasMiddle = this.canvas.attr('height') / 2;
		const target = this.touchPositions[0];

		//left
		if (target.x < canvasCenter) {
			this.inputs.left = true;
		}

		//right
		if (target.x > canvasCenter) {
			this.inputs.right = true;
		}

		//up
		/*
		THIS WORKS MORE OR LESS
		if (target.y < canvasMiddle) {
			this.inputs.up = true;
		}
		*/

		return this.inputs;
	}

	/**
	 * Touchstart event handler
	 * @param {Object} e
	 */
	onTouchStart(e) {
		e.preventDefault();
		e.stopPropagation();

		this.touchPositions = [];

		_.forOwn(e.touches, (touch) => {
			const touchPosition = this.calculateTouchPosition(touch.clientX, touch.clientY);
			this.touchPositions.push(touchPosition);
		});
	}

	/**
	 * Touchend event handler
	 * @param {Object} e
	 */
	onTouchEnd(e) {
		e.preventDefault();
		e.stopPropagation();

		this.touchPositions = [];

		_.forOwn(e.touches, (touch) => {
			const touchPosition = this.calculateTouchPosition(touch.clientX, touch.clientY);
			this.touchPositions.push(touchPosition);
		});
	}

	/**
	 * Touchmove event handler
	 * @param {Object} e
	 */
	onTouchMove(e) {
		e.preventDefault();
		e.stopPropagation();

		this.touchPositions = [];

		_.forOwn(e.touches, (touch) => {
			const touchPosition = this.calculateTouchPosition(touch.clientX, touch.clientY);
			this.touchPositions.push(touchPosition);
		});
	}
}

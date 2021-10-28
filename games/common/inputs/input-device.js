/**
 * An abstract InputDevice class that handles the player's inputs
 */
export default class InputDevice {
	/**
	 * Creates a new InputDevice instance
	 * @param {Object} controlls
	 * @param {Object} canvas
	 */
	constructor(controls, canvas) {
		if (this.constructor === InputDevice) {
			throw new Error('Abstract class "InputDevice" can not be instantiated');
		}

		this.controls = controls;
		this.inputs = {};

		//set all inputs to false by default
		_.forOwn(this.controls, (data, key) => {
			this.inputs[key] = data.status || false;
		});

		this.canvas = $(canvas);
		this.listeners = {};
	}

	/**
	 * Adds an event listener to the canvas
	 * @param {String} event
	 * @param {Function} listener
	 */
	addEventListener(event, listener) {
		const boundListener = listener.bind(this);

		this.listeners[event] = boundListener;
		this.canvas.on(event, boundListener);
	}

	/**
	 * Removes an event listener
	 * @param {String} event
	 * @param {Function} listener
	 */
	removeEventListener(event, listener) {
		this.canvas.off(event, listener);
	}

	/**
	 * Removes all previously registered event listeners from the canvas
	 */
	removeAllEventListeners() {
		this.canvas.off(this.listeners);
	}

	/**
	 * Returns all input statuses
	 * @returns {Object}
	 */
	getInputs() {
		return this.inputs;
	}

	/**
	 * Registers the event listeners and starts listening
	 */
	listen() {
		throw new Error('Method "listen()" must be implemented.');
	}
}

/**
 * An abstract InputDevice class that handles the player's inputs
 */
export default class InputDevice {
	/**
	 * Creates a new InputDevice instance
	 * @param {Object} inputs
	 * @param {Object} canvas
	 */
	constructor(inputs, canvas) {
		if (this.constructor === InputDevice) {
			throw new Error('Abstract class "InputDevice" can not be instantiated');
		}

		this.inputs = inputs;
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
		const result = {};

		_.forOwn(this.inputs, (data, key) => {
			result[key] = data.status || false;
		});

		return result;
	}

	/**
	 * Registers the event listeners and starts listening
	 */
	listen() {
		throw new Error('Method "listen()" must be implemented.');
	}
}

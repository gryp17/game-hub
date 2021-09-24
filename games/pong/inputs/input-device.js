export default class InputDevice {
	constructor(inputs, canvas) {
		if (this.constructor === InputDevice) {
			throw new Error('Abstract class "InputDevice" can not be instantiated');
		}

		this.inputs = inputs;
		this.canvas = $(canvas);
		this.listeners = {};
	}

	addEventListener(event, listener) {
		const boundListener = listener.bind(this);

		this.listeners[event] = boundListener;
		this.canvas.on(event, boundListener);
	}

	removeEventListener(event, listener) {
		this.canvas.off(event, listener);
	}

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

	listen() {
		throw new Error('Method "listen()" must be implemented.');
	}
}

export default class InputDevice {
	constructor(inputs) {
		if (this.constructor === InputDevice) {
			throw new Error('Abstract class "InputDevice" can not be instantiated');
		}

		this.inputs = inputs;
		this.element = $('body');
		this.listeners = {};
	}

	addEventListener(event, listener) {
		const boundListener = listener.bind(this);

		this.listeners[event] = boundListener;
		this.element.on(event, boundListener);
	}

	removeEventListener(event, listener) {
		this.element.off(event, listener);
	}

	removeAllEventListeners() {
		this.element.off(this.listeners);
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

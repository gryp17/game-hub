/**
 * Keyboard class that handles all keyboard inputs
 * @param {Object} inputs
 * @returns {Keyboard}
 */
export default class Keyboard {
	constructor(inputs) {
		this.inputs = inputs;
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
	 * Initializes the keyboard controls
	 */
	listen() {
		//key down
		$('body').keydown((e) => {
			_.forOwn(this.inputs, (data, key) => {
				if (_.includes(data.keys, e.which)) {
					data.status = true;
				}
			});
		});

		//key up
		$('body').keyup((e) => {
			_.forOwn(this.inputs, (data, key) => {
				if (_.includes(data.keys, e.which)) {
					data.status = false;
				}
			});
		});
	}
}

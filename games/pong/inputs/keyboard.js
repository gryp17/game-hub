import InputDevice from './input-device';

/**
 * Keyboard class that handles all keyboard inputs
 */
export default class Keyboard extends InputDevice {
	/**
	 * Creates a new Keyboard instance
	 * @param {Object} inputs
 	 * @param {Object} canvas
	 */
	constructor(inputs, canvas) {
		super(inputs, canvas);
	}

	/**
	 * Registers the keyboard event listeners
	 */
	listen() {
		//key down
		this.addEventListener('keydown', this.onKeyDown);

		//key up
		this.addEventListener('keyup', this.onKeyUp);
	}

	/**
	 * Keydown event handler
	 * @param {Object} e
	 */
	onKeyDown(e) {
		_.forOwn(this.inputs, (data, key) => {
			if (_.includes(data.keys, e.which)) {
				data.status = true;
			}
		});
	}

	/**
	 * Keyup event handler
	 * @param {Object} e
	 */
	onKeyUp(e) {
		_.forOwn(this.inputs, (data, key) => {
			if (_.includes(data.keys, e.which)) {
				data.status = false;
			}
		});
	}
}

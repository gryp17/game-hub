import InputDevice from './input-device';

/**
 * Keyboard class that handles all keyboard inputs
 */
export default class Keyboard extends InputDevice {
	/**
	 * Creates a new Keyboard instance
	 * @param {Object} controls
 	 * @param {Object} canvas
	 */
	constructor(controls, canvas) {
		super(controls, canvas);
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
		_.forOwn(this.controls, (data, key) => {
			if (_.includes(data.keys, e.which)) {
				this.inputs[key] = true;
			}
		});
	}

	/**
	 * Keyup event handler
	 * @param {Object} e
	 */
	onKeyUp(e) {
		_.forOwn(this.controls, (data, key) => {
			if (_.includes(data.keys, e.which)) {
				this.inputs[key] = false;
			}
		});
	}
}

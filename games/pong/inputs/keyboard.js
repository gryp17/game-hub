import InputDevice from './input-device';

/**
 * Keyboard class that handles all keyboard inputs
 * @param {Object} inputs
 * @param {Object} canvas
 * @returns {Keyboard}
 */
export default class Keyboard extends InputDevice {
	constructor(inputs, canvas) {
		super(inputs, canvas);
	}

	/**
	 * Initializes the keyboard controls
	 */
	listen() {
		//key down
		this.addEventListener('keydown', this.onKeyDown);

		//key up
		this.addEventListener('keyup', this.onKeyUp);
	}

	onKeyDown(e) {
		_.forOwn(this.inputs, (data, key) => {
			if (_.includes(data.keys, e.which)) {
				data.status = true;
			}
		});
	}

	onKeyUp(e) {
		_.forOwn(this.inputs, (data, key) => {
			if (_.includes(data.keys, e.which)) {
				data.status = false;
			}
		});
	}
}

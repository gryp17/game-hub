/**
 * Context class that creates a new Context object that contains the canvas and context object for the specified canvas id
 */
export default class Context {
	/**
	 * Creates a new Context instance
	 * @param {String} id
	 */
	constructor(id) {
		this.canvas = document.getElementById(id);
		this.context = this.canvas.getContext('2d');
	}

	/**
	 * Puts focus on the canvas
	 */
	focus() {
		this.canvas.focus();
	}

	/**
	 * Sets the canvas size
	 * @param {Number} width
	 * @param {Number} height
	 */
	setSize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
	}

	/**
	 * Hides the canvas
	 */
	hide() {
		this.canvas.style.display = 'none';
	}

	/**
	 * Shows the canvas
	 */
	show() {
		this.canvas.style.display = 'block';
	}
}

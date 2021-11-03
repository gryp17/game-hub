/**
 * Context class that creates a new Context object that contains the canvas and context object for the specified canvas id
 */
export default class Context {
	/**
	 * Creates a new Context instance
	 * @param {String} id
	 * @param {String} wrapper
	 * @param {Number} width
	 * @param {Number} height
	 */
	constructor(id, wrapper, width, height) {
		//generate a new canvas HTML element and append it to the wrapper element
		this.element = $('<canvas>', {
			id,
			class: 'canvas',
			tabindex: 1
		});

		this.element.attr('width', width);
		this.element.attr('height', height);

		$(wrapper).append(this.element);

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

/**
 * Context class that creates a new Context object that contains the canvas and context object for the specified canvas id
 * @param {String} id
 * @returns {Context}
 */
export default class Context {
	constructor(id) {
		this.canvas = document.getElementById(id);
		this.context = this.canvas.getContext('2d');
	}

	focus() {
		this.canvas.focus();
	}

	setSize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
	}

	hide() {
		this.canvas.style.display = 'none';
	}

	show() {
		this.canvas.style.display = 'block';
	}
}

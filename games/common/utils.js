/**
 * Utils class containing helper functions
 */
export default class Utils {
	/**
	 * RequestAnim shim layer by Paul Irish
	 * Finds the first API that works to optimize the animation loop,
	 * otherwise defaults to setTimeout().
	 * @returns {Function}
	 */
	static getRequestAnimationFrame() {
		return (function anim() {
			return window.requestAnimationFrame
					|| window.webkitRequestAnimationFrame
					|| window.mozRequestAnimationFrame
					|| window.oRequestAnimationFrame
					|| window.msRequestAnimationFrame
					|| function anim(callback, element) {
						window.setTimeout(callback, 1000);
					};
		}());
	}

	/**
	 * Checks if the two rectangles intersect
	 * @param {Object} objectA
	 * @param {Object} objectB
	 * @returns {Boolean}
	 */
	static intersects(objectA, objectB) {
		let result = false;

		//calculate the positions of both objects
		const a = this.calculatePosition(objectA);
		const b = this.calculatePosition(objectB);

		//calculate the horizontal and vertical overlap
		const horizontalOverlap = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
		const verticalOverlap = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

		if (horizontalOverlap !== 0 && verticalOverlap !== 0) {
			result = true;
		}

		return result;
	}

	/**
	 * Checks if the provided hitboxes collide
	 * @param {Object|Array} hitboxA
	 * @param {Object|Array} hitboxB
	 * @returns {Boolean}
	 */
	static collidesWith(hitboxA, hitboxB) {
		let result = false;
		let a = hitboxA;
		let b = hitboxB;

		//convert both hitboxes to arrays in case they are not arrays (some game objects might have more than 1 hitbox!)
		if (a.constructor !== Array) {
			a = [a];
		}

		if (b.constructor !== Array) {
			b = [b];
		}

		//check if the hitboxes collide
		a.forEach((ha) => {
			b.forEach((hb) => {
				if (this.intersects(ha, hb)) {
					result = true;
				}
			});
		});

		return result;
	}

	/**
	 * Private function that calculates the top, right, bottom and left coordinates of the object
	 * @param {Object} object
	 * @returns {Object}
	 */
	static calculatePosition(object) {
		return {
			left: object.x,
			top: object.y,
			right: object.x + object.width,
			bottom: object.y + object.height
		};
	}
}

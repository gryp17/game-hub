/**
 * Utils class containing helper functions
 */
export default {
	/**
	 * Checks if the two rectangles intersect
	 * @param {Object} objectA
	 * @param {Object} objectB
	 * @returns {Boolean}
	 */
	intersect(objectA, objectB) {
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
	},

	/**
	 * Checks if the provided hitboxes collide
	 * @param {Object|Array} hitboxA
	 * @param {Object|Array} hitboxB
	 * @returns {Boolean}
	 */
	collidesWith(hitboxA, hitboxB) {
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
				if (this.intersect(ha, hb)) {
					result = true;
				}
			});
		});

		return result;
	},

	/**
	 * Private function that calculates the top, right, bottom and left coordinates of the object
	 * @param {Object} object
	 * @returns {Object}
	 */
	calculatePosition(object) {
		return {
			left: object.x,
			top: object.y,
			right: object.x + object.width,
			bottom: object.y + object.height
		};
	}
};

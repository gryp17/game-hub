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
	 * Checks if there is a collision and where exactly the collision between the two objects occurs
	 * Note that the order of the rules and the order of the parameters (objectA, objectB) is important
	 * @param {Object} objectA
	 * @param {Object} objectB
	 * @returns {String} (top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight, inner) or null if there is no collision
	 */
	static getCollisionPoint(objectA, objectB) {
		if (this.collidesWith(objectA.hitbox, objectB.hitbox)) {
			//note that the order of the rules and the order of the parameters (objectA, objectB) is important

			//straight top collision
			if (objectB.center.y < objectA.top && (objectB.center.x >= objectA.left && objectB.center.x <= objectA.right)) {
				return 'top';
			}

			//straight bottom collision
			if (objectB.center.y > objectA.bottom && (objectB.center.x >= objectA.left && objectB.center.x <= objectA.right)) {
				return 'bottom';
			}

			//left top corner collision
			if (objectB.center.y < objectA.top && objectB.center.x < objectA.left) {
				return 'topLeft';
			}

			//right top corner collision
			if (objectB.center.y < objectA.top && objectB.center.x > objectA.left) {
				return 'topRight';
			}

			//left bottom corner collision
			if (objectB.center.y > objectA.bottom && objectB.center.x < objectA.left) {
				return 'bottomLeft';
			}

			//right bottom corner collision
			if (objectB.center.y > objectA.bottom && objectB.center.x > objectA.left) {
				return 'bottomRight';
			}

			//left collision
			if (objectB.center.x < objectA.left && objectB.center.y > objectA.top) {
				return 'left';
			}

			//right collision
			if (objectB.center.x > objectA.right && objectB.center.y > objectA.top) {
				return 'right';
			}

			return 'inner';
		}

		return null;
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

	/**
	 * Draws the image rotated by the specified angle
	 * @param {Object} context
	 * @param {Object} image
	 * @param {Number} angle
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	static drawRotatedImage(context, image, angle, x, y, width, height) {
		context.save();

		//move to the middle of where we want to draw our image
		context.translate(x + width / 2, y + height / 2);

		//rotate around that point, converting our angle from degrees to radians
		context.rotate((angle * Math.PI) / 180);

		//draw it up and to the left by half the width and height of the image
		context.drawImage(image, -(width / 2), -(height / 2), width, height);

		//and restore the co-ords to how they were when we began
		context.restore();
	}

	/**
	 * Draws the image mirrored horizontally
	 * @param {Object} context
	 * @param {Object} image
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	static drawMirroredImage(context, image, x, y, width, height) {
		context.save();

		context.setTransform(
			-1, 0,
			0, 1,
			x + width,
			y
		);

		context.drawImage(image, 0, 0, width, height);
		context.restore();
	}
}

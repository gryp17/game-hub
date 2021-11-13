import Entity from '../../common/entity';

/**
 * Background class
 */
export default class Background extends Entity {
	/**
	 * Creates a background instance
	 * @param {Object} game
	 * @param {Number} speed
	 * @param {String} selectedBackground
	 */
	constructor(game, speed, selectedBackground) {
		super(game, game.contexts.background);

		this.dx = speed * -1;

		this.selectedBackground = selectedBackground;

		if (!game.isServer) {
			this.image = game.images.background[selectedBackground];
		}
	}

	/**
	 * Moves the background
	 */
	move() {
		super.move();

		//reset the background horizontal position and start over again
		if (this.x < (this.image.width / 2) * -1) {
			this.x = 0;
		}
	}

	/**
	 * Draws the background
	 */
	draw() {
		this.context.drawImage(this.image, this.x, this.y, this.image.width, this.canvas.height);
	}
}

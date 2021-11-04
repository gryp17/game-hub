import Entity from '../../common/entity';

/**
 * Background class
 */
export default class Background extends Entity {
	/**
	 * Creates a background instance
	 * @param {Object} game
	 * @param {String} selectedBackground
	 */
	constructor(game, selectedBackground) {
		super(game, game.contexts.background);

		this.selectedBackground = selectedBackground;
		this.ground = this.canvas.height - this.game.groundHeight;

		if (!game.isServer) {
			this.image = game.images.background[selectedBackground];
		}
	}

	/**
	 * Draws the background
	 */
	draw() {
		this.context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
	}
}

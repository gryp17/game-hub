import Entity from '../../common/entity';

/**
 * Net class
 */
export default class Net extends Entity {
	/**
	 * Creates a new net instance
	 * @param {Object} game
	 * @param {Number} height (as percentage of the canvas height)
	 */
	constructor(game, height) {
		super(game, game.contexts.game);

		this.width = this.canvas.width / 70;
		this.height = (this.canvas.height / 100) * height;
		this.x = (this.canvas.width / 2) - (this.width / 2);
		this.y = this.canvas.height - this.height - 2;

		if (!game.isServer) {
			this.image = this.game.images.net;
		}
	}

	/**
	 * Draws the net
	 */
	draw() {
		this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

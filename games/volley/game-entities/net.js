import Entity from '../../common/entity';

/**
 * Net class
 */
export default class Net extends Entity {
	/**
	 * Creates a new net instance
	 * @param {Object} game
	 */
	constructor(game) {
		super(game, game.contexts.game);

		this.width = this.canvas.width / 70;
		this.height = this.canvas.height / 2;
		this.x = (this.canvas.width / 2) - (this.width / 2);
		this.y = this.game.background.ground - this.height + 5;

		this.currentImage = this.game.images.net;
	}

	/**
	 * Draws the net
	 */
	draw() {
		this.context.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
	}
}

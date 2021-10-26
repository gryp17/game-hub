import _ from 'lodash';
import Entity from '../../common/entity';

/**
 * Background class
 */
export default class Background extends Entity {
	/**
	 * Creates a background instance
	 * @param {Object} game
	 */
	constructor(game) {
		super(game, game.contexts.background);

		this.ground = this.canvas.height - this.game.groundHeight;

		if (!game.isServer) {
			//pick a random background
			const randomBackground = _.sample(Object.keys(game.images.background));
			this.image = game.images.background[randomBackground];
		}
	}

	/**
	 * Draws the background
	 */
	draw() {
		this.context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
	}
}

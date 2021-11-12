import Entity from '../../common/entity';

/**
 * SpiderNet class
 */
export default class SpiderNet extends Entity {
	/**
	 * Creates a new spider net instance
	 * @param {Object} game
	 * @param {Object} source
	 */
	constructor(game, source) {
		super(game, game.contexts.enemies);

		this.source = source;

		this.width = 1;
		this.height = this.source.center.y;

		this.x = this.source.center.x;
		this.y = 0;

		if (!game.isServer) {
			this.image = game.images.spiderNet;
		}
	}

	/**
	 * Moves the spider net
	 */
	move() {
		this.height = this.source.center.y;
		this.x = this.source.center.x;

		super.move();
	}

	/**
	 * Draws the spider net
	 */
	draw() {
		this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

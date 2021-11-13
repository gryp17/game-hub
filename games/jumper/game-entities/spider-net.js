import Entity from '../../common/entity';

/**
 * SpiderNet class
 */
export default class SpiderNet extends Entity {
	/**
	 * Creates a new spider net instance
	 * @param {Object} game
	 * @param {Object} spider
	 * @param {Number} width
	 */
	constructor(game, spider, width) {
		super(game, game.contexts.enemies);

		this.spider = spider;

		this.width = width;
		this.height = this.spider.center.y;

		this.x = this.spider.center.x;
		this.y = 0;

		if (!game.isServer) {
			this.image = game.images.spiderNet;
		}
	}

	/**
	 * Moves the spider net
	 */
	move() {
		this.height = this.spider.center.y;
		this.x = this.spider.center.x;

		super.move();
	}

	/**
	 * Draws the spider net
	 */
	draw() {
		this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

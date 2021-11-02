import Entity from '../../common/entity';

/**
 * Shadow class
 */
export default class Shadow extends Entity {
	/**
	 * Creates a new shadow instance
	 * @param {Object} game
	 * @param {Object} source
	 */
	constructor(game, source) {
		super(game, game.contexts.background);

		this.source = source;

		this.defaultHeight = 15;

		this.width = this.source.width;
		this.height = this.defaultHeight;
		this.x = this.source.x;
		this.y = this.game.background.ground - (this.height / 2);

		this.distanceMultiplier = 0.03;

		if (!game.isServer) {
			this.image = game.images.shadow;
		}
	}

	/**
	 * Moves the shadow
	 */
	move() {
		const distanceFromGround = this.game.background.ground - this.source.bottom;
		const sizeIncrease = distanceFromGround * this.distanceMultiplier;

		//increase/reduce the shadow height size
		this.height = this.defaultHeight + sizeIncrease;

		//center the shadow vertically
		this.y = this.game.background.ground - (this.height / 2);

		//increase/reduce the shadow width size
		this.width = this.source.width + sizeIncrease;
		//center the shadow horizontally right under the source
		this.x = this.source.x + (this.source.width - this.width) / 2;
	}

	/**
	 * Draws the shadow
	 */
	draw() {
		this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

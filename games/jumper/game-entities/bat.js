import Entity from '../../common/entity';
import Sprite from '../../common/sprite';

/**
 * Bat class
 */
export default class Bat extends Entity {
	/**
	 * Creates a new bat instance
	 * @param {Object} game
	 */
	constructor(game, x, y) {
		super(game, game.contexts.enemies, 100, 100, x, y);

		//TODO: move this to config
		this.speed = -5;
		this.deadSpeed = -3;
		this.fallingSpeed = 6;

		this.dx = this.speed;
		this.dy = 0;

		this.dead = false;

		if (!game.isServer) {
			this.deadImage = this.game.images.bat.dead;
			this.flyingSprite = new Sprite(this.game.images.bat.flying, 1, true);

			this.image = this.flyingSprite.move();
		}

		setTimeout(() => {
			this.dead = true;
		}, 2600);
	}

	move() {
		if (this.dead) {
			this.dx = this.deadSpeed;
			this.dy = this.fallingSpeed;
		}

		if (this.right < 0) {
			this.reset();
		}

		super.move();
	}

	reset() {
		this.dead = false;
		this.x = this.canvas.width + _.random(50, 200);
		this.y = 200;
		this.dy = 0;
		this.dx = this.speed;
	}

	/**
	 * Draws the dummy
	 */
	draw() {
		//update the image with the correct sprite image
		this.updateSprite();

		this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

	/**
	 * Updates the image property with the correct sprite image
	 */
	updateSprite() {
		if (this.dead) {
			this.image = this.deadImage;
		} else {
			this.image = this.flyingSprite.move();
		}
	}
}

import Entity from '../../common/entity';
import Sprite from '../../common/sprite';
import Utils from '../../common/utils';

/**
 * Bat class
 */
export default class Bat extends Entity {
	/**
	 * Creates a new bat instance
	 * @param {Object} game
	 */
	constructor(game, size, x, y) {
		super(game, game.contexts.enemies, size, size, x, y);

		//TODO: move this to config
		this.speed = -5;
		this.deadSpeed = -3;
		this.fallingSpeed = 6;
		this.deadRotationSpeed = 2;

		this.dx = this.speed;
		this.dy = 0;

		this.dead = false;
		this.angle = 0;

		if (!game.isServer) {
			this.deadImage = this.game.images.bat.dead;
			this.flyingSprite = new Sprite(this.game.images.bat.flying, 1, true);

			this.image = this.flyingSprite.move();
		}
	}

	/**
	 * Makes the bat die
	 */
	die() {
		this.dead = true;
		this.dx = this.deadSpeed;
		this.dy = this.fallingSpeed;
	}

	/**
	 * Moves the bat
	 */
	move() {
		if (this.right < 0) {
			this.reset();
		}

		super.move();
	}

	/**
	 * Resets the bat
	 */
	reset() {
		this.dead = false;
		this.angle = 0;
		this.x = this.canvas.width + _.random(50, 200);
		this.y = 200;
		this.dy = 0;
		this.dx = this.speed;
	}

	/**
	 * Draws the bat
	 */
	draw() {
		//update the image with the correct sprite image
		this.updateSprite();

		Utils.drawRotatedImage(this.context, this.image, this.angle, this.x, this.y, this.width, this.height);
	}

	/**
	 * Updates the image property with the correct sprite image
	 */
	updateSprite() {
		if (this.dead) {
			this.image = this.deadImage;
			this.rotate();
		} else {
			this.image = this.flyingSprite.move();
		}
	}

	/**
	 * Changes the image rotation angle
	 */
	rotate() {
		this.angle = this.angle - this.deadRotationSpeed;
	}
}

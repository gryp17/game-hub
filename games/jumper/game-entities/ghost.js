import Entity from '../../common/entity';
import Sprite from '../../common/sprite';
import Utils from '../../common/utils';

/**
 * Ghost class
 */
export default class Ghost extends Entity {
	/**
	 * Creates a new ghost instance
	 * @param {Object} game
	 */
	constructor(game, size, x, y) {
		super(game, game.contexts.enemies, size, size, x, y);

		//TODO: move this to config
		this.defaultSize = size;
		this.speed = -3;
		this.deadSpeed = -1;
		this.fallingSpeed = -3;
		this.deadRotationSpeed = 15;
		this.deadAlphaSpeed = 0.01;
		this.deadShrinkSpeed = 1;
		this.minSize = this.defaultSize / 5;

		this.dx = this.speed;
		this.dy = 0;

		this.dead = false;
		this.alpha = 1;
		this.angle = 0;

		if (!game.isServer) {
			this.flyingSprite = new Sprite(this.game.images.ghost.flying, 2, true);
			this.image = this.flyingSprite.move();
		}

		setTimeout(() => {
			this.die();
		}, 2600);
	}

	/**
	 * Makes the ghost die
	 */
	die() {
		this.dead = true;
		this.dx = this.deadSpeed;
		this.dy = this.fallingSpeed;
	}

	/**
	 * Makes the ghost move
	 */
	move() {
		if (this.right < 0 || this.top < 0) {
			this.reset();
		}

		super.move();
	}

	/**
	 * Resets the ghost
	 */
	reset() {
		this.dead = false;
		this.width = this.defaultSize;
		this.height = this.defaultSize;
		this.angle = 0;
		this.alpha = 1;
		this.x = this.canvas.width + _.random(50, 200);
		this.y = 320;
		this.dy = 0;
		this.dx = this.speed;
	}

	/**
	 * Draws the ghost
	 */
	draw() {
		//update the image with the correct sprite image
		this.updateSprite();

		this.context.save();
		this.context.globalAlpha = this.alpha;
		Utils.drawRotatedImage(this.context, this.image, this.angle, this.x, this.y, this.width, this.height);
		this.context.restore();
	}

	/**
	 * Updates the image property with the correct sprite image
	 */
	updateSprite() {
		this.image = this.flyingSprite.move();

		//apply the dead effects
		if (this.dead) {
			this.fade();
			this.rotate();
			this.shrink();
		}
	}

	/**
	 * Slowly reduces the image alpha
	 */
	fade() {
		if (this.alpha > 0) {
			this.alpha = (this.alpha - this.deadAlphaSpeed).toFixed(2);
		}
	}

	/**
	 * Changes the image rotation angle
	 */
	rotate() {
		this.angle = this.angle - this.deadRotationSpeed;
	}

	/**
	 * Shrinks the image size
	 */
	shrink() {
		if (this.width > this.minSize) {
			this.width = this.width - this.deadShrinkSpeed;
			this.height = this.height - this.deadShrinkSpeed;
		}
	}
}

import _ from 'lodash';
import Entity from '../../common/entity';
import Sprite from '../../common/sprite';
import Utils from '../../common/utils';

/**
 * Blob class
 */
export default class Blob extends Entity {
	/**
	 * Creates a new blob instance
	 * @param {Object} game
	 */
	constructor(game) {
		super(game, game.contexts.game);

		this.width = this.canvas.width / 12;
		this.height = this.canvas.height / 4;
		this.x = 100;
		this.y = this.game.background.ground - this.height;
		this.dx = 0;
		this.dy = 0;

		this.maxSpeed = 10;
		this.acceleration = 2;
		this.jumpAcceleration = 12;

		this.jumping = false;
		this.facingDirection = 'right';

		this.maxJumpHeight = this.canvas.height - (this.height * 2);

		this.character = _.sample(['green', 'yellow']);
		this.idleSprite = new Sprite(this.game.images.blob[this.character].idle, 7, true);
		this.movingSprite = new Sprite(this.game.images.blob[this.character].running, 7, true);
		this.jumpingSprite = new Sprite(this.game.images.blob[this.character].jumping, 0, true);

		this.currentImage = this.idleSprite.move();
	}

	/**
	 * Moves the blob
	 * If the blob is controllable it processes the current inputs state first
	 */
	move() {
		const inputs = this.game.inputs;
		this.processInputs(inputs);

		//maximum jump height reached
		if (this.jumping && this.y <= this.maxJumpHeight) {
			this.dy = this.dy * -1;
		}

		super.move();
	}

	/**
	 * Draws the blob
	 */
	draw() {
		//update the "currentImage" with the correct sprite image
		this.updateSprite();

		//when moving left
		if (this.facingDirection === 'left') {
			//flip the image horizontally when walking left
			Utils.drawMirroredImage(this.context, this.currentImage, this.x, this.y, this.width, this.height);
		} else {
			this.context.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
		}
	}

	/**
	 * Updates the "currentImage" with the correct sprite image
	 */
	updateSprite() {
		if (this.jumping) {
			if (this.dy < 0) {
				//jumping up image
				this.currentImage = this.jumpingSprite.moveTo(0);
			} else {
				//falling down image
				this.currentImage = this.jumpingSprite.moveTo(1);
			}
		} else if (this.dx !== 0) {
			this.currentImage = this.movingSprite.move();
		} else {
			this.currentImage = this.idleSprite.move();
		}
	}

	/**
	 * Makes the blob jump
	 */
	jump() {
		this.jumping = true;
		this.dy = this.dy - this.jumpAcceleration;
	}

	/**
	 * Called when the blob reaches the ground
	 */
	stopJumping() {
		this.jumping = false;
		this.dy = 0;
	}

	/**
	 * Processes the inputs state and moves the blob
	 * @param {Object} inputs
	 */
	processInputs(inputs) {
		//stop moving
		if (!inputs.left && !inputs.right) {
			this.dx = 0;
		}

		//up
		if (inputs.up) {
			if (!this.jumping) {
				this.jump();
			}
		}

		//left
		if (inputs.left) {
			this.facingDirection = 'left';

			if (this.dx > (this.maxSpeed * -1)) {
				this.dx = this.dx - this.acceleration;
			}
		}

		//right
		if (inputs.right) {
			this.facingDirection = 'right';

			if (this.dx < this.maxSpeed) {
				this.dx = this.dx + this.acceleration;
			}
		}
	}
}

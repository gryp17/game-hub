import _ from 'lodash';
import Entity from '../../common/entity';
import Sprite from '../../common/sprite';
import Utils from '../../common/utils';
import Shadow from './shadow';

/**
 * Dummy class
 */
export default class Dummy extends Entity {
	/**
	 * Creates a new dummy instance
	 * @param {Object} game
	 * @param {Number} strength
	 */
	constructor(game, minForce, verticalForce, horizontalForce) {
		super(game, game.contexts.game);

		this.width = this.canvas.width / 12;
		this.height = this.canvas.height / 4;
		this.x = 100;
		this.y = this.game.background.ground - this.height;
		this.dx = 0;
		this.dy = 0;

		this.minForce = minForce;
		this.verticalForce = verticalForce;
		this.horizontalForce = horizontalForce;
		this.maxSpeed = 10;
		this.acceleration = 2;
		this.jumpAcceleration = 12;

		this.jumping = false;
		this.facingDirection = 'right';

		this.maxJumpHeight = this.canvas.height - (this.height * 2);

		this.character = _.sample(['green', 'yellow']);
		this.idleSprite = new Sprite(this.game.images.dummy[this.character].idle, 7, true);
		this.movingSprite = new Sprite(this.game.images.dummy[this.character].running, 7, true);
		this.jumpingSprite = new Sprite(this.game.images.dummy[this.character].jumping, 0, true);

		this.image = this.idleSprite.move();

		this.shadow = new Shadow(game, this);
	}

	/**
	 * Moves the dummy
	 * If the dummy is controllable it processes the current inputs state first
	 */
	move() {
		const inputs = this.game.inputs;
		this.processInputs(inputs);

		//maximum jump height reached
		if (this.jumping && this.y <= this.maxJumpHeight) {
			this.dy = this.dy * -1;
		}

		super.move();

		this.shadow.move();
	}

	/**
	 * Draws the dummy
	 */
	draw() {
		//update the image with the correct sprite image
		this.updateSprite();

		//when moving left
		if (this.facingDirection === 'left') {
			//flip the image horizontally when walking left
			Utils.drawMirroredImage(this.context, this.image, this.x, this.y, this.width, this.height);
		} else {
			this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
		}

		this.shadow.draw();
	}

	/**
	 * Updates the image property with the correct sprite image
	 */
	updateSprite() {
		if (this.jumping) {
			if (this.dy < 0) {
				//jumping up image
				this.image = this.jumpingSprite.moveTo(0);
			} else {
				//falling down image
				this.image = this.jumpingSprite.moveTo(1);
			}
		} else if (this.dx !== 0) {
			this.image = this.movingSprite.move();
		} else {
			this.image = this.idleSprite.move();
		}
	}

	/**
	 * Makes the dummy jump
	 */
	jump() {
		this.jumping = true;
		this.dy = this.dy - this.jumpAcceleration;
	}

	/**
	 * Called when the dummy reaches the ground
	 */
	stopJumping() {
		this.jumping = false;
		this.dy = 0;
	}

	/**
	 * Processes the inputs state and moves the dummy
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

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
	 * @param {Number} maxSpeed
	 * @param {Number} acceleration
	 * @param {Number} jumpAcceleration
	 * @param {Number} minForce
	 * @param {Number} verticalForce
	 * @param {Number} horizontalForce
	 * @param {Number} player
	 * @param {Boolean} controllable
	 * @param {Number} playerId
	 */
	constructor(game, maxSpeed, acceleration, jumpAcceleration, minForce, verticalForce, horizontalForce, player = 1, controllable = false, playerId = null) {
		super(game, game.contexts.game);

		this.player = player;
		this.controllable = controllable;
		this.playerId = playerId;

		this.width = this.canvas.width / 12;
		this.height = this.canvas.height / 4;
		this.x = 0;
		this.y = this.game.background.ground - this.height;
		this.dx = 0;
		this.dy = 0;

		//the player's own character always uses the green skin
		this.skin = this.controllable ? 'green' : 'yellow';

		this.maxSpeed = maxSpeed;
		this.acceleration = acceleration;
		this.jumpAcceleration = jumpAcceleration;
		this.minForce = minForce;
		this.verticalForce = verticalForce;
		this.horizontalForce = horizontalForce;

		this.jumping = false;

		this.maxJumpHeight = this.canvas.height - (this.height * 2);

		if (!game.isServer) {
			this.idleSprite = new Sprite(this.game.images.dummy[this.skin].idle, 7, true);
			this.movingSprite = new Sprite(this.game.images.dummy[this.skin].running, 7, true);
			this.jumpingSprite = new Sprite(this.game.images.dummy[this.skin].jumping, 0, true);

			this.image = this.idleSprite.move();
		}

		this.moveToCenter();

		this.shadow = new Shadow(game, this);
	}

	/**
	 * Returns the dummy state
	 * @returns {Object}
	 */
	get state() {
		return {
			x: this.x,
			y: this.y,
			dx: this.dx,
			dy: this.dy,
			player: this.player,
			facingDirection: this.facingDirection
		};
	}

	/**
	 * Sets the dummy state
	 * @param {Object} state
	 */
	set state(state) {
		super.state = state;
		this.facingDirection = state.facingDirection;
	}

	/**
	 * Moves the dummy to the center of the screen and makes it face the correct direction
	 */
	moveToCenter() {
		if (this.player === 1) {
			this.x = (this.canvas.width / 4) - (this.width / 2);
			this.facingDirection = 'right';
		} else {
			this.x = this.canvas.width - (this.canvas.width / 4) - (this.width / 2);
			this.facingDirection = 'left';
		}
	}

	/**
	 * Moves the dummy
	 * If the dummy is controllable it processes the current inputs state first
	 */
	move() {
		if (this.controllable) {
			const inputs = this.playerId ? this.game.inputs[this.playerId] : this.game.inputs;
			this.processInputs(inputs);
		}

		//maximum jump height reached
		if (this.jumping && this.y <= this.maxJumpHeight) {
			this.dy = this.dy * -1;
		}

		super.move();

		this.handleCollisions();

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

	/**
	 * Handles all dummy collisions
	 */
	handleCollisions() {
		const background = this.game.background;
		const net = this.game.net;

		//bottom end of scren
		if (this.bottom >= background.ground) {
			this.bottom = background.ground;
			this.stopJumping();
		}

		//left end of screen
		if (this.left < 0) {
			this.left = 0;
		}

		//right end of screen
		if (this.right >= this.canvas.width) {
			this.right = this.canvas.width;
		}

		//collisions with net
		const collisionWithNet = Utils.getCollisionPoint(net, this);
		if (collisionWithNet) {
			if (collisionWithNet === 'left') {
				this.right = net.left;
			}

			if (collisionWithNet === 'right') {
				this.left = net.right;
			}
		}
	}
}

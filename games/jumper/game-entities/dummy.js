import Entity from '../../common/entity';
import Sprite from '../../common/sprite';
import Utils from '../../common/utils';

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
	 * @param {Number} maxJumpHeight
	 * @param {Number} player
	 * @param {Boolean} controllable
	 * @param {Number} playerId
	 */
	constructor(game, maxSpeed, acceleration, jumpAcceleration, maxJumpHeight, player = 1, controllable = false, playerId = null) {
		super(game, game.contexts.game);

		this.player = player;
		this.controllable = controllable;
		this.playerId = playerId;

		this.width = this.canvas.width / 12;
		this.height = this.canvas.height / 4;
		this.x = 0;
		this.y = this.canvas.height - this.height;
		this.dx = 0;
		this.dy = jumpAcceleration;

		//the player's own character always uses the green skin
		this.skin = this.controllable ? 'green' : 'yellow';
		this.facingDirection = 'right';

		this.maxSpeed = maxSpeed;
		this.acceleration = acceleration;
		this.jumpAcceleration = -jumpAcceleration;
		this.jumpDeceleration = jumpAcceleration;
		this.maxJumpHeight = maxJumpHeight;

		this.jumping = false;
		this.jumpingStartingPoint;

		this.flipping = false;
		this.angle = 0;

		if (!game.isServer) {
			this.availableSprites = {
				idle: {
					left: new Sprite(this.game.images.dummy[this.skin].left.idle, 7, true),
					right: new Sprite(this.game.images.dummy[this.skin].right.idle, 7, true)
				},
				moving: {
					left: new Sprite(this.game.images.dummy[this.skin].left.running, 7, true),
					right: new Sprite(this.game.images.dummy[this.skin].right.running, 7, true)
				},
				jumping: {
					left: new Sprite(this.game.images.dummy[this.skin].left.jumping, 0, true),
					right: new Sprite(this.game.images.dummy[this.skin].right.jumping, 0, true)
				}
			};

			this.image = this.sprites.idle.move();
		}
	}

	/**
	 * Sprites getter that returns the correct sprites depending on the direction the dummy is facing
	 * @returns {Object}
	 */
	get sprites() {
		const sprites = {};

		_.forOwn(this.availableSprites, (data, type) => {
			sprites[type] = data[this.facingDirection];
		});

		return sprites;
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
	 * Moves the dummy
	 * If the dummy is controllable it processes the current inputs state first
	 */
	move() {
		if (this.controllable) {
			const inputs = this.playerId ? this.game.inputs[this.playerId] : this.game.inputs;
			this.processInputs(inputs);
		}

		//maximum jump height reached
		if (this.jumping) {
			const distance = Math.abs(this.y - this.jumpingStartingPoint);

			if (distance >= this.maxJumpHeight) {
				this.dy = this.jumpDeceleration;
			}
		}

		if (this.flipping) {
			this.rotate();
		}

		super.move();

		this.handleCollisions();
	}

	/**
	 * Draws the dummy
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
		if (this.jumping) {
			if (this.dy < 0) {
				//jumping up image
				this.image = this.sprites.jumping.moveTo(0);
			} else {
				//falling down image
				this.image = this.sprites.jumping.moveTo(1);
			}
		} else if (this.dx !== 0) {
			this.image = this.sprites.moving.move();
		} else {
			this.image = this.sprites.idle.move();
		}
	}

	/**
	 * Makes the dummy jump
	 */
	jump() {
		this.jumping = true;
		this.jumpingStartingPoint = this.y;
		this.dy = this.jumpAcceleration;
	}

	/**
	 * Called when the dummy reaches the ground
	 */
	touchedGround() {
		this.jumping = false;
		this.dy = this.jumpDeceleration;

		this.jump();
	}

	/**
	 * Raises the flipping flag
	 */
	flip() {
		this.flipping = true;
	}

	/**
	 * Changes the image rotation angle
	 */
	rotate() {
		this.angle = this.angle + 30;

		if (this.angle >= 720) {
			this.angle = 0;
			this.flipping = false;
		}
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
			} else {
				if (!this.flipping) {
					this.flip();
				}
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
		//bottom end of scren
		if (this.bottom >= this.canvas.height) {
			this.bottom = this.canvas.height;
			this.touchedGround();
		}

		//left end of screen
		if (this.left < 0) {
			this.left = 0;
		}

		//right end of screen
		if (this.right >= this.canvas.width) {
			this.right = this.canvas.width;
		}
	}
}

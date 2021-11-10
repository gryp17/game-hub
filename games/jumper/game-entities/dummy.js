import _ from 'lodash';
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
	 * @param {Number} jumpAcceleration
	 * @param {Number} maxJumpHeight
	 * @param {Number} player
	 * @param {Boolean} controllable
	 * @param {Number} playerId
	 */
	constructor(game, maxSpeed, jumpAcceleration, maxJumpHeight, player = 1, controllable = false, playerId = null) {
		super(game, game.contexts.game);

		this.player = player;
		this.controllable = controllable;
		this.playerId = playerId;

		this.width = this.canvas.width / 12;
		this.height = this.canvas.height / 4;
		this.x = 0;
		this.y = 0;

		this.dx = 0;
		this.dy = jumpAcceleration;

		//the player's own character always uses the green skin
		this.skin = this.controllable ? 'green' : 'yellow';
		this.facingDirection = 'right';

		this.maxSpeed = maxSpeed;
		this.jumpAcceleration = -jumpAcceleration;
		this.jumpDeceleration = jumpAcceleration;
		this.maxJumpHeight = maxJumpHeight;

		this.previousUpState = false;

		this.idle = true;
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

		this.reset();
	}

	/**
	 * Sets the x value
	 * @param {Number} value
	 */
	set x(value) {
		this._x = value;
	}

	/**
	 * Returns the x value
	 * @returns {Number}
	 */
	get x() {
		return this._x;
	}

	/**
	 * Sets the dx value
	 * @param {Number} value
	 */
	set dx(value) {
		this._dx = value;
	}

	/**
	 * Returns the dx value
	 * @returns {Number}
	 */
	get dx() {
		return this._dx;
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
	 * Resets the dummy position
	 */
	reset() {
		this.x = (this.canvas.width / 2) - (this.width / 2);
		this.y = 0;
		this.dx = 0;
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
		} else if (this.idle) {
			this.image = this.sprites.idle.move();
		} else {
			this.image = this.sprites.moving.move();
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
	 * Called when the dummy touches a platform
	 */
	touchedPlatform() {
		this.jumping = false;
		this.dy = this.jumpDeceleration;

		this.stopFlipping();
	}

	/**
	 * Raises the flipping flag
	 */
	flip() {
		this.flipping = true;
	}

	/**
	 * Stops flipping
	 */
	stopFlipping() {
		this.flipping = false;
		this.angle = 0;
	}

	/**
	 * Changes the image rotation angle
	 */
	rotate() {
		const rotationSpeed = this.facingDirection === 'left' ? -30 : 30;
		this.angle = this.angle + rotationSpeed;

		if (Math.abs(this.angle) >= 720) {
			this.stopFlipping();
		}
	}

	/**
	 * Processes the inputs state and moves the dummy
	 * @param {Object} inputs
	 */
	processInputs(inputs) {
		//update the idle status
		if (!inputs.left && !inputs.right) {
			this.idle = true;
		} else {
			this.idle = false;
		}

		//up
		//run this logic only if the up input state has changed - this is a fix for the double jump/flip
		if (this.previousUpState !== inputs.up) {
			this.previousUpState = inputs.up;

			if (inputs.up) {
				if (!this.jumping) {
					this.jump();
				} else if (!this.flipping) {
					this.flip();
				}
			}
		}

		//left
		if (inputs.left) {
			this.facingDirection = 'left';
			this.dx = this.maxSpeed * -1;
		}

		//right
		if (inputs.right) {
			this.facingDirection = 'right';
			this.dx = this.maxSpeed;
		}
	}

	/**
	 * Handles all dummy collisions
	 */
	handleCollisions() {
		const platforms = this.game.platforms;

		//bottom end of scren
		if (this.top >= this.canvas.height) {
			//TODO: game over
			this.reset();
		}

		//left end of screen
		if (this.left < 0) {
			this.left = 0;
		}

		//right end of screen
		if (this.right >= this.canvas.width) {
			this.right = this.canvas.width;
		}

		//platforms
		platforms.forEach((platform) => {
			const collisionWithPlatform = Utils.getCollisionPoint(platform, this);
			if (collisionWithPlatform) {
				if (['top', 'topLeft', 'topRight'].includes(collisionWithPlatform)) {
					this.bottom = platform.top;

					//move the dummy together with the platform if it's idle
					if (this.idle) {
						this.dx = platform.dx;
					}

					this.touchedPlatform();
				}

				if (['bottom', 'bottomLeft', 'bottomRight'].includes(collisionWithPlatform)) {
					this.top = platform.bottom;
					this.touchedPlatform();
				}

				if (collisionWithPlatform === 'left') {
					this.right = platform.left;
				}

				if (collisionWithPlatform === 'right') {
					this.left = platform.right;
				}
			}
		});
	}
}

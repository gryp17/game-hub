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
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Number} lives
	 * @param {Number} invincibilityDuration
	 * @param {Number} acceleration
	 * @param {Number} maxSpeed
	 * @param {Number} fallSpeed
	 * @param {Number} fallSpeedDead
	 * @param {Number} jumpAcceleration
	 * @param {Number} maxJumpHeight
	 * @param {Number} player
	 * @param {Boolean} controllable
	 * @param {Object} playerData
	 */
	constructor(game, width, height, lives, invincibilityDuration, acceleration, maxSpeed, fallSpeed, fallSpeedDead, jumpAcceleration, maxJumpHeight, player = 1, controllable = false, playerData = {}) {
		super(game, game.contexts.game, width, height);

		this.player = player;
		this.controllable = controllable;

		this.socketId = playerData.socketId;
		this.userId = playerData.id;
		this.username = playerData.username;

		this.dx = 0;
		this.dy = fallSpeed;

		this.fallSpeed = fallSpeed;
		this.fallSpeedDead = fallSpeedDead;
		this.acceleration = acceleration;
		this.maxSpeed = maxSpeed;
		this.jumpAcceleration = jumpAcceleration * -1;
		this.jumpDeceleration = fallSpeed;
		this.maxJumpHeight = maxJumpHeight;

		this.previousUpState = false;

		this.dead = false;
		this.invincible = false;
		this.lives = lives;
		this.invincibilityDuration = invincibilityDuration;
		this.invincibilityTimeoutId;

		this.idle = true;
		this.jumping = false;
		this.jumpingStartingPoint;

		this.flipping = false;
		this.angle = 0;
		this.alpha = 1;

		//the player's own character always uses the green skin
		this.skin = this.controllable ? 'green' : 'yellow';
		this.facingDirection = 'right';

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
				},
				dead: {
					left: new Sprite(this.game.images.dummy[this.skin].left.dead, 10, true),
					right: new Sprite(this.game.images.dummy[this.skin].right.dead, 10, true)
				}
			};

			this.image = this.sprites.idle.move();
		}

		this.reset();
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
			...super.state,
			player: this.player,
			userId: this.userId,
			username: this.username,
			facingDirection: this.facingDirection,
			dead: this.dead,
			invincible: this.invincible,
			lives: this.lives,
			idle: this.idle,
			jumping: this.jumping,
			flipping: this.flipping,
			angle: this.angle,
			alpha: this.alpha
		};
	}

	/**
	 * Sets the dummy state
	 * @param {Object} state
	 */
	set state(state) {
		super.state = state;

		this.userId = state.userId;
		this.username = state.username;
		this.facingDirection = state.facingDirection;
		this.dead = state.dead;
		this.invincible = state.invincible;
		this.lives = state.lives;
		this.idle = state.idle;
		this.jumping = state.jumping;
		this.flipping = state.flipping;
		this.angle = state.angle;
		this.alpha = state.alpha;
	}

	/**
	 * Makes the dummy die when touched by an enemy
	 */
	hitByEnemy() {
		this.dead = true;
		this.dx = 0;
		this.dy = this.fallSpeedDead;
	}

	/**
	 * Decreases the dummy lives
	 * @returns {Number}
	 */
	liveLost() {
		this.lives--;

		this.game.triggerEvent('dead');

		if (this.lives === 0) {
			//if player 1 loses all his lives player 2 wins and vice versa
			const winner = this.player === 1 ? 2 : 1;
			this.game.onPlayerScore(winner);
		}

		return this.lives;
	}

	/**
	 * Resets the dummy position
	 */
	reset(giveInvincibility = false) {
		this.dead = false;
		this.flipping = false;

		//raise the jumping flag in order to display the "jumping" sprite image while falling down
		this.jumping = true;

		this.x = (this.canvas.width / 2) - (this.width / 2);
		this.y = 0;
		this.dx = 0;
		this.dy = this.jumpDeceleration;
		this.angle = 0;
		this.alpha = 1;

		//make the dummy invincible for X seconds
		if (this.game.isServer && giveInvincibility) {
			this.invincible = true;

			clearTimeout(this.invincibilityTimeoutId);
			this.invincibilityTimeoutId = setTimeout(() => {
				this.invincible = false;
				this.alpha = 1;
			}, this.invincibilityDuration);
		}
	}

	/**
	 * Moves the dummy
	 * If the dummy is controllable it processes the current inputs state first
	 */
	move() {
		if (this.controllable) {
			const inputs = this.socketId ? this.game.inputs[this.socketId] : this.game.inputs;
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
			this.rotateWhenFlipping();
		}

		if (this.dead) {
			this.rotateWhenDead();
		}

		if (this.invincible) {
			this.fade();
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

		this.context.save();
		this.context.globalAlpha = this.alpha;
		Utils.drawRotatedImage(this.context, this.image, this.angle, this.x, this.y, this.width, this.height);
		this.context.restore();
	}

	/**
	 * Updates the image property with the correct sprite image
	 */
	updateSprite() {
		if (this.dead) {
			this.image = this.sprites.dead.move();
		} else if (this.jumping) {
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

		if (this.game.isServer) {
			this.game.triggerEvent('jump');
		}
	}

	/**
	 * Called when the dummy touches a platform
	 */
	touchedPlatform() {
		this.jumping = false;
		this.dy = this.fallSpeed;

		this.stopFlipping();
	}

	/**
	 * Changes the image alpha
	 */
	fade() {
		if (this.alpha > 0.6) {
			this.alpha = this.alpha - 0.1;
		} else {
			this.alpha = 1;
		}
	}

	/**
	 * Raises the flipping flag
	 */
	flip() {
		this.flipping = true;

		if (this.game.isServer) {
			this.game.triggerEvent('flip');
		}
	}

	/**
	 * Stops flipping
	 */
	stopFlipping() {
		this.flipping = false;
		this.angle = 0;
	}

	/**
	 * Triggers the flipping rotation animation
	 */
	rotateWhenFlipping() {
		const rotationSpeed = this.facingDirection === 'left' ? -30 : 30;
		this.angle = this.angle + rotationSpeed;

		if (Math.abs(this.angle) >= 720) {
			this.stopFlipping();
		}
	}

	/**
	 * Triggers the dead rotation animation
	 */
	rotateWhenDead() {
		const rotationSpeed = this.facingDirection === 'left' ? 1 : -1;
		this.angle = this.angle + rotationSpeed;
	}

	/**
	 * Processes the inputs state and moves the dummy
	 * @param {Object} inputs
	 */
	processInputs(inputs) {
		if (this.dead) {
			return;
		}

		//update the idle status
		if (!inputs.left && !inputs.right) {
			//this helps with the dummy control while in the air
			if (this.jumping) {
				this.dx = 0;
			}
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
		const platforms = this.game.platforms;
		const enemies = this.game.enemies;

		//bottom end of screen
		if (this.top >= this.canvas.height) {
			if (this.game.isServer) {
				const remainingLives = this.liveLost();

				if (remainingLives > 0) {
					this.reset(true);
				}
			}
		}

		//left end of screen
		if (this.left < 0) {
			this.left = 0;
		}

		//right end of screen
		if (this.right >= this.canvas.width) {
			this.right = this.canvas.width;
		}

		//skip the rest of the checks if the dummy is dead
		if (this.dead) {
			return;
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

		//enemies
		enemies.forEach((enemy) => {
			if (enemy.dead) {
				return;
			}

			//check for spider net collisions
			if (enemy.className === 'Spider') {
				const spiderNet = enemy.spiderNet;

				//touching the spider's net kills it
				if (Utils.collidesWith(spiderNet.hitbox, this.hitbox)) {
					enemy.die();
					return;
				}
			}

			if (Utils.collidesWith(enemy.hitbox, this.hitbox)) {
				if (this.flipping) {
					enemy.die();
				} else if (!this.invincible) {
					this.hitByEnemy();
				}
			}
		});
	}
}

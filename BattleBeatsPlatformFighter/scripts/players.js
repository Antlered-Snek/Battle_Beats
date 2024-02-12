



import print from './main.js'
import { c, canvas_height, canvas_width, gravity, dashTime, drag, gameFrame } from './universalVar.js'
import { rectangularCollision, freezeFrame, screenShake, getDistance, ultimateFreeze } from './functions.js'
import { keys } from './inputHandler.js'
import Platform, { platforms } from './platforms.js'
import Effect, { effects, targetPath, force, slash } from './effects.js'

import { greenCat_moveset, rileyRoulette_moveset } from './attacks.js'

import { guard_break, greenCat_sprite } from './sprites.js'


export default class Player {
	constructor(player, {position, acceleration, velocity, stats, attacks, color='white', spriteInfo=null}) {

		// Variable Character Attributes
		this.health = stats.health;
		this.speed = stats.speed;
		this.jumpHeight = stats.jumpHeight;
		this.dashSpeed = stats.dashSpeed;
		this.dashPrice = stats.dashPrice;
		this.attacks = attacks;
		this.size = {
			width: 100,
			height: 100
		}

		// Other Variable Attributes
		this.position = position;
		this.acceleration = acceleration;
		this.velocity = velocity;
		this.player = player;
		this.color = color;
		this.spriteInfo = spriteInfo;

		// Constant Attributes
		this.maxHealth = this.health;
		this.jumpNumber = 2;
		this.jumpCooldown = 0;
		this.energy = 0;
		this.energyBar = this.energy;
		this.stamina = 100;
		this.staminaRegen = 2;
		this.staminaRegenDelay = 0;
		this.staminaBar = this.stamina;
		this.healthBar = this.health;
		this.healthBarDelay = 0;
		this.velocityResetFrames = 0;
		this.staggerDuration = 0;
		this.canBlockDelay = 0;
		this.forceUnStagger = 0;
		this.bounceNumber = 0;
		this.directionUpdateDelay = 0;
		this.rotationUpdateDelay = 0;
		this.drag = drag;
		this.speedMultiplier = 1;
		this.damageTakenMultiplier = 1;

		// State Attributes
		this.enemies;
		this.direction;
		this.isGrounded;
		this.canWallJump = false;
		this.canBeGrounded = true;
		this.isDashing = false;
		this.isMoving = false;
		this.canMove = true;
		this.direction;
		this.lastkey;
		this.isAttacking = {
			basicAttack: {value: false},
			upAttack: {value: false},
			downAttack: {value: false},
			comboBreaker: {value: false},
			skill1: {value: false},
			skill2: {value: false},
			skill3: {value: false},
			skill4: {value: false},
			ult: {value: false},
		};
		this.canBeStaggered = true;
		this.isChargeAttacking = false;
		this.chargeAttackDelay = 0;
		this.index;
		this.isBlocking = false;
		this.canBlock = true;
		this.isStaggered = false;
		this.tegDelay = 0;
		this.borderX = canvas_width-this.size.width;
		this.borderY = canvas_height-this.size.height;


		// Temporary Addition
		this.attackDelayActive = false;

		// Direction
		if (this.player === 1) {
			this.direction = 'right';
			this.lastkey = 'd';
		}
		else if (this.player === 2) {
			this.direction = 'left';
			this.lastkey = 'left';
		}
	}

	draw() {
		if (this.directionUpdateDelay > 0) this.directionUpdateDelay--;
		if (this.rotationUpdateDelay > 0) this.rotationUpdateDelay--;
		else this.position.rotation = 0;
		let repeat; // Temporary Addition
		let cex;

		let sideX;
		let side;
		if (this.player === 1) side = 1;
		else if (this.player === 2) side = -1;

		this.platformPhysics();
		this.corrections();

		// HitBoxes
		if (this.isAttacking.basicAttack.value) this.drawHitbox(this.attacks.basicAttack);
		if (this.isAttacking.upAttack.value) this.drawHitbox(this.attacks.upAttack);
		if (this.isAttacking.downAttack.value) this.drawHitbox(this.attacks.downAttack);
		if (this.isAttacking.comboBreaker.value) this.drawHitbox(this.attacks.comboBreaker);
		if (this.isAttacking.skill1.value) this.drawHitbox(this.attacks.skill1);
		if (this.isAttacking.skill2.value) this.drawHitbox(this.attacks.skill2);
		if (this.isAttacking.skill3.value) this.drawHitbox(this.attacks.skill3);
		if (this.isAttacking.skill4.value) this.drawHitbox(this.attacks.skill4);
		if (this.isAttacking.ult.value) this.drawHitbox(this.attacks.ult);


		// Cooldowns
		this.drawCooldown(this.attacks.basicAttack, 0);
		this.drawCooldown(this.attacks.upAttack, 1);
		this.drawCooldown(this.attacks.downAttack, 2);
		this.drawCooldown(this.attacks.comboBreaker, 3);
		this.drawCooldown(this.attacks.skill1, 4);
		this.drawCooldown(this.attacks.skill2, 5);
		this.drawCooldown(this.attacks.skill3, 6);
		this.drawCooldown(this.attacks.skill4, 7);
		this.drawCooldown(this.attacks.ult, 8);

		// Can't Block
		if (!this.canBlock) {
			if (side === 1) sideX = 25;
			else if (side === -1) sideX = canvas_width - 65;

			// c.fillStyle = 'red';
			// c.fillRect(sideX, 160, 20, 20)

			c.drawImage(guard_break, sideX, 160, 40, 40)
		}

		// Player
		c.beginPath();
		c.fillStyle = 'white';
		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.font = '30px Arial';
		c.fillText(`P${this.player}`, this.position.x+this.size.width*0.5, this.position.y-15);
		c.closePath();

		// Character
		this.drawCharacter(side, sideX, repeat);


		// Health
		if (this.player === 1) sideX = 15;
		else if (this.player === 2) sideX = 1009;

		if ((this.health < this.healthBar) && (this.healthBarDelay === 0)) this.healthBar -= 100;
		else if (this.health > this.healthBar) this.healthBar = this.health;
		else if (this.healthBarDelay > 0) this.healthBarDelay--;

		c.fillStyle = 'indianRed';
		c.fillRect(sideX, 30, side*this.healthBar/this.maxHealth*470, 30);
		c.fillStyle = 'springGreen';
		c.fillRect(sideX, 30, side*this.health/this.maxHealth*470, 30);

		// Stamina
		if (this.player === 1) sideX = 20;
		else if (this.player === 2) sideX = 1004;
		if (this.stamina < this.staminaBar) this.staminaBar -= this.staminaRegen;
		if (this.stamina > this.staminaBar) this.staminaBar += this.staminaRegen;
		c.fillStyle = 'orange';
		c.fillRect(sideX, 80, side*this.staminaBar*4.5, 10);

		// Energy
		if (this.player === 1) sideX = 20;
		else if (this.player === 2) sideX = 1004;
		if (this.energy < this.energyBar) this.energyBar -= 2;
		if (this.energy > this.energyBar) this.energyBar += 2;
		c.fillStyle = 'cyan';
		c.fillRect(sideX, 100, side*this.energyBar*4.2, 5);
	}

	platformPhysics() {
		if (this.velocity.y > 0 && this.velocity.y < 30 && this.isGrounded) this.velocity.y = 0;

		for (let i in platforms) {
			let platform = platforms[i];
			if (rectangularCollision(this, platform)) {
				if (this.isStaggered) {
					if (platform.isHard || (this.velocity.y >= 0 && !platform.isHard && this.canBeGrounded)) {
						if (this.position.y + this.size.height <= platform.position.y + this.velocity.y + 25) {
							this.bounceY();
						}
					}
					if (platform.isHard && (this.position.y + this.size.height != platform.position.y)) {
						if ((this.position.x + this.size.width > platform.position.x) && (this.position.x + this.size.width < platform.position.x + platform.size.width)) this.bounce();
						else if ((this.position.x < platform.position.x + platform.size.width) && (this.position.x + this.size.width > platform.position.x + platform.size.width)) this.bounce();
					}
				}
				// if (platform.isHard && (this.position.y+this.size.height > platform.position.y && this.position.y < platform.position.y+platform.size.height) && (this.position.x+this.size.width > platform.position.x || this.position.x < platform.position.x+platform.size.width)) {
				// 	this.position.y = platform.position.y - this.size.height;
				// }
				if (platform.isHard && !platform.isPushable && (this.position.y + this.size.height != platform.position.y)) {
					if ((this.position.x + this.size.width > platform.position.x) && (this.position.x + this.size.width < platform.position.x + platform.size.width)) this.position.x = platform.position.x - this.size.width;
					else if ((this.position.x < platform.position.x + platform.size.width) && (this.position.x + this.size.width > platform.position.x + platform.size.width)) this.position.x = platform.position.x + platform.size.width;
					this.canWallJump = true;
				}
				if (platform.isPushable && (this.position.y + this.size.height != platform.position.y)) {
					if ((this.position.x + this.size.width > platform.position.x) && (this.position.x + this.size.width < platform.position.x + platform.size.width)) platform.position.x = this.position.x + this.size.width;
					else if ((this.position.x < platform.position.x + platform.size.width) && (this.position.x + this.size.width > platform.position.x + platform.size.width)) platform.position.x = this.position.x - platform.size.width;
				}
			}
		}
	}

	corrections() {
		if (this.velocity.y > 50) this.velocity.y = 50;
		else if (this.velocity.y < -50) this.velocity.y = -50;

		if (this.position.x > canvas_width) this.position.x = -this.size.width;
		else if (this.position.x < -this.size.width) this.position.x = canvas_width;
		if (this.position.y > canvas_height) this.position.y = -this.size.height;

		this.position.x = Math.round(this.position.x);
		if (this.health <= 0) {
			this.health = 0;
			alert(`Player ${this.player} lost`);
		}
		if (this.stamina >= 100) this.stamina = 100;
		if (this.energy >= 100) this.energy = 100;
	}

	directionUpdate(direct=false, string='') {
		if (this.directionUpdateDelay === 0) {
			if (this.player == 1) {
				if (this.lastkey == 'd') this.direction = 'right';
				else if (this.lastkey == 'a') this.direction = 'left';
			}
			else if (this.player == 2) {
				if (this.lastkey == 'left') this.direction = 'left';
				else if (this.lastkey == 'right') this.direction = 'right';
			}
		}

		if (direct) {
			this.direction = string;
			this.directionUpdateDelay = 16;
		}
	}

	drawCharacter(side, sideX, repeat) {
		if (this.spriteInfo != null) {
			let dir;
			let ex;
			let sprite;
			let width = this.spriteInfo.size.width;
			let height = this.spriteInfo.size.height;
			let fps = 8;





			// Row
			if (this.isAttacking.basicAttack.value) this.spriteInfo.grid.row = 5;
			else if (!this.isGrounded && ((this.direction == 'right' && this.acceleration.x <= 0) || (this.direction == 'left' && this.acceleration.x >= 0))) this.spriteInfo.grid.row = 4;
			else if (this.isMoving) {
				this.spriteInfo.grid.row = 3;
				fps = 4;
			}
			else {
				if (this.spriteInfo.cycle === 1) this.spriteInfo.grid.row = 1;
				else if (this.spriteInfo.cycle === 2) this.spriteInfo.grid.row = 2;
			}



			// Coloumn
			if (this.spriteInfo.grid.col >= 6 && gameFrame % fps === 0) {
				this.spriteInfo.grid.col = 1;
				if (this.spriteInfo.cycle === 1) this.spriteInfo.cycle = 2;
				else if (this.spriteInfo.cycle === 2) this.spriteInfo.cycle = 1;
			}
			else if (gameFrame % fps === 0) this.spriteInfo.grid.col++;

			



			let sprite_col = this.spriteInfo.grid.col;
			let sprite_row = this.spriteInfo.grid.row;


			if (this.direction == 'right') {
				sprite = this.spriteInfo.sprite.right;
				sideX = 0;
				dir = 1;
				ex = 1
			}
			if (this.direction == 'left') {
				sprite = this.spriteInfo.sprite.left;
				sideX = 5000;
				dir = -1;
				ex = 0;
			}

			c.drawImage(sprite, sideX+dir*(sprite_col-ex)*500, (sprite_row-1)*500, 500, 500, this.position.x, this.position.y, width, height);
		}
		else {
			c.fillStyle = this.color;
			if (!this.isChargeAttacking) {
				// if (!this.isGrounded) c.fillStyle = 'yellow';
				if (this.isBlocking) c.fillStyle = 'orange';
				if (this.isDashing) {
					c.fillStyle = 'lightBlue';
					if (this.direction == 'right') c.fillRect(this.position.x, this.position.y, -40, this.size.height);
					else if (this.direction == 'left') c.fillRect(this.position.x+this.size.width, this.position.y, 40, this.size.height);
					c.fillStyle = this.color;
				}
				if (this.isStaggered) c.fillStyle = 'indianRed';
			}
			

			// Temporary Addition
			if (this.chargeAttackDelay > 0 && !this.attackDelayActive) {
				this.attackDelayActive = true;
				let col = this.color;
				repeat = setInterval( () => {
					if (this.chargeAttackDelay % 2 === 0) this.color = 'red';
					else this.color = 'white';

					if (this.chargeAttackDelay <= 0 && this.attackDelayActive) {
						clearInterval(repeat);
						this.attackDelayActive = false;
						this.color = col;
					}
				}, 20)
			}
			// c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
			c.translate(this.position.x+this.size.width/2, this.position.y+this.size.height/2);
			c.rotate(this.position.rotation * Math.PI / 180);
			c.fillRect(-this.size.width/2, -this.size.height/2, this.size.width, this.size.height);

			// Eyes
			c.fillStyle = 'white';
			if (this.direction == 'right') sideX = this.size.width - 30;
			else if (this.direction == 'left') sideX = 10;
			c.fillRect(-this.size.width/2+sideX, -this.size.height/2+20, 20, 40);
			if (this.direction == 'right') sideX = this.size.width - 70;
			else if (this.direction == 'left') sideX = 50;
			c.fillRect(-this.size.width/2+sideX, -this.size.height/2+20, 20, 40);

			c.translate(0, 0);
			c.setTransform(1, 0, 0, 1, 0, 0);
		}
	}

	drawHitbox(atk) {
		let sideX;
		c.fillStyle = 'indianRed';
		if (atk.shape == 'rectangle') {
			if (this.direction == 'left') sideX = -atk.size.width - atk.offset.x;
			else if (this.direction == 'right') sideX = this.size.width + atk.offset.x;
			c.translate(this.position.x+sideX, this.position.y+atk.offset.y);
			c.rotate(atk.offset.rotation * Math.PI / 180);
			c.fillRect(0, 0, atk.size.width, atk.size.height);
			c.translate(0, 0);
			c.setTransform(1, 0, 0, 1, 0, 0);
		}
		if (atk.shape == 'circle') {
			c.translate(this.position.x+this.size.width/2, this.position.y+this.size.height/2);
			c.beginPath();
			if (this.direction == 'left') sideX = -atk.offset.x;
			else if (this.direction == 'right') sideX = this.size.width + atk.offset.x;
			c.arc(0, 0, atk.size.radius, 0, Math.PI*2, false);
			c.fill();
			c.translate(0, 0);
			c.setTransform(1, 0, 0, 1, 0, 0);
			c.closePath();
		}
	}

	drawCooldown(atk, order) {
		let sideX;
		if (this.player === 1) sideX = 35 + 50*order;
		else if (this.player === 2) sideX = 989 - 50*order;
		c.fillStyle = 'orange';
		if (this.stamina - atk.staminaCost < 0 || this.energy - atk.energyCost < 0) c.fillStyle = 'red';
		c.beginPath();
		c.arc(sideX, 135, 15, 0, Math.PI*2, false);
		c.fill();
		c.closePath();
		if (atk.cooldown > 0) {
			c.fillStyle = 'brown';
			c.beginPath();
			c.arc(sideX, 135, 15, 0, (atk.cooldown/atk.cooldownDuration)*Math.PI*2, false);
			c.fill();
			c.closePath();
		}

		c.fillStyle = 'black';
		c.beginPath();
		c.font = '15px Arial';
		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.fillText(`${atk.count}`, sideX, 135);	
		c.closePath();
	}

	ground() {
		this.isGrounded = false;
		for (let i in platforms) {
			let platform = platforms[i];
			if (rectangularCollision(this, platform)) {
				if ((this.velocity.y >= 0 && !platform.isHard && this.canBeGrounded) || platform.isHard) {
					if (this.position.y + this.size.height <= platform.position.y + this.velocity.y + 25) {
						if (this.isStaggered && this.staggerDuration > 0) this.staggerDuration--;
						else this.isGrounded = true;
						if (this.jumpCooldown === 0) this.jumpNumber = 2;
						this.position.y = platform.position.y - this.size.height;
					}
				}
			}
		}
		if (!this.isGrounded) this.acceleration.y = gravity;
		else if (this.isGrounded && (this.velocity.y > 0 || this.acceleration.y > 0)) {
			this.velocity.y = 0;
			this.acceleration.y = 0;
		}
	}

	vectors() {
		this.velocity.x += this.acceleration.x/1000;
		this.velocity.y += this.acceleration.y/1000;

		if (this.isGrounded && !this.isDashing) this.acceleration.x = 0;
		else if (this.velocity.x**2 + this.velocity.y**2 > 20000) this.isGrounded = false;

		if (this.isDashing) {
			this.drag = drag*40;
			this.velocity.y = 0;
		}
		else this.drag = drag;

		if (this.acceleration.x > 0) this.acceleration.x -= this.drag;
		else if (this.acceleration.x < 0) this.acceleration.x += this.drag;
		if (this.acceleration.y > 0) this.acceleration.y -= this.drag;
		else if (this.acceleration.y < 0) this.acceleration.y += this.drag;

		if (this.velocityResetFrames > 0) {
			this.velocityResetFrames--;
			this.velocity.x = 0;
			this.velocity.y = 0;
		}

		let limit = 100;
		if (this.velocity.x > limit) this.velocity.x = limit;
		if (this.velocity.x < -limit) this.velocity.x = -limit;
		if (this.velocity.x > limit) this.velocity.y = limit;
		if (this.velocity.x < -limit) this.velocity.y = -limit;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}

	bounce() {
		this.bounceNumber++;
		this.acceleration.x *= -1 / this.bounceNumber*0.8;
		if (this.acceleration.y >= 0) this.acceleration.y *= -1 / this.bounceNumber*0.8;
		else this.acceleration.y *= 1 / this.bounceNumber*0.8;
		this.velocity.x *= -1 / this.bounceNumber*0.8;
		if (this.velocity.y >= 0) this.velocity.y *= -1 / this.bounceNumber*0.8;
		else this.velocity.y *= 1 / this.bounceNumber*0.8;
		this.teqDelay = 20;

		if (Math.abs(this.velocity.x) > 12) screenShake(45);
		if (this.velocity.x**2 + this.velocity.y**2 > 100) {
			this.health -= (this.velocity.x**2 +this.velocity.y**2)*0.2 * this.damageTakenMultiplier;
			this.healthBarDelay = 30;
			this.staggerDuration = 5;
		}

		if (this.velocity.x**2 + this.velocity.y**2 > 150) {
			let size = {
				width: 150,
				height: 150,
				radius: 0
			}
			let effect = new Effect(force, size);
			let rot;
			let sideX;
			if (this.velocity.x > 0) {
				rot = 90;
				sideX = 10;
			}
			else if (this.velocity.x < 0) {
				rot = -90;
				sideX = -50;
			}
			effect.position = {
				x: this.position.x + sideX,
				y: this.position.y,
				rotation: rot
			}
			effect.spriteInfo.grid.col = 1;
		}
	}

	bounceY() {
		this.bounceNumber++;
		this.acceleration.x *= 1 / this.bounceNumber*0.8;
		this.acceleration.y *= -1 / this.bounceNumber*0.8;
		this.velocity.x *= 1 / this.bounceNumber*0.8;
		this.velocity.y *= -1 / this.bounceNumber*0.8;
		this.teqDelay = 20;

		if (this.velocity.x**2 + this.velocity.y**2 > 100) {
			this.health -= (this.velocity.x**2 +this.velocity.y**2)*0.2 * this.damageTakenMultiplier;
			this.healthBarDelay = 30;
			this.staggerDuration = 5;
		}

		if (this.velocity.x**2 + this.velocity.y**2 > 150) {
			let size = {
				width: 150,
				height: 150,
				radius: 0
			}
			let effect = new Effect(force, size);
			effect.position = {
				x: this.position.x - 50,
				y: this.position.y - 50,
				rotation: 0
			}
			effect.spriteInfo.grid.col = 1;
		}
	}

	move(indicator) {
		if (this.canMove) {
			this.isMoving = true;
			if (this.isGrounded) {
				switch (indicator) {
					case 0:
						this.velocity.x = this.speed * this.speedMultiplier;
						break;
					case 1:
						this.velocity.x = -this.speed * this.speedMultiplier;
				}
			}
			else {
				switch (indicator) {
					case 0:
						this.velocity.x += this.speed*0.1 * this.speedMultiplier;
						break;
					case 1:
						this.velocity.x -= this.speed*0.1 * this.speedMultiplier;
				}

				if (this.velocity.x > this.speed * this.speedMultiplier) this.velocity.x = this.speed * this.speedMultiplier;
				else if (this.velocity.x < -this.speed * this.speedMultiplier) this.velocity.x = -this.speed * this.speedMultiplier;
			}
		}
	}

	fallDown() {
		for (let i in platforms) {
			let platform = platforms[i];
			if (rectangularCollision(this, platform) && this.isGrounded && !platform.isHard) {
				this.canBeGrounded = false;
				setTimeout( () => {
					this.canBeGrounded = true;
				}, 200);
			}
		}
	}

	jump() {
		if (this.jumpNumber > 0 && this.jumpCooldown === 0 && this.canMove) {
			this.velocity.y = -this.jumpHeight;
			this.velocity.x *= 0.8;
			this.jumpNumber--;
			this.jumpCooldown = 15;
			if (this.canWallJump && !this.isGrounded) {
				this.jumpNumber += 0.5;
				if (this.direction == 'right') this.velocity.x = -this.speed;
				else if (this.direction == 'left') this.velocity.x = this.speed;
			}
			this.isGrounded = false;

			let size = {
				width: 100,
				height: 100
			}
			let effect = new Effect(force, size);
			effect.position = {
				x: this.position.x,
				y: this.position.y,
				rotation: 0
			}
			effect.spriteInfo.grid.col = 1;
		}
	}

	dash(consumesStamina=true) {
		if ((this.stamina - this.dashPrice >= 0) && (this.staminaRegenDelay < 70 || !consumesStamina) && this.canMove && !this.isStaggered && !this.isChargeAttacking) {
			this.directionUpdate();
			if (this.direction == 'right') this.acceleration.x += this.dashSpeed*400;
			else if (this.direction == 'left') this.acceleration.x -= this.dashSpeed*400;
			if (consumesStamina) {
				this.staminaRegenDelay = 80;
				this.stamina -= this.dashPrice;
			}
			this.isDashing = true;
			this.velocity.x = 0;
		}
	}																		// Under Construction

	staminaGaugeRegen() {
		if (this.stamina < 0) this.stamina = 0;
		if (this.staminaRegenDelay > 0 && !this.isBlocking) this.staminaRegenDelay--;
		if (this.staminaRegenDelay == 0 && this.stamina < 100 && !this.isBlocking) this.stamina += this.staminaRegen;

		if (this.staminaRegenDelay === 65 && this.isDashing) {
			this.isDashing = false;
			this.velocity.x = 0;
		}
	}

	tookDamage(damage, direction, resetVelocity=true, knockbackVelocityX=4, knockbackVelocityY=5, heavyAttack=false, staggers=true) {
		let knockbackAccelerationX = 250;
		damage *= this.damageTakenMultiplier;
		if (!this.canBeStaggered) {
			staggers = false;
			knockbackVelocityX = 0;
			knockbackVelocityY = 0;
		}

		// Block Check
		if (this.isBlocking) {
			this.energyGain(damage*3);
			if (damage < 20) damage = 0;
			else damage *= 0.1;
			knockbackVelocityX *= 0.8;
			knockbackAccelerationX *= 0.1;
			if (damage > 0) this.stamina -= damage*1.25;
			else this.stamina -= 1.25;
			
			this.staminaRegenDelay = 80;

			if (this.stamina <= 0 || heavyAttack) {
				freezeFrame();
				this.unblock();
				this.canBlockDelay = 50;
				damage *= 10;
				knockbackVelocityX /= 0.8;
				knockbackVelocityX += 10;
				knockbackVelocityY += 8;
			}
			else knockbackVelocityY = 0;
		}

		// Initial Velocity Reset
		if (resetVelocity && !this.isBlocking && staggers) {
			this.velocity.x = 0;
			this.velocity.y = 0;
		}

		// Charge Attack Reset
		if (this.isChargeAttacking && staggers) {
			this.chargeAttackDelay = 0;
			this.isChargeAttacking = false;
		}

		// Others
		this.bounceNumber = 0;
		this.velocity.y -= knockbackVelocityY;
		if ((!this.isDashing && !staggers) || staggers) {
			if (direction == 'right') this.velocity.x += knockbackVelocityX;
			else if (direction == 'left') this.velocity.x -= knockbackVelocityX;
		}

		this.health -= damage;
		this.energyGain(damage*1.5);
		this.healthBarDelay = 30;
		if (!this.isBlocking && staggers) {
			this.isGrounded = false;
			this.isStaggered = true;
			this.teqDelay = 20;
			this.staggerDuration = 5;
			if (this.isDashing) this.acceleration.x = 0;

			if (direction == 'right') this.acceleration.x += knockbackAccelerationX;
			else if (direction == 'left') this.acceleration.x -= knockbackAccelerationX;

			let size ={
				width: 200,
				height: 200
			}
			let effect = new Effect(slash, size);
			effect.position = {
				x: this.position.x + (this.size.width - effect.size.width)/2,
				y: this.position.y + (this.size.height - effect.size.height)/2,
				rotation: Math.floor(Math.random()*360)
			}
			effect.spriteInfo.grid.col = 1;
		}
	}

	energyGain(damage) {
		this.energy += damage/60;
		this.attacks.ult.cooldown -= damage/8;
		if (this.attacks.ult.cooldown <= 0) this.attacks.ult.count = this.attacks.ult.countMax;
	}

	block() {
		if (this.canBlock && ((this.canMove && this.stamina > 0 && !this.isChargeAttacking) || (this.isStaggered && this.teqDelay === 0 && this.velocity.x**2 + this.velocity.y**2 < 400))) {
			this.isBlocking = true;
			this.isStaggered = false;
			this.staminaRegenDelay = 80;
		}
	}

	unblock() {
		if (this.isBlocking) {
			this.isBlocking = false;
			this.isStaggered = false;
			this.canMove = true;
			this.staggerDuration = 0;
		}
	}

	basicAttack() {
		if (this.attacks.basicAttack.count > 0) this.attacks.basicAttack.function(this, this.isAttacking.basicAttack);
	}

	upAttack() {
		if (this.attacks.upAttack.count > 0) this.attacks.upAttack.function(this, this.isAttacking.upAttack);
	}

	downAttack() {
		if (this.attacks.downAttack.count > 0) this.attacks.downAttack.function(this, this.isAttacking.downAttack);
	}

	comboBreaker() {
		if (this.attacks.comboBreaker.count > 0) this.attacks.comboBreaker.function(this, this.isAttacking.comboBreaker);
	}

	skill1() {
		if (this.attacks.skill1.count > 0) this.attacks.skill1.function(this, this.isAttacking.skill1);
	}

	skill2() {
		if (this.attacks.skill2.count > 0) this.attacks.skill2.function(this, this.isAttacking.skill2);
	}

	skill3() {
		if (this.attacks.skill3.count > 0) this.attacks.skill3.function(this, this.isAttacking.skill3);
	}

	skill4() {
		if (this.attacks.skill4.count > 0) this.attacks.skill4.function(this, this.isAttacking.skill4);
	}

	ult() {
		if (this.attacks.ult.count > 0) this.attacks.ult.function(this);
	}



	combat() {
		this.energy += 0.1;
		if (this.jumpCooldown > 0) this.jumpCooldown--;
		if ((this.isStaggered && this.staggerDuration > 0) || this.isBlocking || this.isDashing) this.canMove = false;
		else if (this.staggerDuration <= 0) {
			this.staggerDuration = 0;
			this.isStaggered = false;
			this.teqDelay = 0;
			this.canMove = true;
			this.bounceNumber = 0;
		}
		if (this.teqDelay > 0) this.teqDelay--;
		if (this.canBlockDelay > 0 || this.teqDelay > 0 || (this.isStaggered && this.velocity.x**2 + this.velocity.y**2 > 400)) {
			this.canBlock = false;
			this.canBlockDelay--;
		}
		else if (!this.canBlock) this.canBlock = true;
		this.canWallJump = false;

		if (this.isStaggered) this.forceUnStagger++;
		if (this.forceUnStagger > 600) {
			this.isStaggered = true;
			this.staggerDuration = 0;
			this.teqDelay = 0;
			this.forceUnStagger = 0;
		}

		if ((this.isBlocking || !this.isMoving && !this.isStaggered) && !this.isDashing) {
			if (this.isBlocking && this.stamina > 1) this.stamina -= 0.05;

			if (this.velocity.x > 1 || this.velocity.x < -1) this.velocity.x *= 0.9;
			else this.velocity.x = 0;

			if (this.stamina <= 0) this.unblock();
		}
		if (this.isStaggered) this.velocityResetFrames = 0;

		if (this.chargeAttackDelay > 0) {
			this.chargeAttackDelay--;
			this.isChargeAttacking = true;
		}
		else if (this.isChargeAttacking) {
			this.chargeAttackDelay = 0;
			this.isChargeAttacking = false;
		}

		let atkArray = [
			this.attacks.basicAttack,
			this.attacks.upAttack,
			this.attacks.downAttack,
			this.attacks.comboBreaker,
			this.attacks.skill1,
			this.attacks.skill2,
			this.attacks.skill3,
			this.attacks.skill4
		];

		for (let i in atkArray) {
			if (atkArray[i].cooldown > 0) atkArray[i].cooldown--;
			else if (atkArray[i].cooldown <= 0 && atkArray[i].count < atkArray[i].countMax) {
				atkArray[i].count += atkArray[i].countRegen;
				if (atkArray[i].count > atkArray[i].countMax) atkArray[i].count =atkArray[i].countMax;
				if (atkArray[i].count < atkArray[i].countMax) {
					atkArray[i].cooldown = atkArray[i].cooldownDuration;
				}
				else atkArray[i].cooldown = 0;
			}
		}
	}

	update() {
		this.ground();
		this.staminaGaugeRegen();
		this.combat();
		this.vectors();
		this.ground();
		this.draw();
	}
}













































// Objects
export const greenCat = {
	position: {
					x: 0,
					y: 0,
					rotation: 0
	},
	acceleration:	{
					x: 0,
					y: 0
				},
	velocity:	{
					x: 0,
					y: 0
				},
	stats: 		{
					health: 15000,
					speed: 10,
					jumpHeight: 15,
					dashSpeed: 10,
					dashPrice: 20
				},
	attacks: 	{
					basicAttack: greenCat_moveset.catSlash,
					upAttack: greenCat_moveset.catTheBatSmash,
					downAttack: greenCat_moveset.explosiveGodSlam,
					comboBreaker: greenCat_moveset.primalArmor,
					skill1: greenCat_moveset.ninjaStars,
					skill2: greenCat_moveset.assaultArmor,
					skill3: greenCat_moveset.multiSlash,
					skill4: greenCat_moveset.chorusJutsu,
					ult: {
						damage: 0,
						size: {
							width: 0,
							height: 0,
							radius: 80
						},
						offset: {
							x: 0,
							y: 20,
							rotation: 0
						},
						shape: 'circle',
						staminaCost: 0,
						energyCost: 0,
						cooldown: 0,
						cooldownDuration: 1000,
						count: 1,
						countMax: 1,
						countRegen: 1,
						function: (self) => {
			//self.attacks.ult.count--;
			ultimateFreeze(self);
			freezeFrame(80);
						}
					}, //
				},
	color: 'springGreen',
	spriteInfo: {
		sprite: {
			right: greenCat_sprite[0],
			left: greenCat_sprite[1]
		},
		size: {
			width: 100,
			height: 100
		},
		grid: {
			col: 0,
			row: 0
		},
		cycle: 1
	}
};



















export const rileyRoulette = {
	position: 	{
					x: 0,
					y: 0,
					rotation: 0
				},
	acceleration:	{
					x: 0,
					y: 0
				},
	velocity:	{
					x: 0,
					y: 0
				},
	stats: 		{
					health: 15000,
					speed: 8,
					jumpHeight: 15,
					dashSpeed: 10,
					dashPrice: 25
				},
	attacks: 	{
					basicAttack: rileyRoulette_moveset.tommyGun,
					upAttack: rileyRoulette_moveset.divineRevolver,
					downAttack: rileyRoulette_moveset.joyride,
					comboBreaker: rileyRoulette_moveset.voidScythe,
					skill1: rileyRoulette_moveset.angelWithAShotgun,
					skill2: rileyRoulette_moveset.bulletHell,
					skill3: rileyRoulette_moveset.gottschreck,
					skill4: rileyRoulette_moveset.macrossMissileMassacre,
					ult: {
						damage: 0,
						size: {
							width: 0,
							height: 0,
							radius: 0
						},
						offset: {
							x: 0,
							y: -50,
							rotation: 0
						},
						shape: 'none',
						staminaCost: 0,
						energyCost: 15,
						cooldown: 0,
						cooldownDuration: 500,
						count: 2,
						countMax: 2,
						countRegen: 1,
						function: (self) => {
			//self.attacks.ult.count--;
			ultimateFreeze(self);
			freezeFrame(80);
						}
					}, //

				},
	color: "wheat"
};





// Players
export const player1 = new Player(1, greenCat);
export const player2 = new Player(2, rileyRoulette);

player1.enemies = [player2];
player2.enemies = [player1];

player1.position = {
					x: 200,
					y: 466,
					rotation: 0
				};
player2.position = {
					x: 724,
					y: 466,
					rotation: 0
				};











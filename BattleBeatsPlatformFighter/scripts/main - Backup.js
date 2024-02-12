
// Essentials
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas_height = 576;
canvas_width = 1024;

canvas.height = canvas_height;
canvas.width = canvas_width;


// Universal Variables
const m = 50;
const gravity = 800;
const dashTime = 50;
const drag = 10;
var minions = [];
var projectiles = [];
var platforms = [];
var freezeFrames = 0;


// Classes
class Minion {
	constructor(player, {position, acceleration, velocity, size, extra, behavior, direction, color}) {
		this.position = position;
		this.acceleration = acceleration;
		this.velocity = velocity;
		this.size = size;
		this.extra = extra;
		this.behavior = behavior;
		this.direction = direction;
		this.color = color;
		this.player = player;

		// States
		this.isDestroyed = false;
		this.isIrrelevant = false;
		this.enemies = [];

		if (this.player === 1) this.enemies.push(player2);
		else if (this.player === 2) this.enemies.push(player1);
		minions.push(this)
	}

	draw() {
		c.fillStyle = this.color;
		c.translate(this.position.x+this.size.width/2, this.position.y+this.size.height/2);
		c.rotate(this.position.rotation * Math.PI / 180);
		c.fillRect(-this.size.width/2, -this.size.height/2, this.size.width, this.size.height);
		c.translate(0, 0);
		c.setTransform(1, 0, 0, 1, 0, 0);
	}

	vectors() {
		this.velocity.x += this.acceleration.x/1000;
		this.velocity.y += this.acceleration.y/1000;
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this.acceleration.x > 0) this.acceleration.x -= drag;
		else if (this.acceleration.x < 0) this.acceleration.x += drag;
		if (this.acceleration.y > 0) this.acceleration.y -= drag;
		else if (this.acceleration.y < 0) this.acceleration.y += drag;
	}

	action() {
		this.behavior(this, this.enemies);
	}

	update() {
		if (!this.isIrrelevant) {
			this.action();
			this.vectors();
			this.draw();
		}
	}
}



class Projectile {
	constructor(player, {position, acceleration, velocity, size, attackFunction, direction, color}) {

		// Variable Attributes
		this.position = position;
		this.acceleration = acceleration;
		this.velocity = {
			x: 0,
			y: 0
		};
		this.size = size;
		this.player = player;
		this.color = color;
		this.attackFunction = attackFunction;

		// State Attributes
		this.enemy;
		this.direction = direction;
		this.isDestroyed = false;
		this.isIrrelevant = false;
		projectiles.push(this);

		// Calcs
		if (this.player == 1) this.enemy = player2;
		else if (this.player == 2) this.enemy = player1;
	}

	draw() {
		if (this.position.x < -this.size.width || this.position.x > canvas_width || this.position.y < -canvas_height/2 || this.position.y > canvas_height) {
			this.isDestroyed = true;
			this.isIrrelevant = true;
		}
		this.platformPhysics();
		c.fillStyle = this.color;
		c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
	}

	vectors() {
		this.velocity.x += this.acceleration.x/1000;
		this.velocity.y += this.acceleration.y/1000;
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this.acceleration.x > 0) this.acceleration.x -= drag;
		else if (this.acceleration.x < 0) this.acceleration.x += drag;
		if (this.acceleration.y > 0) this.acceleration.y -= drag;
		else if (this.acceleration.y < 0) this.acceleration.y += drag;
	}

	platformPhysics() {
		let platform;
		for (i in platforms) {
			if (platforms[i].isHard) {
				platform = platforms[i];
				if (rectangularCollision(this, platform)) {
					this.isDestroyed = true;
					this.isIrrelevant = true;
				}
			}
		}
	}

	action() {
		this.attackFunction(this, this.enemy);
	}

	update() {
		if (!this.isIrrelevant) {
			this.action();
			this.vectors();
			this.draw();
		}
	}
}



class Platform {
	constructor({position, size, isHard, isPushable, behavior, color}) {
		this.position = position;
		this.size = size;
		this.isHard = isHard;
		this.isPushable = isPushable;
		this.behavior = behavior;
		this.color = color;

		this.entities = [player1, player2];
		platforms.push(this);
	}

	draw() {
		c.fillStyle = this.color;
		c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
	}

	action() {
		this.behavior(this, this.entities);
	}

	update() {
		this.action();
		this.draw();
	}
}


class Player {
	constructor(player, {position, acceleration, velocity, stats, attacks, color}) {

		// Variable Character Attributes
		this.health = stats.health;
		this.speed = stats.speed;
		this.jumpHeight = stats.jumpHeight;
		this.dashSpeed = stats.dashSpeed;
		this.dashPrice = stats.dashPrice;
		this.attacks = attacks;
		this.size = {
			width: 2*m,
			height: 2*m
		}

		// Other Variable Attributes
		this.position = position;
		this.acceleration = acceleration;
		this.velocity = velocity;
		this.player = player;
		this.color = color;

		// Constant Attributes
		this.maxHealth = this.health;
		this.jumpNumber = 2; // actually 2 lol
		this.jumpCooldown = 0;
		this.energy = 0;
		this.energyBar = this.energy;
		this.stamina = 100;
		this.staminaRegen = 3;
		this.staminaRegenDelay = 0;
		this.staminaBar = this.stamina;
		this.healthBar = this.health;
		this.healthBarDelay = 0;
		this.velocityResetFrames = 0;
		this.staggerDuration = 0;
		this.bounceNumber = 0;
		this.directionUpdateDelay = 0;
		this.drag = drag;

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
			basicAttack: false,
			upAttack: false,
			downAttack: false,
			skill1: false
		};
		this.chargeAttack;
		this.chargeAttackDelay = 0;
		this.isBlocking = false;
		this.isStaggered = false;
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
		let repeat; // Temporary Addition
		let cex;

		let sideX;
		let side;
		if (this.player === 1) side = 1;
		else if (this.player === 2) side = -1;

		this.platformPhysics();
		this.corrections();

		// HitBoxes
		if (this.isAttacking.basicAttack) this.drawHitbox(this.attacks.basicAttack);
		if (this.isAttacking.upAttack) this.drawHitbox(this.attacks.upAttack);
		if (this.isAttacking.downAttack) this.drawHitbox(this.attacks.downAttack);
		if (this.isAttacking.skill1) this.drawHitbox(this.attacks.skill1);
		if (this.isAttacking.skill2) this.drawHitbox(this.attacks.skill2);

		// Cooldowns
		this.drawCooldown(this.attacks.basicAttack, 0);
		this.drawCooldown(this.attacks.upAttack, 1);
		this.drawCooldown(this.attacks.downAttack, 2);
		this.drawCooldown(this.attacks.skill1, 3);
		this.drawCooldown(this.attacks.skill2, 4);

		// Player
		c.beginPath();
		c.fillStyle = 'white';
		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.font = '30px Arial';
		c.fillText(`P${this.player}`, this.position.x+this.size.width*0.5, this.position.y-15);
		c.closePath();

		// Character
		c.fillStyle = this.color;
		if (!this.isChargeAttacking) {
			if (!this.isGrounded) c.fillStyle = 'yellow';
			if (this.isBlocking) c.fillStyle = 'orange';
			if (this.isDashing) {
				c.fillStyle = 'lightBlue';
				if (this.direction == 'right') c.fillRect(this.position.x, this.position.y, -30, this.size.height);
				else if (this.direction == 'left') c.fillRect(this.position.x+this.size.width, this.position.y, 30, this.size.height);
			}
			if (this.isStaggered) c.fillStyle = 'indianRed';
		}
		c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);


		// Temporary Addition
		if (this.chargeAttackDelay > 0 && !this.attackDelayActive) {
			this.attackDelayActive = true;
			let col = this.color;
			repeat = setInterval( () => {
				if (this.chargeAttackDelay % 2 === 0) this.color = 'red';
				else this.color = 'white';

				if (this.chargeAttackDelay === 0 && this.attackDelayActive) {
					clearInterval(repeat);
					this.attackDelayActive = false;
					this.color = col;
				}
			}, 20)
		}

		

		// Eyes
		c.fillStyle = 'white';
		if (this.direction == 'right') sideX = this.size.width - 30;
		else if (this.direction == 'left') sideX = 10;
		c.fillRect(this.position.x+sideX, this.position.y+20, 20, 40);
		if (this.direction == 'right') sideX = this.size.width - 70;
		else if (this.direction == 'left') sideX = 50;
		c.fillRect(this.position.x+sideX, this.position.y+20, 20, 40);


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
		if (this.stamina < this.staminaBar) this.staminaBar -= 2;
		if (this.stamina > this.staminaBar) this.staminaBar += 2;
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
		if (this.position.x < 0 || this.position.x > this.borderX) {
			if (this.isStaggered) this.bounce();
			else this.canWallJump = true;
		}
		for (let i in platforms) {
			let platform = platforms[i];
			if (rectangularCollision(this, platform)) {
				if (this.isStaggered) {
					if ((this.velocity.y >= 0 && !platform.isHard && this.canBeGrounded) || platform.isHard) {
						if (this.position.y + this.size.height <= platform.position.y + this.velocity.y + 25) {
							this.bounceY();
						}
					}
					if (platform.isHard && (this.position.y + this.size.height != platform.position.y)) {
						if ((this.position.x + this.size.width > platform.position.x) && (this.position.x + this.size.width < platform.position.x + platform.size.width)) this.bounce();
						else if ((this.position.x < platform.position.x + platform.size.width) && (this.position.x + this.size.width > platform.position.x + platform.size.width)) this.bounce();
					}
				}
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
		if (this.position.x < 0) this.position.x = 0;
		if (this.position.x > this.borderX) this.position.x = canvas_width-this.size.width;
		if (this.position.y < -canvas_height/2) this.position.y = -canvas_height/2;
		if (this.position.y > this.borderY) this.position.y = canvas_height-this.size.height;
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
			this.directionUpdateDelay = 3;
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
			c.beginPath();
			if (this.direction == 'left') sideX = -atk.offset.x;
			else if (this.direction == 'right') sideX = this.size.width + atk.offset.x;
			c.arc(this.position.x+sideX, this.position.y+atk.offset.y, atk.size.radius, 0, Math.PI*2, false);
			c.fill();
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

		if (this.velocity.x**2 + this.velocity.y**2 > 100) {
			this.health -= (this.velocity.x**2 +this.velocity.y**2)*0.2;
			this.healthBarDelay = 30;
			this.staggerDuration = 5;
		}
	}

	bounceY() {
		this.bounceNumber++;
		this.acceleration.x *= 1 / this.bounceNumber*0.8;
		this.acceleration.y *= -1 / this.bounceNumber*0.8;
		this.velocity.x *= 1 / this.bounceNumber*0.8;
		this.velocity.y *= -1 / this.bounceNumber*0.8;

		if (this.velocity.x**2 + this.velocity.y**2 > 100) {
			this.health -= (this.velocity.x**2 +this.velocity.y**2)*0.2;
			this.healthBarDelay = 30;
			this.staggerDuration = 5;
		}
	}

	move(indicator) {
		if (this.canMove) {
			this.isMoving = true;
			if (this.isGrounded) {
				switch (indicator) {
					case 0:
						this.velocity.x = this.speed;
						break;
					case 1:
						this.velocity.x = -this.speed;
				}
			}
			else {
				switch (indicator) {
					case 0:
						this.velocity.x += this.speed*0.1;
						break;
					case 1:
						this.velocity.x -= this.speed*0.1;
				}

				if (this.velocity.x > this.speed) this.velocity.x = this.speed;
				else if (this.velocity.x < -this.speed) this.velocity.x = -this.speed;
			}
		}
	}

	fallDown() {
		for (i in platforms) {
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
		}
	}

	dash() {
		if ((this.stamina - this.dashPrice >= 0) && (this.staminaRegenDelay < 70) && this.canMove && !this.isStaggered) {
			this.directionUpdate();
			if (this.direction == 'right') this.acceleration.x += this.dashSpeed*400;
			else if (this.direction == 'left') this.acceleration.x -= this.dashSpeed*400;
			this.staminaRegenDelay = 80;
			this.stamina -= this.dashPrice;
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
		let knockbackAccelerationX = 300;
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
			this.chargeAttack = () => {};
			this.chargeAttackDelay = 0;
			this.isChargeAttacking = false;
		}

		// Others
		this.bounceNumber = 0;
		this.velocity.y -= knockbackVelocityY;
		if ((!this.isStaggered || !resetVelocity) && staggers) {
			if (direction == 'right') this.velocity.x = knockbackVelocityX;
			else if (direction == 'left') this.velocity.x = -knockbackVelocityX;
		}

		this.health -= damage;
		this.energyGain(damage*1.5);
		this.healthBarDelay = 30;
		if (!this.isBlocking && staggers) {
			this.isGrounded = false;
			this.isStaggered = true;
			this.staggerDuration = 5;
			if (this.isDashing) this.acceleration.x = 0;

			if (direction == 'right') this.acceleration.x += knockbackAccelerationX;
			else if (direction == 'left') this.acceleration.x -= knockbackAccelerationX;
		}
	}

	energyGain(damage) {
		this.energy += damage/60;
	}

	block() {
		if (this.canMove && this.stamina > 0 && !this.isChargeAttacking) {
			this.isBlocking = true;
			this.staminaRegenDelay = 80;
		}
	}

	unblock() {
		if (this.isBlocking) this.isBlocking = false;
	}

	basicAttack() {
		if (this.canMove && this.attacks.basicAttack.count > 0) this.attacks.basicAttack.function(this, this.enemies);
	}

	upAttack() {
		if (this.canMove && this.attacks.upAttack.count > 0) this.attacks.upAttack.function(this, this.enemies);
	}

	downAttack() {
		if (this.canMove && this.attacks.downAttack.count > 0) this.attacks.downAttack.function(this, this.enemies);
	}

	skill1() {
		if (this.canMove && this.attacks.skill1.count > 0) this.attacks.skill1.function(this, this.enemies);
	}

	skill2() {
		if (this.canMove && this.attacks.skill2.count > 0) this.attacks.skill2.function(this, this.enemies);
	}

	skill3() {
		
	}

	skill4() {
		
	}

	combat() {
		this.energy += 0.1;
		if (this.jumpCooldown > 0) this.jumpCooldown--;
		if ((this.isStaggered && this.staggerDuration > 0) || this.isBlocking || this.isDashing) this.canMove = false;
		else if (this.staggerDuration <= 0) {
			this.staggerDuration = 0;
			this.isStaggered = false;
			this.canMove = true;
			this.bounceNumber = 0;
		}
		this.canWallJump = false;

		if ((this.isBlocking || !this.isMoving && !this.isStaggered) && !this.isDashing) {
			if (this.isBlocking) this.stamina -= 0.05;

			if (this.velocity.x > 0.0001 || this.velocity.x < -0.0001) this.velocity.x *= 0.9;
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
			this.chargeAttack(this, this.enemies);
			this.chargeAttack = () => {};
			this.isChargeAttacking = false;
		}

		let atkArray = [
			this.attacks.basicAttack,
			this.attacks.upAttack,
			this.attacks.downAttack,
			this.attacks.skill1,
			this.attacks.skill2
		];

		for (let i in atkArray) {
			if (atkArray[i].cooldown > 0) atkArray[i].cooldown--;
			else if (atkArray[i].cooldown <= 0 && atkArray[i].count < atkArray[i].countMax) {
				atkArray[i].count += 1;
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


// Minions
const rileyRoulette_bulletOrbit = {
	position:	{
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
	size:		{
					width: 100,
					height: 20
				},
	extra: 		{	
					attackMode: 1, // 1 for follow, 2 for swarm, 3 for stay
					isStaying: false,
					offset: {
						x: 0,
						y: 0
					},
					reloadTime: 10,
					reloadDuration: 10
				},
	behavior: (self, enemies) => {
		let enemy;
		for (let i in enemies) enemy = enemies[i];
		let centerX = (self.position.x + self.size.width/2) - (enemy.position.x + enemy.size.width/2);
		let centerY = (self.position.y + self.size.height/2) - (enemy.position.y + enemy.size.height/2);
		let rot = Math.atan(centerY/centerX) * 180/Math.PI;

		let plyr;
		if (self.player === 1) plyr = player1;
		else if (self.player === 2) plyr = player2;

			// Movement
		if (self.extra.attackMode === 1) {
			self.position = {
				x: plyr.position.x + self.extra.offset.x,
				y: plyr.position.y + self.extra.offset.y,
				rotation: rot
			}
		}
		else if (self.extra.attackMode === 2) {
			if (!self.extra.isStaying) {
				let positionX;
				let positionY;
				let test;

				let zoomPos = setInterval( () => {
					do {
						let randomX = Math.floor(Math.random()*600 - 300);
						let randomY = Math.floor(Math.random()*600 - 300);
						positionX = enemy.position.x + enemy.size.width/2 + randomX;
						positionY = enemy.position.y + enemy.size.height/2 + randomY;

						test = {
							position: {
								x: positionX,
								y: positionY,
								rotation: 0
							},
							size: self.size
						}
					} while ((positionX < -self.size.width || positionX > canvas_width || positionY < -canvas_height/2 || positionY > canvas_height) || getDistance(enemy, test) < 250)
					
				}, 1000)

				let zoomMove = setInterval( () => {
					let flightSpeed = 10;
					if (getDistance({position: {x: positionX, y: positionY}}, self) < 100) flightSpeed = 1;
					console.log(getDistance({position: {x: positionX, y: positionY}}, self))
					if (self.position.x + self.size.width/2 < positionX) self.position.x += flightSpeed;
					else if (self.position.x + self.size.width/2 > positionX) self.position.x -= flightSpeed;
					if (self.position.y + self.size.height/2 < positionY) self.position.y += flightSpeed;
					else if (self.position.y + self.size.height/2 > positionY) self.position.y -= flightSpeed;

					if (self.isDestroyed) {
						self.extra.isStaying = false;
						clearInterval(zoomPos);
						clearInterval(zoomMove);
					}
				}, 1)
			}
			self.extra.isStaying = true;
			self.position.rotation = rot;
		}
		else if (self.extra.attackMode === 3) {
			if (!self.extra.isStaying) {
				self.position = {
					x: plyr.position.x + self.extra.offset.x,
					y: plyr.position.y + self.extra.offset.y,
					rotation: rot
				}
				self.extra.isStaying = true;
			}
			else self.position.rotation = rot;
		}

			// Attack
		if (self.extra.reloadTime === 0) {
			self.extra.reloadTime = self.extra.reloadDuration;
			let bullet = rileyRoulette_rifleShot;
			let speed = 30;
			let velocityX = Math.cos(self.position.rotation * Math.PI/180) * speed;
			let velocityY = Math.sin(self.position.rotation * Math.PI/180) * speed;

			if (self.position.x + (self.size.width - bullet.size.width)/2 >= enemy.position.x + enemy.size.width/2) {
				velocityX *= -1;
				velocityY *= -1;
			}

			if (velocityX >= 0) bullet.direction = 'right';
			else if (velocityX < 0) bullet.direction = 'left';

			bullet.position = {
				x: self.position.x + (self.size.width - bullet.size.width)/2,
				y: self.position.y + (self.size.height - bullet.size.height)/2,
				rotation: 0
			}

			bullet = new Projectile(plyr.player, bullet);
			bullet.velocity = {
				x: velocityX,
				y: velocityY
			}
			setTimeout( () => {
				self.isDestroyed = true;
				self.isIrrelevant = true;
			}, 8000)
		}
		else self.extra.reloadTime--;
	},
	direction: 'right',
	color: 'white'
}

// Projectiles
const greenCat_shuriken = {
	position:	{
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
	size:		{
					width: 20,
					height: 20
				},
	attackFunction: (self, enemy) => {
		let maxAcc = 300;
		let maxSpeed = 16;
		let centerX = (enemy.position.x + enemy.size.width/2) - self.position.x;
		let centerY = (enemy.position.y + enemy.size.height/2) - self.position.y;

		self.acceleration.x = centerX*2.5;
		if (self.acceleration.x > maxAcc) self.acceleration.x = maxAcc;
		else if (self.acceleration.x < -maxAcc) self.acceleration.x = -maxAcc;

		self.acceleration.y = centerY*2.5;
		if (self.acceleration.x > maxAcc) self.acceleration.x = maxAcc;
		else if (self.acceleration.x < -maxAcc) self.acceleration.x = -maxAcc;

		while (self.velocity.x**2 + self.velocity.y**2 > maxSpeed**2) {
			if (self.velocity.x > 0) self.velocity.x--;
			else if (self.velocity.x < 0) self.velocity.x++;

			if (self.velocity.y > 0) self.velocity.y--;
			else if (self.velocity.y < 0) self.velocity.y++;
		}
		if (self.velocity.x > 0) self.direction = 'right';
		else if (self.velocity.x < 0) self.direction = 'left';

		if (rectangularCollision(self, enemy)) {
			let damage = 120;
			enemy.bounceNumber = 0;
			enemy.tookDamage(damage, self.direction, true, Math.abs(self.velocity.x*0.8), Math.abs(self.velocity.y*0.8)+5);
			self.isDestroyed = true;
			self.isIrrelevant = true;
			if (enemy.player === 1) player2.energyGain(damage);
			else if (enemy.player === 2) player1.energyGain(damage);
		}
},
	direction: 'right',
	color: 'cyan'
}

const rileyRoulette_revolverShot = {
	position:	{
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
	size:		{
					width: 50,
					height: 50
				},
	attackFunction: (self, enemy) => {
		if (rectangularCollision(self, enemy)) {
			let damage = 250;
			enemy.bounceNumber = 0;
			enemy.tookDamage(damage, self.direction, false, Math.abs(self.velocity.x*0.5), Math.abs(self.velocity.y*0.5)+5);
			self.isDestroyed = true;
			self.isIrrelevant = true;
			if (enemy.player === 1) player2.energyGain(damage);
			else if (enemy.player === 2) player1.energyGain(damage);
		}
		setTimeout( () => {
			self.isDestroyed = true;
			self.isIrrelevant = true;
		}, 300)
},
	direction: 'right',
	color: 'orange'
}

const rileyRoulette_rifleShot = {
	position:	{
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
	size:		{
					width: 20,
					height: 20
				},
	attackFunction: (self, enemy) => {
		if (rectangularCollision(self, enemy)) {
			let damage = 12;
			enemy.bounceNumber = 0;
			enemy.tookDamage(damage, self.direction, false, 0, 0, false, false);
			self.isDestroyed = true;
			self.isIrrelevant = true;
			if (enemy.player === 1) player2.energyGain(damage);
			else if (enemy.player === 2) player1.energyGain(damage);
		}
},
	direction: 'right',
	color: 'red'
}


// Characters
const greenCat = {
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
					health: 10000,
					speed: 8,
					jumpHeight: 15,
					dashSpeed: 10,
					dashPrice: 33
				},
	attacks: 	{
					basicAttack: {
						damage: 100,
						size: {
							width: 60,
							height: 60,
							radius: 0
						},
						offset: {
							x: 0,
							y: 20,
							rotation: 0
						},
						shape: 'rectangle',
						staminaCost: 10,
						energyCost: 0,
						cooldown: 0,
						cooldownDuration: 10,
						count: 1,
						countMax: 1,
						function: (self, enemies) => {
			if ((self.stamina - self.attacks.basicAttack.staminaCost >= 0) && (self.energy - self.attacks.basicAttack.energyCost >= 0) && self.canMove && !self.isChargeAttacking) {
				let enemy;
				if (self.attacks.basicAttack.cooldown === 0) self.attacks.basicAttack.cooldown = self.attacks.basicAttack.cooldownDuration;
				self.directionUpdate();
				self.velocityResetFrames = 10;
				self.stamina -= self.attacks.basicAttack.staminaCost;
				self.energy -= self.attacks.basicAttack.energyCost;
				self.staminaRegenDelay = 80;
				self.attacks.basicAttack.count -= 1;
				if (self.direction == 'right') {
					self.position.x += 5;
					let attackBox = {
						position: {
							x: self.position.x + self.size.width,
							y: self.position.y + self.attacks.basicAttack.offset.y,
							rotation: self.attacks.basicAttack.offset.rotation
						},
						size: self.attacks.basicAttack.size
					}
					for (i in enemies) {
						if (rectangularCollision(attackBox, enemies[i])) {
							enemy = enemies[i];
							if (rectangularCollision(attackBox, enemy)) {
								// Snapping
								if (self.position.x+self.size.width < enemy.position.x) {
									self.position.x = enemy.position.x - self.size.width;
								}
								if (self.position.y != enemy.position.y) {
									self.position.y = enemy.position.y;
								}
								// Other stuff
								enemy.tookDamage(self.attacks.basicAttack.damage, 'right');
								self.energyGain(self.attacks.basicAttack.damage);
							}
						}
					}	
				}
				else if (self.direction == 'left') {
					self.position.x -= 5;
					let attackBox = {
						position: {
							x: self.position.x - self.attacks.basicAttack.size.width,
							y: self.position.y + self.attacks.basicAttack.offset.y,
							rotation: self.attacks.basicAttack.offset.rotation
						},
						size: self.attacks.basicAttack.size
					}
					for (i in enemies) {
						if (rectangularCollision(attackBox, enemies[i])) {
							enemy = enemies[i];
							if (rectangularCollision(attackBox, enemy)) {
								// Snapping
								if (self.position.x > enemy.position.x+self.size.width) {
									self.position.x = enemy.position.x + self.size.width;
								}
								if (self.position.y != enemy.position.y) {
									self.position.y = enemy.position.y;
								}
								// Other stuff
								enemy.tookDamage(self.attacks.basicAttack.damage, 'left');
								self.energyGain(self.attacks.basicAttack.damage);
							}
						}
					}
							
				}

				self.isAttacking.basicAttack = true;
				setTimeout(() => {
					self.isAttacking.basicAttack = false;
				}, 100);
			}
						}
					}, //
					upAttack: {
						damage: 250,
						size: {
							width: 100,
							height: 150,
							radius: 0
						},
						offset: {
							x: -60,
							y: -80,
							rotation: 0
						},
						shape: 'rectangle',
						staminaCost: 20,
						energyCost: 25,
						cooldown: 0,
						cooldownDuration: 250,
						count: 1,
						countMax: 1,
						function: (self, enemies) => {
			if ((self.stamina - self.attacks.upAttack.staminaCost >= 0) && (self.energy - self.attacks.upAttack.energyCost >= 0) && self.canMove && !self.isChargeAttacking) {
				let enemy;
				if (self.attacks.upAttack.cooldown === 0) self.attacks.upAttack.cooldown = self.attacks.upAttack.cooldownDuration;
				self.directionUpdate();
				self.velocityResetFrames = 10;
				self.stamina -= self.attacks.upAttack.staminaCost;
				self.energy -= self.attacks.upAttack.energyCost;
				self.staminaRegenDelay = 80;
				self.attacks.upAttack.count -= 1; 
				if (self.direction == 'right') {
					self.position.x += 5;
					let attackBox = {
						position: {
							x: self.position.x + self.size.width + self.attacks.upAttack.offset.x,
							y: self.position.y + self.attacks.upAttack.offset.y,
							rotation: self.attacks.upAttack.offset.rotation
						},
						size: self.attacks.upAttack.size
					}
					for (i in enemies) {
						if (rectangularCollision(attackBox, enemies[i])) {
							enemy = enemies[i];
							if (rectangularCollision(attackBox, enemy)) {
								enemy.tookDamage(self.attacks.upAttack.damage, 'right', false, 2, 20);
								self.energyGain(self.attacks.upAttack.damage);
							}
						}
					}	
				}
				else if (self.direction == 'left') {
					self.position.x -= 5;
					let attackBox = {
						position: {
							x: self.position.x - self.attacks.upAttack.size.width - self.attacks.upAttack.offset.x,
							y: self.position.y + self.attacks.upAttack.offset.y,
							rotation: self.attacks.upAttack.offset.rotation
						},
						size: self.attacks.upAttack.size
					}
					for (i in enemies) {
						if (rectangularCollision(attackBox, enemies[i])) {
							enemy = enemies[i];
							if (rectangularCollision(attackBox, enemy)) {
								enemy.tookDamage(self.attacks.upAttack.damage, 'left', false, 2, 20);
								self.energyGain(self.attacks.upAttack.damage);
							}
						}
					}		
				}

				self.isAttacking.upAttack = true;
				setTimeout(() => {
					self.isAttacking.upAttack = false;
				}, 100);
			}
						}
					}, downAttack: {
						damage: 150,
						size: {
							width: 300,
							height: 40,
							radius: 0
						},
						offset: {
							x: -200,
							y: 60,
							rotation: 0
						},
						shape: 'rectangle',
						staminaCost: 15,
						energyCost: 20,
						cooldown: 0,
						cooldownDuration: 250,
						count: 1,
						countMax: 1,
						function: (self, enemies) => {
			if ((self.stamina - self.attacks.downAttack.staminaCost >= 0) && (self.energy - self.attacks.downAttack.energyCost >= 0) && self.canMove && !self.isChargeAttacking && !self.isGrounded) {
				let enemy;
				if (self.attacks.downAttack.cooldown === 0) self.attacks.downAttack.cooldown = self.attacks.downAttack.cooldownDuration;
				self.velocityResetFrames = 5;
				self.stamina -= self.attacks.downAttack.staminaCost;
				self.energy -= self.attacks.downAttack.energyCost;
				self.staminaRegenDelay = 80;
				self.attacks.downAttack.count -= 1; 

				let s = setInterval( () => {
					self.velocity.x = 0;
					self.velocity.y = 50;
					self.canMove = false;

					if (self.isGrounded) {
						let attackBox = {
							position: {
								x: self.position.x + self.attacks.downAttack.offset.x + self.size.width,
								y: self.position.y + self.attacks.downAttack.offset.y,
								rotation: self.attacks.downAttack.offset.rotation
							},
							size: self.attacks.downAttack.size
						}
						self.isAttacking.downAttack = true;
						for (i in enemies) {
							if (rectangularCollision(attackBox, enemies[i])) {
								enemy = enemies[i];
								if (rectangularCollision(attackBox, enemy)) {
									let direction;
									if (enemy.position.x > self.position.x) direction = 'right';
									else if (enemy.position.x < self.position.x) direction = 'left';
									else {
										if (enemy.position.x > canvas_width/2) direction = 'right';
										else direction = 'left';
									}
									enemy.tookDamage(self.attacks.downAttack.damage, direction, true, 2, 20, true);
									self.energyGain(self.attacks.downAttack.damage);
								}
							}
						}
						setTimeout( () => {
							self.isAttacking.downAttack = false;
							self.velocity.y = 0;
						}, 100)
						clearInterval(s);
					}
				}, 100)
			}
						}
					}, //
					skill1: {
						damage: 0,
						size: {
							width: 0,
							height: 0,
							radius: 0
						},
						offset: {
							x: 0,
							y: 20,
							rotation: 0
						},
						shape: 'none',
						staminaCost: 0,
						energyCost: 15,
						cooldown: 0,
						cooldownDuration: 400,
						count: 1,
						countMax: 1,
						function: (self, enemies) => {
			if ((self.stamina - self.dashPrice >= 0) && (self.energy - self.attacks.skill1.energyCost >= 0) && self.canMove && !self.isChargeAttacking) {
				let bullet = greenCat_shuriken;
				let speed = -6;
				if (self.attacks.skill1.cooldown === 0) self.attacks.skill1.cooldown = self.attacks.skill1.cooldownDuration;
				self.stamina -= self.attacks.skill1.staminaCost;
				self.energy -= self.attacks.skill1.energyCost;
				self.staminaRegenDelay = 80;
				self.attacks.skill1.count -= 1;

				if (self.player === 1) keys.shiftL.pressed = true;
				else if (self.player === 2) keys.shiftR.pressed = true;
				
				bullet.direction = self.direction;
				setTimeout( () => {
					let shots = setInterval( () => {
						let result;
						bullet.position = {
							x: self.position.x,
							y: self.position.y + self.attacks.skill1.offset.y
						}
						result = new Projectile(self.player, bullet);
						result.velocity = {
							x: 0,
							y: speed
						};
					}, 60)
					setTimeout(() => {
						clearInterval(shots);
						if (self.player === 1) keys.shiftL.pressed = false;
						else if (self.player === 2) keys.shiftR.pressed = false;
					}, 200)
				}, 200)
							}
						}
					}, //
					skill2: {
						damage: 500,
						size: {
							width: 0,
							height: 0,
							radius: 200
						},
						offset: {
							x: -50,
							y: 50,
							rotation: 0
						},
						shape: 'circle',
						staminaCost: 0,
						energyCost: 65,
						cooldown: 0,
						cooldownDuration: 700,
						count: 1,
						countMax: 1,
						function: (self, enemies) => {
			if ((self.stamina - self.attacks.skill2.staminaCost >= 0) && (self.energy - self.attacks.skill2.energyCost >= 0) && self.canMove || self.isChargeAttacking) {
				if (!self.isChargeAttacking) {
					if (self.attacks.skill2.cooldown === 0) self.attacks.skill2.cooldown = self.attacks.skill2.cooldownDuration;
					self.stamina -= self.attacks.skill2.staminaCost;
					self.energy -= self.attacks.skill2.energyCost;
					self.staminaRegenDelay = 80;
					self.attacks.skill2.count -= 1;
					self.chargeAttack = self.attacks.skill2.function;
					self.chargeAttackDelay = 80;
					self.isChargeAttacking = true;
				}

				if (self.isChargeAttacking && self.chargeAttackDelay <= 0) {
					let enemy;
					let direction;
					let knockbackPower = 30;
					let bubble = {
						position: {
							x: self.position.x + self.size.width/2,
							y: self.position.y + self.size.height/2,
							rotation: 0
						}
					}
					let radius = self.attacks.skill2.size.radius;
					for (let i in enemies) {
						enemy = enemies[i];
						radius += (enemy.size.height + enemy.size.width)*0.5;
						enemyBubble = {
							position: {
								x: enemy.position.x + enemy.size.width/2,
								y: enemy.position.y + enemy.size.height/2,
								rotation: 0
							}
						}
						if (getDistance(bubble, enemyBubble) <= radius) {
							if (enemyBubble.position.x < bubble.position.x) direction = 'left';
							else direction = 'right';
							let angle = Math.atan((enemyBubble.position.y - bubble.position.y)/(enemyBubble.position.x - bubble.position.x));
							enemy.tookDamage(self.attacks.skill2.damage, direction, true, Math.cos(angle)*knockbackPower+10,Math.sin(angle+Math.PI/6)*knockbackPower, true);
						}
					}
					for (let i in minions) {
						enemy = minions[i];
						radius += (enemy.size.height + enemy.size.width)*0.5;
						enemyBubble = {
							position: {
								x: enemy.position.x + enemy.size.width/2,
								y: enemy.position.y + enemy.size.height/2,
								rotation: 0
							}
						}
						if (getDistance(bubble, enemyBubble) <= radius && !enemy.isDestroyed) {
							enemy.isDestroyed = true;
							enemy.isIrrelevant = true;
						}
					}
					for (let i in projectiles) {
						enemy = projectiles[i];
						radius += (enemy.size.height + enemy.size.width)*0.5;
						enemyBubble = {
							position: {
								x: enemy.position.x + enemy.size.width/2,
								y: enemy.position.y + enemy.size.height/2,
								rotation: 0
							},
							size: {
								width: 0,
								height: 0
							}
						}
						if (getDistance(bubble, enemyBubble) <= radius && !enemy.isDestroyed) {
							enemy.isDestroyed = true;
							enemy.isIrrelevant = true;
						}
					}

					self.isAttacking.skill2 = true;
					self.isMoving = false;
					self.canMove = false;

					let shield = setInterval( () => {
						if (self.player === 1) keys.tab.pressed = true;
						else if (self.player === 2) keys.enter.pressed = true;
					}, 10)
					screenShake();
					setTimeout( () => {
						self.isAttacking.skill2 = false;
						clearInterval(shield);
						if (self.player === 1) keys.tab.pressed = false;
						else if (self.player === 2) keys.enter.pressed = false;
					}, 400)
				}
			}
						}
					} //
				},
	color: 'springGreen'
};

const rileyRoulette = {
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
					health: 10000,
					speed: 6,
					jumpHeight: 15,
					dashSpeed: 8,
					dashPrice: 50
				},
	attacks: 	{
					basicAttack: {
						damage: 0,
						size: {
							width: 100,
							height: 20,
							radius: 0
						},
						offset: {
							x: -100,
							y: -25,
							rotation: 0
						},
						shape: 'rectangle',
						staminaCost: 2,
						energyCost: 0,
						cooldown: 0,
						cooldownDuration: 10,
						count: 60,
						countMax: 60,
						function: (self, enemies) => {
		if (self.attacks.basicAttack.cooldown < 8 && (self.stamina - self.attacks.basicAttack.staminaCost >= 0) && (self.energy - self.attacks.basicAttack.energyCost >= 0) && self.canMove && !self.isChargeAttacking) {
			self.attacks.basicAttack.cooldown = self.attacks.basicAttack.cooldownDuration;
			self.stamina -= self.attacks.basicAttack.staminaCost;
			self.energy -= self.attacks.basicAttack.energyCost;
			self.staminaRegenDelay = 80;
			self.attacks.basicAttack.count -= 1;
			let enemy = enemies[0];
			let bullet = rileyRoulette_rifleShot;
			let speed = 30;
			let centerX = (self.position.x + self.size.width/2) - (enemy.position.x + enemy.size.width/2);
			let centerY = (self.position.y + self.size.height/2) - (enemy.position.y + enemy.size.height/2);
			let rot = Math.atan(centerY/centerX) * 180/Math.PI;

			let velocityX = Math.cos(rot * Math.PI/180) * speed;
			let velocityY = Math.sin(rot * Math.PI/180) * speed;
			self.attacks.basicAttack.offset.rotation = rot;

			if (bullet.velocity.x > 0) bullet.direction = 'right';
			else if (bullet.velocity.x < 0) bullet.direction = 'left';

			if ((enemy.position.x + enemy.size.width/2) < (self.position.x + self.size.width/2)) {
				velocityX *= -1;
				velocityY *= -1;
				self.directionUpdate(true, 'left');
			}
			else self.directionUpdate(true, 'right');

			bullet.position = {
				x: self.position.x + self.size.width/2,
				y: self.position.y + self.size.height/2
			}
			bullet = new Projectile(self.player, bullet);
			bullet.velocity = {
				x: velocityX,
				y: velocityY
			};
			if (bullet.velocity.x > 0) bullet.direction = 'right';
			else if (bullet.velocity.x < 0) bullet.direction = 'left';
		}
						}
					}, //
					upAttack: {
						damage: 0,
						size: {
							width: 0,
							height: 0,
							radius: 0
						},
						offset: {
							x: 0,
							y: -60,
							rotation: 0
						},
						shape: 'none',
						staminaCost: 15,
						energyCost: 15,
						cooldown: 0,
						cooldownDuration: 300,
						count: 1,
						countMax: 1,
						function: (self, enemies) => {
		if ((self.stamina - self.attacks.upAttack.staminaCost >= 0) && (self.energy - self.attacks.upAttack.energyCost >= 0) && !self.isChargeAttacking) {
			if (self.attacks.upAttack.cooldown === 0)self.attacks.upAttack.cooldown = self.attacks.upAttack.cooldownDuration;
			self.directionUpdate();
			self.stamina -= self.attacks.upAttack.staminaCost;
			self.energy -= self.attacks.upAttack.energyCost;
			self.staminaRegenDelay = 80;
			self.attacks.upAttack.count -= 1;
			let bullet = rileyRoulette_revolverShot;
			let speed = 30;
			let sideX;
			let side;
			let velocityX = 14;
			let velocityY = -((speed**2 - velocityX**2)**0.5);

			self.velocity.y = -5;
			if (self.direction == "right") {
				velocityX = speed*Math.cos(Math.PI*0.25);
				velocityY = -speed*Math.sin(Math.PI*0.25);
				sideX = self.size.width;
			}
			if (self.direction == "left") {
				velocityX = -speed*Math.cos(Math.PI*0.25);
				velocityY = -speed*Math.sin(Math.PI*0.25);
				sideX = -rileyRoulette_revolverShot.size.width;
			}
			bullet.direction = self.direction;

			bullet.position = {
				x: self.position.x + sideX,
				y: self.position.y + self.attacks.upAttack.offset.y
			}
			bullet = new Projectile(self.player, bullet);
			bullet.velocity = {
				x: velocityX,
				y: velocityY
			};

			let stop = setInterval( () => {
				self.isMoving = false;
				if (self.direction == 'right') self.velocity.x = -10;
				else if (self.direction == 'left') self.velocity.x = 10;
			}, 1)
			setTimeout(() => {
				clearInterval(stop)
			}, 200);
		}
						}
					}, //
					downAttack: {
						damage: 50,
						size: {
							width: 80,
							height: 300,
							radius: 0
						},
						offset: {
							x: -90,
							y: 100,
							rotation: 0
						},
						shape: 'rectangle',
						staminaCost: 20,
						energyCost: 30,
						cooldown: 0,
						cooldownDuration: 400,
						count: 1,
						countMax: 1,
						function: (self, enemies) => {
		if ((self.stamina - self.attacks.downAttack.staminaCost >= 0) && (self.energy - self.attacks.downAttack.energyCost >= 0) && !self.isGrounded && !self.isChargeAttacking) {
			if (self.attacks.downAttack.cooldown === 0) self.attacks.downAttack.cooldown = self.attacks.downAttack.cooldownDuration;
			self.stamina -= self.attacks.downAttack.staminaCost;
			self.energy -= self.attacks.downAttack.energyCost;
			self.staminaRegenDelay = 80;
			self.attacks.downAttack.count -= 1;
			let enemy;
			let velocityX = self.velocity.x;
			self.isAttacking.downAttack = true;

			let shots = setInterval( () => {
				self.velocity.y = -5;
				self.velocity.x = velocityX;
				for (i in enemies) {
					let attackBox = {
						position: {
							x: self.position.x + 10,
							y: self.position.y + self.size.height
						},
						size: self.attacks.downAttack.size
					}
					if (rectangularCollision(attackBox, enemies[i])) {
						enemy = enemies[i];
						enemy.tookDamage(self.attacks.downAttack.damage, self.direction);
						self.energyGain(self.attacks.downAttack.damage);
						if (self.direction == 'right') enemy.velocity.x = 10;
						else if (self.direction == 'left') enemy.velocity.x = -10;
					}
				}
			}, 50);
			setTimeout(() => {
				clearInterval(shots);
				self.isAttacking.downAttack = false;
			}, 400);
		}
						}
					}, //
					skill1: {
						damage: 300,
						size: {
							width: 140,
							height: 120,
							radius: 0
						},
						offset: {
							x: 0,
							y: -10,
							rotation: 0
						},
						shape: 'rectangle',
						staminaCost: 40,
						energyCost: 10,
						cooldown: 0,
						cooldownDuration: 300,
						count: 1,
						countMax: 1,
						function: (self, enemies) => {
		if (((self.stamina - self.attacks.skill1.staminaCost >= 0) && (self.energy - self.attacks.skill1.energyCost >= 0)) || self.isChargeAttacking) {
			if (!self.isChargeAttacking) {
				self.isChargeAttacking = true;
				self.chargeAttack = self.attacks.skill1.function;
				self.chargeAttackDelay = 40;
				if (self.attacks.skill1.cooldown === 0) self.attacks.skill1.cooldown = self.attacks.skill1.cooldownDuration;
				self.stamina -= self.attacks.skill1.staminaCost;
				self.energy -= self.attacks.skill1.energyCost;
				self.attacks.skill1.count -= 1;
			}
			self.staminaRegenDelay = 80;
			let enemy;
			let sideX;

			if (self.chargeAttackDelay <= 0) {
				let stop = setInterval( () => {
					self.canMove = false;
					self.isMoving = false;

					if (self.direction == 'right') self.velocity.x = -10;
					else if (self.direction == 'left') self.velocity.x = 10;
				}, 1)

				self.directionUpdate();
				self.isAttacking.skill1 = true;
				if (!self.isGrounded) self.velocity.y = -8;

				if (self.direction == 'right') sideX = self.size.width + self.attacks.skill1.offset.x;
				else if (self.direction == 'left') sideX = -self.attacks.skill1.size.width - self.attacks.skill1.offset.x;

				for (i in enemies) {
					let attackBox = {
						position: {
							x: self.position.x + sideX,
							y: self.position.y + self.attacks.skill1.offset.y
						},
						size: self.attacks.skill1.size
					}
					if (rectangularCollision(attackBox, enemies[i])) {
						enemy = enemies[i];
						if (self.direction == 'right') sideX = 10;
						else if (self.direction == 'left') sideX = -10;

						enemy.tookDamage(self.attacks.skill1.damage, self.direction, false, 10, 10, true);
						self.energyGain(self.attacks.skill1.damage);
					}
				}
				setTimeout( () => {
					self.isAttacking.skill1 = false;
					clearInterval(stop)
				}, 50)

				setTimeout( () => {
					let stop = setInterval( () => {
						self.canMove = false;
						self.isMoving = false;

						if (self.direction == 'right') self.velocity.x = -10;
						else if (self.direction == 'left') self.velocity.x = 10;
					}, 1)

					self.directionUpdate();
					self.isAttacking.skill1 = true;
					if (!self.isGrounded) self.velocity.y = -8;

					if (self.direction == 'right')	sideX = self.size.width + self.attacks.skill1.offset.x;
					else if (self.direction == 'left') sideX = -self.attacks.skill1.size.width - self.attacks.skill1.offset.x;

					for (i in enemies) {
						let attackBox = {
							position: {
								x: self.position.x + sideX,
								y: self.position.y + self.attacks.skill1.offset.y
							},
							size: self.attacks.skill1.size
						}
						if (rectangularCollision(attackBox, enemies[i])) {
							enemy = enemies[i];
							if (self.direction == 'right') sideX = 10;
							else if (self.direction == 'left') sideX = -10;

							enemy.tookDamage(self.attacks.skill1.damage, self.direction, false, 10, 10);
							self.energyGain(self.attacks.skill1.damage);
						}
					}
					setTimeout( () => {
						self.isAttacking.skill1 = false;
						clearInterval(stop);
					}, 50)
				}, 300);
			}
		}
						}
					}, //
					skill2: {
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
						function: (self, enemies) => {
		if (self.attacks.skill2.cooldown < 480 && (self.stamina - self.attacks.skill2.staminaCost >= 0) && (self.energy - self.attacks.skill2.energyCost >= 0)) {
			if (self.attacks.skill2.cooldown === 0) self.attacks.skill2.cooldown = self.attacks.skill2.cooldownDuration;
			self.stamina -= self.attacks.skill2.staminaCost;
			self.energy -= self.attacks.skill2.energyCost;
			self.staminaRegenDelay = 80;
			self.attacks.skill2.count -= 1;

			let gun = rileyRoulette_bulletOrbit;
			gun.extra = {
				attackMode: 2, // 1 for follow, 2 for swarm, 3 for stay
				isStaying: false,
				offset: {
					x: 0,
					y: 0
				},
				reloadTime: 10,
				reloadDuration: 10
			}
			gun.position = {
				x: self.position.x,
				y: self.position.y + self.attacks.skill2.offset.y,
				rotation: 0
			}
			gun = new Minion(self.player, gun);
		}
						}
					}, //
				},
	color: "wheat"
};

// Platforms
const genericPlatform = {
	behavior: (platform, entities) => {
		
	}
}



// Players
const player1 = new Player(1, greenCat);
const player2 = new Player(2, rileyRoulette);

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



// Level
var platform1 = new Platform({
	position: {
		x: 0,
		y: 566
	},
	size: {
		width: canvas_width,
		height: 10
	},
	isHard: true,
	isPushable: false,
	behavior: genericPlatform.behavior,
	color: 'lightGray'
});
var platform3 = new Platform({
	position: {
		x: canvas_width/2 - 125,
		y: 320
	},
	size: {
		width: 250,
		height: 20
	},
	isHard: false,
	isPushable: false,
	behavior: genericPlatform.behavior,
	color: 'lightGray'
});



// Animation Frames
const keys = {
	// Player 1 Keys
		// Movement
	w: {pressed: false},
	a: {pressed: false},
	s: {pressed: false},
	d: {pressed: false},
	shiftL: {pressed: false},
		// Attacks
	tab: {pressed: false},
	f: {pressed: false},
	g: {pressed: false},
		// Skills
	e: {pressed: false},
	r: {pressed: false},
	

	// Player 2 Keys
		// Movement
	up: {pressed: false},
	left: {pressed: false},
	down: {pressed: false},
	right: {pressed: false},
	shiftR: {pressed: false},
		// Attacks
	enter: {pressed: false},
	slash: {pressed: false},
	period: {pressed: false},
		// SKills
	quote: {pressed: false},
	semiColon: {pressed: false}
	
};

function rectangularCollision(object1, object2) {
	return (
		((object1.position.x+object1.size.width >= object2.position.x) &&
		(object1.position.y+object1.size.height >= object2.position.y))
		&&
		((object2.position.x+object2.size.width >= object1.position.x) &&
		(object2.position.y+object2.size.height >= object1.position.y))
	)
}

function freezeFrame() {
	freezeFrames = 40;
	screenShake();
}

function screenShake() {
	let ran1;
	let ran2;

	let shake = setInterval( () => {
		ran1 = Math.random()*20 - 10;
		ran2 = Math.random()*20 - 10;
		c.translate(ran1, ran2);
	}, 10)
	let unshake = setInterval( () => {
		c.setTransform(1, 0, 0, 1, 0, 0);
	}, 11)
	setTimeout( () => {
		clearInterval(shake);
		clearInterval(unshake);
		c.setTransform(1, 0, 0, 1, 0, 0);
	}, 1200);
}

function getDistance(object1, object2) {
	return ((object1.position.x-object2.position.x)**2 + (object1.position.y-object2.position.y)**2)**0.5;
}

function animate() {
	window.requestAnimationFrame(animate);

	if (freezeFrames === 0) {
		c.clearRect(0, 0, canvas.width, canvas.height);
		c.fillStyle = "black";
		c.fillRect(0, 0, canvas.width, canvas.height);

		for (i in platforms) platforms[i].update();
		for (i in projectiles) projectiles[i].update();
		for (i in minions) minions[i].update();

		player1.update();
		player2.update();

		

		// Player 1 Keys
		if (player1.isGrounded && player1.canMove) {
			if (!keys.a.pressed || !keys.d.pressed) player1.isMoving = false;
			player1.directionUpdate();
		}
		if (keys.s.pressed && keys.g.pressed) player1.downAttack();
		else {
			if (keys.g.pressed) setTimeout(player1.upAttack(), 10);
			if (keys.s.pressed) setTimeout(player1.fallDown(), 10);
		}
		if (!keys.tab.pressed) player1.unblock();
		else player1.block();
		if (keys.d.pressed && player1.lastkey == 'd') player1.move(0);
		if (keys.a.pressed && player1.lastkey == 'a') player1.move(1);
		if (keys.w.pressed) player1.jump();
		if (keys.shiftL.pressed) player1.dash();
		if (keys.f.pressed) setTimeout(player1.basicAttack(), 10);
		if (keys.e.pressed) setTimeout(player1.skill1(), 10);
		if (keys.r.pressed) setTimeout(player1.skill2(), 10);


		// Player 2 Keys
		if (player2.isGrounded && player2.canMove) {
			if (!keys.left.pressed || !keys.right.pressed) player2.isMoving = false;
			player2.directionUpdate();
		}
		if (keys.down.pressed && keys.period.pressed) player2.downAttack();
		else {
			if (keys.period.pressed) setTimeout(player2.upAttack(), 10);
			if (keys.down.pressed) setTimeout(player2.fallDown(), 10);
		}
		if (!keys.enter.pressed) player2.unblock();
		else player2.block();
		if (keys.right.pressed && player2.lastkey == 'right') player2.move(0);
		if (keys.left.pressed && player2.lastkey == 'left') player2.move(1);
		if (keys.up.pressed) player2.jump();
		if (keys.shiftR.pressed) player2.dash();
		if (keys.slash.pressed) setTimeout(player2.basicAttack(), 10);
		if (keys.quote.pressed) setTimeout(player2.skill1(), 10);
		if (keys.semiColon.pressed) setTimeout(player2.skill2(), 10);
	}
	else freezeFrames--;
}
animate();


// Input
document.addEventListener('keydown', (e) => {
	e.preventDefault();
	// Player 1 Input
		// Movement
	if (e.code == "KeyD") {
		keys.d.pressed = true;
		player1.lastkey = 'd';
	}
	if (e.code == "KeyA") {
		keys.a.pressed = true;
		player1.lastkey = 'a';
	}
	if (e.code == "KeyW") keys.w.pressed = true;
	if (e.code == 'KeyS') keys.s.pressed = true;
	if (e.code == 'ShiftLeft') keys.shiftL.pressed = true;
		// Attacks
	if (e.code == 'Tab') keys.tab.pressed = true;
	if (e.code == 'KeyF') keys.f.pressed = true;
	if (e.code == 'KeyG') keys.g.pressed = true;
		// Skills
	if (e.code == 'KeyE') keys.e.pressed = true;
	if (e.code == 'KeyR') keys.r.pressed = true;
	

	// Player 2 Input
		// Movement
	if (e.code == "ArrowRight") {
		keys.right.pressed = true;
		player2.lastkey = 'right';
	}
	if (e.code == "ArrowLeft") {
		keys.left.pressed = true;
		player2.lastkey = 'left';
	}
	if (e.code == "ArrowUp") keys.up.pressed = true;
	if (e.code == 'ArrowDown') keys.down.pressed = true;
	if (e.code == 'ShiftRight') keys.shiftR.pressed = true;
		// Attacks
	if (e.code == 'Enter') keys.enter.pressed = true;
	if (e.code == 'Slash') keys.slash.pressed = true;
	if (e.code == 'Period') keys.period.pressed = true;
		// Skills
	if (e.code == 'Quote') keys.quote.pressed = true;
	if (e.code == 'Semicolon') keys.semiColon.pressed = true;
});

document.addEventListener('keyup', (e) => {
	// Player 1 Input
		// Movement
	if (e.code == "KeyD") {
		keys.d.pressed = false;
		if (keys.a.pressed) player1.lastkey = 'a';
	}
	if (e.code == "KeyA") {
		keys.a.pressed = false;
		if (keys.d.pressed) player1.lastkey = 'd';
	}
	if (e.code == "KeyW") keys.w.pressed = false;
	if (e.code == 'KeyS') keys.s.pressed = false;
	if (e.code == 'ShiftLeft') keys.shiftL.pressed = false;
		// Attacks
	if (e.code == 'Tab') keys.tab.pressed = false;
	if (e.code == 'KeyF') keys.f.pressed = false;
	if (e.code == 'KeyG') keys.g.pressed = false;
		// Skills
	if (e.code == 'KeyE') keys.e.pressed = false;
	if (e.code == 'KeyR') keys.r.pressed = false;

	// Player 2 Input
		// Movement
	if (e.code == "ArrowRight") {
		keys.right.pressed = false;
		if (keys.left.pressed) player2.lastkey = 'left';
	}
	if (e.code == "ArrowLeft") {
		keys.left.pressed = false;
		if (keys.right.pressed) player2.lastkey = 'right';
	}
	if (e.code == "ArrowUp") keys.up.pressed = false;
	if (e.code == 'ArrowDown') keys.down.pressed = false;
	if (e.code == 'ShiftRight') keys.shiftR.pressed = false;
		// Attacks
	if (e.code == 'Enter') keys.enter.pressed = false;
	if (e.code == 'Slash') keys.slash.pressed = false;
	if (e.code == 'Period') keys.period.pressed = false;
		// Skills
	if (e.code == 'Quote') keys.quote.pressed = false;
	if (e.code == 'Semicolon') keys.semiColon.pressed = false;
});
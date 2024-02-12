



import print from './main.js'
import { c, canvas_height, canvas_width, gravity, dashTime, drag } from './universalVar.js'
import { rectangularCollision, freezeFrame, screenShake, getDistance } from './functions.js'
import { keys } from './inputHandler.js'
import { player1, player2 } from './players.js'
import Platform, { platforms } from './platforms.js'
import Effect, { effects, targetPath, explosion } from './effects.js'

import { greenCat_moveset, rileyRoulette_moveset } from './attacks.js'

export var projectiles = [];

export default class Projectile {
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
		}
		this.platformPhysics();
		c.fillStyle = this.color;
		c.translate(this.position.x, this.position.y);
		c.rotate(this.position.rotation * Math.PI / 180);
		c.fillRect(0, 0, this.size.width, this.size.height);
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

	platformPhysics() {
		let platform;
		for (let i in platforms) {
			if (platforms[i].isHard) {
				platform = platforms[i];
				if (rectangularCollision(this, platform)) {
					this.isDestroyed = true;
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
















































// Objects

	// Green Cat
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
		// let maxAcc = 300;
		// let maxSpeed = 16;
		let speed = 20;
		let tracking = 5;
		let centerX = (enemy.position.x + enemy.size.width/2) - self.position.x;
		let centerY = (enemy.position.y + enemy.size.height/2) - self.position.y;
		let rot = Math.atan(centerY/centerX) * 180/Math.PI;
		if (centerX < 0) {
			rot -= 180;
			self.direction = "left";
		}
		else self.direction = "right";

		if (self.position.rotation < rot) self.position.rotation += tracking;
		else if (self.position.rotation > rot) self.position.rotation -= tracking;
		self.velocity.x = speed * Math.cos(self.position.rotation * Math.PI/180);
		self.velocity.y = speed * Math.sin(self.position.rotation * Math.PI/180);
		
		

		

		// self.acceleration.x = centerX*tracking;
		// if (self.acceleration.x > maxAcc) self.acceleration.x = maxAcc;
		// else if (self.acceleration.x < -maxAcc) self.acceleration.x = -maxAcc;

		// self.acceleration.y = centerY*tracking;
		// if (self.acceleration.x > maxAcc) self.acceleration.x = maxAcc;
		// else if (self.acceleration.x < -maxAcc) self.acceleration.x = -maxAcc;

		// while (self.velocity.x**2 + self.velocity.y**2 > maxSpeed**2) {
		// 	if (self.velocity.x > 0) self.velocity.x--;
		// 	else if (self.velocity.x < 0) self.velocity.x++;

		// 	if (self.velocity.y > 0) self.velocity.y--;
		// 	else if (self.velocity.y < 0) self.velocity.y++;
		// }
		// if (self.velocity.x > 0) self.direction = 'right';
		// else if (self.velocity.x < 0) self.direction = 'left';

		// if (self.position.x - self.velocity.x < enemy.position.x) self.acceleration.x += maxAcc/2;
		// else if (self.position.x + self.velocity.x > enemy.position.x) self.acceleration.x -= maxAcc/2;
		// if (self.position.y - self.velocity.y < enemy.position.y) self.acceleration.y += maxAcc/2;
		// else if (self.position.y + self.velocity.y > enemy.position.y) self.acceleration.y -= maxAcc/2;

		if (rectangularCollision(self, enemy)) {
			let damage = 120;
			enemy.bounceNumber = 0;
			enemy.tookDamage(damage, self.direction, true, Math.abs(self.velocity.x*0.8), Math.abs(self.velocity.y*0.8)+5);
			self.isDestroyed = true;
			self.isIrrelevant = true;
			if (enemy.player === 1) player2.energyGain(damage);
			else if (enemy.player === 2) player1.energyGain(damage);
		}
		self.isIrrelevant = self.isDestroyed;
},
	direction: 'right',
	color: 'cyan'
}

const greenCat_pearl = {
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
					width: 30,
					height: 30
				},
	attackFunction: (self, enemy) => {
		self.acceleration.y = gravity;
		let platform;
		let plyr;

		if (self.velocity.x <= 0) self.direction = 'left';
		else self.direction = 'right';

		if (self.player === 1) plyr = player1;
		else if (self.player === 2) plyr = player2;

		for (let i in platforms) {
			platform = platforms[i]
			if (rectangularCollision(self, platform) && platform.isHard) {
				self.isDestroyed = true;
				print(self.position.x - (plyr.size.width - self.size.width)/2)
				plyr.position = {
					x: self.position.x - (plyr.size.width - self.size.width)/2,
					y: self.position.y - (plyr.size.height - self.size.height)/2 - 25,
					rotation: 0
				}
			}
		}

		if (rectangularCollision(self, enemy)) {
			let damage = 150;
			enemy.bounceNumber = 0;
			enemy.tookDamage(damage, self.direction);
			self.isDestroyed = true;
			if (enemy.player === 1) player2.energyGain(damage);
			else if (enemy.player === 2) player1.energyGain(damage);

			plyr.position = {
				x: enemy.position.x,
				y: enemy.position.y,
				rotation: 0
			}
		}
		setTimeout( () => {
			self.isDestroyed = true;
		}, 2000)
		self.isIrrelevant = self.isDestroyed;
},
	direction: 'right',
	color: 'springGreen'
}

export const greenCat_projectiles = {
	shuriken: greenCat_shuriken,
	pearl: greenCat_pearl
}















	// Riley Roulette

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
					width: 60,
					height: 20
				},
	attackFunction: (self, enemy) => {
		if (rectangularCollision(self, enemy)) {
			let damage = 350;
			enemy.bounceNumber = 0;
			enemy.tookDamage(damage, self.direction, true, Math.abs(self.velocity.x*0.5), Math.abs(self.velocity.y*0.5)+5);
			self.isDestroyed = true;
			if (enemy.player === 1) player2.energyGain(damage);
			else if (enemy.player === 2) player1.energyGain(damage);
		}
		// setTimeout( () => {
		// 	self.isDestroyed = true;
		// }, 300)
		self.isIrrelevant = self.isDestroyed;
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
			let damage = 6;
			enemy.bounceNumber = 0;
			enemy.tookDamage(damage, self.direction, false, 0, 0, false, false);
			self.isDestroyed = true;
			if (enemy.player === 1) player2.energyGain(damage*1.5);
			else if (enemy.player === 2) player1.energyGain(damage*1.5);

			let sup = rileyRoulette_moveset.divineRevolver;
			if (sup.count < sup.countMax && sup.cooldown + 2 < sup.cooldownDuration) sup.cooldown -= 20;
		}
		self.isIrrelevant = self.isDestroyed;
},
	direction: 'right',
	color: 'red'
}

const rileyRoulette_rocket = {
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
					width: 40,
					height: 28
				},
	attackFunction: (self, enemy) => {
		let maxAcc = 200;
		let maxSpeed = 60;
		let tracking = 5;
		let centerX = (enemy.position.x + enemy.size.width/2) - self.position.x;
		let centerY = (enemy.position.y + enemy.size.height/2) - self.position.y;
		self.position.rotation = Math.atan(self.velocity.y/self.velocity.x);
		if (self.velocity.x === 0) self.position.rotation *= -1;

		self.acceleration.x = centerX*tracking;
		if (self.acceleration.x > maxAcc) self.acceleration.x = maxAcc;
		else if (self.acceleration.x < -maxAcc) self.acceleration.x = -maxAcc;

		self.acceleration.y = centerY*tracking;
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

		if (self.position.x - self.velocity.x < enemy.position.x) self.acceleration.x += maxAcc * 5;
		else if (self.position.x + self.velocity.x > enemy.position.x) self.acceleration.x -= maxAcc * 5;
		if (self.position.y - self.velocity.y < enemy.position.y) self.acceleration.y += maxAcc * 5;
		else if (self.position.y + self.velocity.y > enemy.position.y) self.acceleration.y -= maxAcc * 5;

		self.position.rotation = Math.atan(self.velocity.y/self.velocity.x) * 180/Math.PI;

		if (rectangularCollision(self, enemy)) self.isDestroyed = true;
		for (let i in platforms) {
			if (platforms[i].isHard && rectangularCollision(self, platforms[i])) self.isDestroyed = true;
		}

		if (self.isDestroyed) {
			setTimeout( () => {
				self.isIrrelevant = true;
			}, 100)
			let plyr;
			let damage = 160;
			let radius = 60;
			let boom = explosion;

			boom.position = {
				x: self.position.x,
				y: self.position.y,
				rotation: 0
			}
			let size = {
				width: 0,
				height: 0,
				radius: radius
			}
			boom = new Effect(boom, size);

			if (self.player === 1) plyr = player1;
			else if (self.player === 2) plyr = player2;

			for (let i in plyr.enemies) {
				let enemyBubble = {
					position: {
						x: plyr.enemies[i].position.x + plyr.enemies[i].size.width/2,
						y: plyr.enemies[i].position.y + plyr.enemies[i].size.height/2,
					}
				}
				if (getDistance(self, plyr.enemies[i]) <= radius+(plyr.enemies[i].size.width+plyr.enemies[i].size.height)/4) {
					plyr.enemies[i].tookDamage(damage, self.direction, true, Math.abs(self.velocity.x*0.5), Math.abs(self.velocity.y*0.5)+5);
					plyr.enemies[i].bounceNumber = 0;
					if (self.player === 1) player1.energyGain(damage);
					else if (self.player === 2) player2.energyGain(damage);
				}
			}
		}
},
	direction: 'right',
	color: 'pink'
}

const rileyRoulette_missile = {
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
					width: 30,
					height: 10
				},
	attackFunction: (self, enemy) => {
		// let maxAcc = 300;
		// let maxSpeed = 16;
		let speed = 15;
		let tracking = 8;
			

		if (!self.isDestroyed) {
			let centerX = (enemy.position.x + enemy.size.width/2) - self.position.x;
			let centerY = (enemy.position.y + enemy.size.height/2) - self.position.y;
			let rot = Math.atan(centerY/centerX) * 180/Math.PI;
			if (centerX < 0) {
				rot -= 180;
				rot %= 360;
				self.direction = "left";
			}
			else self.direction = "right";

			if (self.position.rotation < rot) self.position.rotation += tracking;
			else if (self.position.rotation > rot) self.position.rotation -= tracking;

			setTimeout( () => {
				self.isDestroyed = true;
				self.position.rotation = rot;
			}, 250)
		}
		
		self.velocity.x = speed * Math.cos(self.position.rotation * Math.PI/180);
		self.velocity.y = speed * Math.sin(self.position.rotation * Math.PI/180);


		if (rectangularCollision(self, enemy)) {
			let damage = 20;
			let staggers = enemy.isStaggered;
			enemy.bounceNumber = 0;
			if (enemy.isBlocking) damage *= 4;
			enemy.tookDamage(damage, self.direction, true, 2, 4, false, staggers);
			if (staggers) enemy.forceUnStagger += 150;
			self.isDestroyed = true;
			self.isIrrelevant = true;
			if (enemy.player === 1) player2.energyGain(damage);
			else if (enemy.player === 2) player1.energyGain(damage);

			let sup = rileyRoulette_moveset.divineRevolver;
			if (sup.count < sup.countMax && sup.cooldown + 2 < sup.cooldownDuration) sup.cooldown -= 40;

			let boom = new Effect(explosion, {width: 0, height: 0, radius: 50});
			boom.position = self.position;
		}
		for (let i in platforms) {
			let platform = platforms[i];
			if (rectangularCollision(self, platform) && platform.isHard) {
				self.isDestroyed = true;
				self.isIrrelevant = true;
				let boom = new Effect(explosion, {width: 0, height: 0, radius: 50});
				boom.position = self.position;
			}
		}
},
	direction: 'right',
	color: 'pink'
}

export const rileyRoulette_projectiles = {
	revolverShot: rileyRoulette_revolverShot,
	rifleShot: rileyRoulette_rifleShot,
	rocket: rileyRoulette_rocket,
	missile: rileyRoulette_missile
}
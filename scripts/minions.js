



import print from './main.js'
import { c, canvas_height, canvas_width, gravity, dashTime, drag } from './universalVar.js'
import { rectangularCollision, freezeFrame, screenShake, getDistance } from './functions.js'
import { keys } from './inputHandler.js'
import { player1, player2 } from './players.js'
import Projectile, { projectiles, greenCat_projectiles, rileyRoulette_projectiles } from './projectiles.js'
import Platform, { platforms } from './platforms.js'
import Effect, { effects, targetPath, explosion } from './effects.js'


export var minions = [];

export default class Minion {
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
		this.drag = drag;

		// States
		this.isDestroyed = false;
		this.isIrrelevant = false;
		this.enemies = [];

		if (this.player === 1) this.enemies.push(player2);
		else if (this.player === 2) this.enemies.push(player1);
		minions.push(this)
	}

	draw(centerX=this.position.x+this.size.width/2, centerY=this.position.y+this.size.height/2) {
		c.fillStyle = this.color;
		c.translate(centerX, centerY);
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

		if (this.acceleration.x > 0) this.acceleration.x -= self.drag;
		else if (this.acceleration.x < 0) this.acceleration.x += self.drag;
		if (this.acceleration.y > 0) this.acceleration.y -= self.drag;
		else if (this.acceleration.y < 0) this.acceleration.y += self.drag;
	}

	action() {
		this.behavior(this, this.enemies);
	}

	tookDamage(...list) {
		this.isDestroyed = true;
		this.isIrrelevant = true;
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
const greenCat_slasher = {
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
					height: 30
				},
	extra: 		{	
					damage: 10,
					speed: 60,
					counter: 0
				},
	behavior: (self, enemies) => {
		let enemy;

		if (self.direction == 'right') self.velocity.x = self.extra.speed;
		else if (self.direction == 'left') self.velocity.x = -self.extra.speed;
		self.velocity.y = -10;

		self.extra.counter++;
		if (self.extra.counter >= 4) {
			self.extra.counter = 0;
			if (self.direction == 'right') self.direction = 'left';
			else if (self.direction == 'left') self.direction = 'right';
		}

		for (let j in enemies) {
			enemy = enemies[j];
			if (rectangularCollision(self, enemy)) {
				enemy.tookDamage(self.extra.damage, self.direction, true, 0, 10);
				if (self.player === 1) player1.energyGain(self.extra.damage);
				else if (self.player === 2) player2.energyGain(self.extra.damage);
			}
		}
			
		setTimeout( () => {
			self.isDestroyed = true;
			self.isIrrelevant = true;
			self.extra.counter = 0;
		}, 500 );
	},
	direction: 'right',
	color: 'indianRed'
}

const greenCat_striker = {
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
					height: 100
				},
	extra: 		{	
					damage: 50,
					rot: 0,
					cooldown: 0,
					cooldownDuration: 10,
					speed: 120,
					canAim: true
				},
	behavior: (self, enemies) => {
		let enemy = self.enemies[0];
		let speed = self.extra.speed;
		let innacuracy = 10;
		let plyr;
		if (self.player === 1) plyr = player1;
		else if (self.player === 2) plyr = player2;
		if (self.extra.cooldown > 0) self.extra.cooldown--;



		for (let i in platforms) {
			let platform = platforms[i];
			if (rectangularCollision(self, platform) && platform.isHard) self.extra.canAim = true;
		}

		if ((self.position.x <= 0 || self.position.x+self.size.width >= canvas_width) || (self.position.y-self.size.height <= 0 || self.position.y >= canvas_height)) {
			self.extra.canAim = true;
			if (self.position.x <= 0 || self.position.x+self.size.width >= canvas_width) self.velocity.x *= -1;
			if (self.position.y-self.size.height <= 0 || self.position.y >= canvas_height) self.velocity.y *= -1;
		}


		if (self.extra.canAim) {
			let centerX = (enemy.position.x + enemy.size.width/2) - self.position.x;
			let centerY = (enemy.position.y + enemy.size.height/2) - self.position.y;
			self.extra.rot = Math.atan(centerY/centerX) * 180/Math.PI + Math.floor(Math.random()*innacuracy + innacuracy/2);
			if (centerX < 0) self.extra.rot -= 180;
			if (enemy.position.y < 0) self.extra.rot = Math.random()*360;
			self.extra.canAim = false;
		}
		print(self.extra.rot);

		self.position.rotation = self.extra.rot;
		self.velocity.x = speed * Math.cos(self.position.rotation * Math.PI/180);
		self.velocity.y = speed * Math.sin(self.position.rotation * Math.PI/180);
		plyr.position = self.position;

		if (self.velocity.x > 0) self.direction = "right";
		else self.direction = "left";

		
		if (rectangularCollision(self, enemy) && self.extra.cooldown <= 0) {
			self.extra.cooldown = self.extra.cooldown;
			let damage = self.extra.damage;
			let knockbackY;
			if (enemy.position.y < enemy.size.width) knockbackY = 0;
			else knockbackY = 5;
			if (enemy.isBlocking) damage *= 0.01;
			enemy.tookDamage(damage, self.direction, true, 0, knockbackY);
			if (self.player === 1) player1.energyGain(self.extra.damage);
			else if (self.player === 2) player2.energyGain(self.extra.damage);
		}
	},
	direction: 'right',
	color: 'indianRed'
}

export const greenCat_minions = {
	slasher: greenCat_slasher,
	striker: greenCat_striker
}

























	// Riley Roulette
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
		if (centerX === 0) rot *= -1;

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

				if (true) {
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
				}


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
			let bullet = rileyRoulette_projectiles.rifleShot;
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

const rileyRoulette_bazookaOrbit = {
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
					width: 120,
					height: 30
				},
	extra: 		{	
					attackMode: 1, // 1 for follow, 2 for swarm, 3 for stay
					hasExisted: false,
					isStaying: false,
					offset: {
						x: -10,
						y: -40
					},
					fire: false,
					path: null
				},
	behavior: (self, enemies) => {
		let enemy;
		for (let i in enemies) enemy = enemies[i];
		let centerX = (self.position.x + self.size.width/2) - (enemy.position.x + enemy.size.width/2);
		let centerY = (self.position.y + self.size.height/2) - (enemy.position.y + enemy.size.height/2);
		let rot = Math.atan(centerY/centerX) * 180/Math.PI;
		if (centerX === 0) rot *= -1;
		let rotSpeed = 20 * Math.PI/180;

		let plyr;
		if (self.player === 1) plyr = player1;
		else if (self.player === 2) plyr = player2;

			// Movement
		if (self.extra.attackMode === 1) {
			self.position = {
				x: plyr.position.x + self.extra.offset.x,
				y: plyr.position.y + self.extra.offset.y,
				rotation: self.position.rotation
			}
			if (self.position.rotation < rot) {
				self.position.rotation += rotSpeed;
			}
			else if (self.position.rotation > rot) {
				self.position.rotation -= rotSpeed;
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
			if (self.position.rotation < rot) {
				self.position.rotation += rotSpeed;
				if (Math.round(self.position.rotation - rot) < 10) self.position.rotation++;
			}
			else if (self.position.rotation > rot) {
				self.position.rotation -= rotSpeed;
				if (Math.round(self.position.rotation - rot) < 10) self.position.rotation--;
			}
		}
		else if (self.extra.attackMode === 3) {
			if (!self.extra.isStaying) {
				self.position = {
					x: plyr.position.x + self.extra.offset.x,
					y: plyr.position.y + self.extra.offset.y,
					rotation: self.position.rotation
				}
				self.extra.isStaying = true;
			}
			else {
				if (self.position.rotation < rot) {
					self.position.rotation += rotSpeed;
					if (Math.round(self.position.rotation - rot) < 10) self.position.rotation++;
				}
				else if (self.position.rotation > rot) {
					self.position.rotation -= rotSpeed;
					if (Math.round(self.position.rotation - rot) < 10) self.position.rotation--;
				}
			}
		}

			// Effect
		if (enemy.position.x < self.position.x) self.direction = 'left';
		else if (enemy.position.x > self.position.x) self.direction = 'right';
		let offsetTarget = 10;

		if (!self.extra.hasExisted) {
			self.extra.hasExisted = true;
			let size = {
				width: 250,
				height: 10,
				radius: 0
			};
			let path = targetPath;
			
			path.position = {
				x: self.position.x + self.size.width/2,
				y: self.position.y + offsetTarget,
				rotation: self.position.rotation
			}
			path = new Effect(path, size);
			if (self.direction == 'right') path.size.width = 250;
			else if (self.direction == 'left') path.size.width = -250;
			self.path = path;
		}
		else {
			if (self.direction == 'right') self.path.size.width = 250;
			else if (self.direction == 'left') self.path.size.width = -250;
			self.path.position = {
				x: self.position.x + self.size.width/2,
				y: self.position.y + offsetTarget,
				rotation: self.position.rotation
			}
		}




			// Attack
		if (self.extra.fire) {
			let bullet = rileyRoulette_projectiles.rocket;
			let speed = 40;
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
			self.extra.fire = false;
			setTimeout( () => {
				if (!self.isDestroyed) {
					self.isDestroyed = true;
					self.isIrrelevant = true;
					self.path.isDestroyed = true;
					self.path.isIrrelevant = true;
					self.path = null;
				}
			}, 200)
		}
		setTimeout( () => {
				if (!self.isDestroyed) {
					self.isDestroyed = true;
					self.isIrrelevant = true;
					self.path.isDestroyed = true;
					self.path.isIrrelevant = true;
					self.path = null;
				}
		}, 16000)
		if (plyr.attacks.skill3.cooldown === 0 && !self.isDestroyed) {
			self.isDestroyed = true;
			self.isIrrelevant = true;
			self.path.isDestroyed = true;
			self.path.isIrrelevant = true;
			self.path = null;
		}
	},
	direction: 'right',
	color: 'gray'
}

const rileyRoulette_scythe = {
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
					height: 100
				},
	extra: 		{	
					damage: 30,
					speed: 5,
					rotSpeed: 40,
					counter: 0
				},
	behavior: (self, enemies) => {
		self.extra.counter += 0.25;
		if (self.extra.counter > 3) self.extra.counter = 3;
		let enemy;
		let speed = self.extra.speed;
		let rotSpeed = self.extra.rotSpeed;
		let counter = self.extra.counter;
		let rot = self.position.rotation * Math.PI/180;
		let plyr;

		let centriF = (self.velocity.x**2 + self.velocity.y**2)**0.5;

		if (self.player === 1) plyr = player1;
		else if (self.player === 2) plyr = player2;

		
		let selfCenter = {
			position: {
				x: self.position.x + self.size.width/2,
				y: self.position.y + self.size.height/2,
				rotation: 0
			}
		}

		let plyrCenter = {
			position: {
				x: plyr.position.x + plyr.size.width/2,
				y: plyr.position.y + plyr.size.height/2,
				rotation: 0
			}
		}
			
		
		if (self.direction == 'right') {
			self.position.x = plyrCenter.position.x - self.size.width/2 - Math.cos(rot) * centriF * speed*counter;
			self.position.y = plyrCenter.position.y - self.size.height/2 + Math.sin(rot) * centriF * speed*counter;
			self.position.rotation += rotSpeed;
		}
		else {
			self.position.x = plyrCenter.position.x - self.size.width/2 - Math.cos(rot) * centriF * speed*counter;
			self.position.y = plyrCenter.position.y - self.size.height/2 + Math.sin(rot) * centriF * speed*counter;
			self.position.rotation -= rotSpeed;
		}

		// Attack
		for (let i in enemies) {
			let enemy = enemies[i];
			if (rectangularCollision(enemy, self)) {
				let direction;
				if (self.position.x + self.size.width/2 > enemy.position.x + enemy.size.width) direction = 'left';
				else direction = 'right'
				enemy.tookDamage(self.extra.damage, direction, true);
				plyr.energyGain(self.extra.damage);
			}
		}
	},
	direction: 'right',
	color: 'pink'
}

const rileyRoulette_helicopter = {
	position:	{
					x: 0,
					y: 50,
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
					width: 200,
					height: 100
				},
	extra: 		{	
					speed: 10,
					cooldown: 0,
					cooldownDuration: 1,
					through: false,
					escp: false
				},
	behavior: (self, enemies) => {
		let side;
		let teleport = self.extra.speed*2;
		if (self.direction == "right") side = 1;
		else if (self.direction == "left") side = -1;
		self.velocity.x = self.extra.speed * side;

		if ((self.position.x < 30 || self.position.x+self.size.width > canvas_width-30) && self.extra.through && !self.extra.escp) {
			if (self.direction == "right" && self.velocity.x > 0) {
				self.direction = "left";
				self.position.x -= teleport;
			}
			else if (self.direction == "left" && self.velocity.x < 0) {
				self.direction = "right";
				self.position.x += teleport;
			}
		}
		else if ((self.position.x > 30 && self.position.x+self.size.width < canvas_width-30) && !self.extra.through) self.extra.through = true;
		if (self.extra.escp && ( (self.position.x+self.size.width < 0 || self.position.x > canvas_width) )) {
			self.isDestroyed = true;
			self.isIrrelevant = true;
		}

		// Attack
		if (self.extra.cooldown <= 0 && (self.position.x > 0 && self.position.x+self.size.width < canvas_width)) {
			self.extra.cooldown = self.extra.cooldownDuration;
			let enemy = self.enemies[0];
			let centerX = (self.position.x + self.size.width/2) - (enemy.position.x + enemy.size.width/2);
			let centerY = (self.position.y + self.size.height/2) - (enemy.position.y + enemy.size.height/2);
			let rot = Math.atan(centerY/centerX) + Math.floor(Math.random()*20 - 10)*Math.PI/180;
			if (centerX >= 0) rot -= Math.PI;

			let bullet = new Projectile(self.player, rileyRoulette_projectiles.rifleShot);
			bullet.position = {
				x: self.position.x + self.size.width/2,
				y: self.position.y + self.size.height/2,
				rotation: rot * 180/Math.PI
			}
			//if (centerX < 0) rot *= -1; 
			bullet.velocity.x = 35 * Math.cos(rot);
			bullet.velocity.y = 35 * Math.sin(rot);
		}
		else self.extra.cooldown--;
	},
	direction: 'right',
	color: 'purple'
}

const rileyRoulette_fighterJet = {
	position:	{
					x: 0,
					y: 50,
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
					width: 300,
					height: 50
				},
	extra: 		{	
					speed: 30,
					cooldown: 0,
					cooldownDuration: 10,
					through: false,
					escp: false
				},
	behavior: (self, enemies) => {
		let side;
		let teleport = self.extra.speed*2;
		if (self.direction == "right") side = 1;
		else if (self.direction == "left") side = -1;
		self.velocity.x = self.extra.speed * side;

		if ((self.position.x < -1000 || self.position.x+self.size.width > canvas_width+1000) && self.extra.through && !self.extra.escp) {
			if (self.direction == "right" && self.velocity.x > 0) {
				self.direction = "left";
				self.position.x -= teleport;
				self.position.y += Math.floor(Math.random()*40 - 20);
			}
			else if (self.direction == "left" && self.velocity.x < 0) {
				self.direction = "right";
				self.position.x += teleport;
				self.position.y += Math.floor(Math.random()*40 - 20);
			}
		}
		else if ((self.position.x > -1000 && self.position.x+self.size.width < canvas_width+1000) && !self.extra.through) self.extra.through = true;
		if (self.extra.escp && ( (self.position.x+self.size.width < 0 || self.position.x > canvas_width) )) {
			self.isDestroyed = true;
			self.isIrrelevant = true;
		}

		// Attack
		let enemy = self.enemies[0];
		if (self.extra.cooldown <= 0 && (self.position.x > 0 && self.position.x+self.size.width < canvas_width) && enemy.position.y > 300) {
			self.extra.cooldown = self.extra.cooldownDuration;
			let centerX = (self.position.x + self.size.width/2) - (enemy.position.x + enemy.size.width/2);
			let centerY = (self.position.y + self.size.height/2) - (enemy.position.y + enemy.size.height/2);
			let rot = Math.atan(centerY/centerX);
			if (centerX >= 0) rot -= Math.PI;

			let rocket = new Projectile(self.player, rileyRoulette_projectiles.rocket);
			rocket.position = {
				x: self.position.x + self.size.width/2,
				y: self.position.y + self.size.height/2,
				rotation: rot * 180/Math.PI
			}
			//if (centerX < 0) rot *= -1; 
			rocket.velocity.x = 35 * Math.cos(rot);
			rocket.velocity.y = 35 * Math.sin(rot);
		}
		else self.extra.cooldown--;
	},
	direction: 'right',
	color: 'purple'
}

export const rileyRoulette_minions = {
	bulletOrbit: rileyRoulette_bulletOrbit,
	bazookaOrbit: rileyRoulette_bazookaOrbit,
	scythe: rileyRoulette_scythe,
	helicopter: rileyRoulette_helicopter,
	fighterJet: rileyRoulette_fighterJet
}








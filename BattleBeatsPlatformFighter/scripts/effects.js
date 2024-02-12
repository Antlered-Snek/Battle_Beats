



import print from './main.js'
import { c, canvas_height, canvas_width, gravity, dashTime, drag, gameFrame } from './universalVar.js'
import { rectangularCollision, freezeFrame, screenShake, getDistance } from './functions.js'
import { keys } from './inputHandler.js'
import { player1, player2 } from './players.js'
import Minion, { minions, greenCat_minions, rileyRoulette_minions } from './minions.js'
import Projectile, { projectiles, greenCat_projectiles, rileyRoulette_projectiles } from './projectiles.js'
import Platform, { platforms } from './platforms.js'
import { force_sprite, slash_sprite } from './sprites.js'

export var effects = [];

export default class Effect {
	constructor({position, acceleration, velocity, behavior, direction, color='white', spriteInfo=null}, size) {

		// Variable Attributes
		this.position = position;
		this.acceleration = acceleration;
		this.velocity = {
			x: 0,
			y: 0
		};
		this.size = size;
		this.behavior = behavior;
		this.color = color;
		this.spriteInfo = spriteInfo;

		// State Attributes
		this.enemy;
		this.direction = direction;
		this.isDestroyed = false;
		this.isIrrelevant = false;
		effects.push(this);
	}

	draw() {
		if (this.spriteInfo != null) {
			let sprite = this.spriteInfo.sprite;
			let width = this.size.width;
			let height = this.size.height;
			let rot = this.position.rotation * Math.PI/180;

			let sprite_col = this.spriteInfo.grid.col;
			let sprite_row = this.spriteInfo.grid.row;

			c.translate(this.position.x+this.size.width/2, this.position.y+this.size.height/2);
			c.rotate(rot);
			c.drawImage(sprite, sprite_col*500, (sprite_row-1)*500, 500, 500, -this.size.width/2, -this.size.height/2, width, height);
			c.setTransform(1, 0, 0, 1, 0, 0);
		}
		else {
			c.fillStyle = this.color;
			if (this.size.radius === 0) {
				c.translate(this.position.x, this.position.y);
				c.rotate(this.position.rotation * Math.PI / 180);
				c.fillRect(0, 0, this.size.width, this.size.height);
				c.translate(0, 0);
				c.setTransform(1, 0, 0, 1, 0, 0);
			}
			else {
				c.beginPath();
				c.arc(this.position.x, this.position.y, this.size.radius, 0, Math.PI*2, false);
				c.fill();
				c.closePath();
			}
		}
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
		this.behavior(this);
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
export const targetPath = {
	position: {
		x: 0,
		y: 0,
		rotation: 0
	},
	acceleration: {
		x: 0,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	behavior: (self) => {

	},
	direction: 'right',
	color: 'red'
}

// Objects
export const explosion = {
	position: {
		x: 0,
		y: 0,
		rotation: 0
	},
	acceleration: {
		x: 0,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	size: {
		width: 0,
		height: 0,
		radius: 0
	},
	behavior: (self) => {
		setTimeout( () => {
			self.isDestroyed = true;
			self.isIrrelevant = true;
		}, 200)
	},
	direction: 'right',
	color: 'red'
}

export const force = {
	position: {
		x: 0,
		y: 0,
		rotation: 0
	},
	acceleration: {
		x: 0,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	size: {
		width: 0,
		height: 0,
		radius: 0
	},
	behavior: (self) => {
		let fps = 1;
		if (self.spriteInfo.grid.col >= 6 && gameFrame % fps === 0) {
			self.isDestroyed = true;
			self.isIrrelevant = true;
		}
		else if (gameFrame % fps === 0) self.spriteInfo.grid.col++;
	},
	direction: 'right',
	color: 'red',
	spriteInfo: {
		sprite: force_sprite,
		grid: {
			col: 1,
			row: 1
		}
	}
}

export const slash = {
	position: {
		x: 0,
		y: 0,
		rotation: 0
	},
	acceleration: {
		x: 0,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	size: {
		width: 0,
		height: 0,
		radius: 0
	},
	behavior: (self) => {
		let fps = 4;
		if (self.spriteInfo.grid.col >= 6 && gameFrame % fps === 0) {
			self.isDestroyed = true;
			self.isIrrelevant = true;
		}
		else if (gameFrame % fps === 0) self.spriteInfo.grid.col++;
	},
	direction: 'right',
	color: 'red',
	spriteInfo: {
		sprite: slash_sprite,
		grid: {
			col: 1,
			row: 1
		}
	}
}

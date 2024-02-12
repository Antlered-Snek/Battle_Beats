



import print from './main.js'
import { c2, canvas_height, canvas_width, gravity, dashTime, drag, gameFrame } from './universalVar.js'
import { rectangularCollision, freezeFrame, screenShake, getDistance } from './functions.js'
import { keys } from './inputHandler.js'
import { player1, player2 } from './players.js'
import Minion, { minions, greenCat_minions, rileyRoulette_minions } from './minions.js'
import Projectile, { projectiles, greenCat_projectiles, rileyRoulette_projectiles } from './projectiles.js'
import Platform, { platforms } from './platforms.js'
import { force_sprite, slash_sprite } from './sprites.js'

export var menuUI = [];

export default class Menu {
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
		menuUI.push(this);
	}

	draw() {
		if (this.spriteInfo != null) {
			let sprite = this.spriteInfo.sprite;
			let width = this.size.width;
			let height = this.size.height;
			let rot = this.position.rotation * Math.PI/180;

			let sprite_col = this.spriteInfo.grid.col;
			let sprite_row = this.spriteInfo.grid.row;

			c2.translate(this.position.x+this.size.width/2, this.position.y+this.size.height/2);
			c2.rotate(rot);
			c2.drawImage(sprite, sprite_col*500, (sprite_row-1)*500, 500, 500, -this.size.width/2, -this.size.height/2, width, height);
			c2.setTransform(1, 0, 0, 1, 0, 0);
		}
		else {
			c2.fillStyle = this.color;
			if (this.size.radius === 0) {
				c2.translate(this.position.x, this.position.y);
				c2.rotate(this.position.rotation * Math.PI / 180);
				c2.fillRect(0, 0, this.size.width, this.size.height);
				c2.translate(0, 0);
				c2.setTransform(1, 0, 0, 1, 0, 0);
			}
			else {
				c2.beginPath();
				c2.arc(this.position.x, this.position.y, this.size.radius, 0, Math.PI*2, false);
				c2.fill();
				c2.closePath();
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
export const ultInitial = {
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
	color: 'indianRed'
}

export const ultProfile = {
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
	color: 'indianRed'
}











import print from './main.js'
import { c, canvas_height, canvas_width, gravity, dashTime, drag } from './universalVar.js'
import { rectangularCollision, freezeFrame, screenShake, getDistance } from './functions.js'
import { keys } from './inputHandler.js'
import { player1, player2 } from './players.js'
import { crushing_cherries } from './sprites.js'

export var platforms = [];

export default class Platform {
	constructor({position, size, isHard, isPushable, behavior, color}, entities=[]) {
		this.position = position;
		this.acceleration = {
			x: 0,
			y: 0
		}
		this.velocity = {
			x: 0,
			y: 0
		}
		this.size = size;
		this.isHard = isHard;
		this.isPushable = isPushable;
		this.behavior = behavior;
		this.color = color;
		this.entities = entities;

		if (this.isPushable) this.isHard = false;

		platforms.push(this);
	}

	draw() {
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

	physics() {
		for (let i in platforms) {
			let platform = platforms[i];
			if (platform == this) continue;
			if (rectangularCollision(this, platform)) {
				// if (platform.isHard && (this.position.y+this.size.height > platform.position.y && this.position.y < platform.position.y+platform.size.height) && (this.position.x+this.size.width > platform.position.x || this.position.x < platform.position.x+platform.size.width)) {
				// 	this.position.y = platform.position.y - this.size.height;
				// }
				this.velocity.y = 0;
				if (this.position.y < platform.position.y) this.position.y = platform.position.y - this.size.height;
				if (platform.isHard && (this.position.y + this.size.height != platform.position.y)) {
					if ((this.position.x + this.size.width > platform.position.x) && (this.position.x + this.size.width < platform.position.x + platform.size.width)) this.position.x = platform.position.x - this.size.width;
					else if ((this.position.x < platform.position.x + platform.size.width) && (this.position.x + this.size.width > platform.position.x + platform.size.width)) this.position.x = platform.position.x + platform.size.width;
				}
				if (platform.isPushable && (this.position.y + this.size.height != platform.position.y)) {
					if ((this.position.x + this.size.width > platform.position.x) && (this.position.x + this.size.width < platform.position.x + platform.size.width)) platform.position.x = this.position.x + this.size.width;
					else if ((this.position.x < platform.position.x + platform.size.width) && (this.position.x + this.size.width > platform.position.x + platform.size.width)) platform.position.x = this.position.x - platform.size.width;
				}
			}
			else this.acceleration.y = gravity;
		}
	}

	action() {
		this.behavior(this, this.entities);
	}

	update() {
		if (this.isPushable) this.physics();
		this.vectors();
		this.action();
		this.draw();
	}
}




// Objects
const genericPlatform = {
	behavior: (self, entities) => {
		
	}
}




// Levels
	// Crushing Cherries
// export var map = crushing_cherries;
setTimeout( () => {
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
	crushingCherries2.entities = [player1, player2];
}, 10);

export var map = null;
const crushingCherries1 = new Platform({
	position: {
		x: -20,
		y: 566
	},
	size: {
		width: canvas_width + 40,
		height: 100
	},
	isHard: true,
	isPushable: false,
	behavior: genericPlatform.behavior,
	color: 'lightGray'
});
const crushingCherries2 = new Platform({
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
	behavior: (self, entities) => {
		if (!self.velocity.x) self.velocity.x = 2;
		let teleport = 10;
		
		if (self.position.x < 60 || self.position.x+self.size.width > canvas_width-60) {
			if (self.velocity.x > 0) self.position.x -= teleport;
			else if (self.velocity.x < 0) self.position.x += teleport;
			self.velocity.x *= -1;
		}
		
		for (let i in entities) {
			let entity = entities[i];
			if (rectangularCollision(self, entity) && entity.isGrounded && !entity.isMoving) {
				entity.position.x += self.velocity.x;
				entity.position.y += self.velocity.y;
			}
		}
	},
	color: 'lightGray'
});
const crushingCherries3 = new Platform({
	position: {
		x: canvas_width,
		y: -canvas_height
	},
	size: {
		width: 200,
		height: canvas_height*2
	},
	isHard: true,
	isPushable: false,
	behavior: genericPlatform.behavior,
	color: 'lightGray'
});
const crushingCherries4 = new Platform({
	position: {
		x: -200,
		y: -canvas_height
	},
	size: {
		width: 200,
		height: canvas_height*2
	},
	isHard: true,
	isPushable: false,
	behavior: genericPlatform.behavior,
	color: 'lightGray'
});

	// Clock of Time
// export var map = null;
// var clockOfTime1 = new Platform({
// 	position: {
// 		x: 140,
// 		y: 376
// 	},
// 	size: {
// 		width: canvas_width/4,
// 		height: 20
// 	},
// 	isHard: true,
// 	isPushable: false,
// 	behavior: genericPlatform.behavior,
// 	color: 'lightGray'
// });
// var clockOfTime2 = new Platform({
// 	position: {
// 		x: 3*canvas_width/4 - 140,
// 		y: 376
// 	},
// 	size: {
// 		width: canvas_width/4,
// 		height: 20
// 	},
// 	isHard: true,
// 	isPushable: false,
// 	behavior: genericPlatform.behavior,
// 	color: 'lightGray'
// });















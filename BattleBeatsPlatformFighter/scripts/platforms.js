



import print from './main.js'
import { c, canvas_height, canvas_width, gravity, dashTime, drag } from './universalVar.js'
import { rectangularCollision, freezeFrame, screenShake, getDistance } from './functions.js'
import { keys } from './inputHandler.js'
import { player1, player2 } from './players.js'
import { crushing_cherries } from './sprites.js'

export var platforms = [];

export default class Platform {
	constructor({position, size, isHard, isPushable, behavior, color}) {
		this.position = position;
		this.size = size;
		this.isHard = isHard;
		this.isPushable = isPushable;
		this.behavior = behavior;
		this.color = color;

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





// Objects
const genericPlatform = {
	behavior: (platform, entities) => {
		
	}
}




// Levels
	// Crushing Cherries
// export var map = crushing_cherries;
// export var map = null;
// const crushingCherries1 = new Platform({
// 	position: {
// 		x: -20,
// 		y: 566
// 	},
// 	size: {
// 		width: canvas_width + 40,
// 		height: 100
// 	},
// 	isHard: true,
// 	isPushable: false,
// 	behavior: genericPlatform.behavior,
// 	color: 'lightGray'
// });
// const crushingCherries2 = new Platform({
// 	position: {
// 		x: canvas_width/2 - 125,
// 		y: 320
// 	},
// 	size: {
// 		width: 250,
// 		height: 20
// 	},
// 	isHard: false,
// 	isPushable: false,
// 	behavior: genericPlatform.behavior,
// 	color: 'lightGray'
// });
// const crushingCherries3 = new Platform({
// 	position: {
// 		x: canvas_width,
// 		y: -canvas_height
// 	},
// 	size: {
// 		width: 200,
// 		height: canvas_height*2
// 	},
// 	isHard: true,
// 	isPushable: false,
// 	behavior: genericPlatform.behavior,
// 	color: 'lightGray'
// });
// const crushingCherries4 = new Platform({
// 	position: {
// 		x: -200,
// 		y: -canvas_height
// 	},
// 	size: {
// 		width: 200,
// 		height: canvas_height*2
// 	},
// 	isHard: true,
// 	isPushable: false,
// 	behavior: genericPlatform.behavior,
// 	color: 'lightGray'
// });

	// Clock of Time
export var map = null;
var clockOfTime1 = new Platform({
	position: {
		x: 140,
		y: 376
	},
	size: {
		width: canvas_width/4,
		height: 20
	},
	isHard: true,
	isPushable: false,
	behavior: genericPlatform.behavior,
	color: 'lightGray'
});
var clockOfTime2 = new Platform({
	position: {
		x: 3*canvas_width/4 - 140,
		y: 376
	},
	size: {
		width: canvas_width/4,
		height: 20
	},
	isHard: true,
	isPushable: false,
	behavior: genericPlatform.behavior,
	color: 'lightGray'
});



















import print from './main.js'
import { c, canvas_height, canvas_width, gravity, dashTime, drag, gameFrame } from './universalVar.js'
import Menu, { menuUI, ultInitial, ultProfile } from './menu.js'
import MainMenu, { mainMenu, pauseMenu } from './mainMenu.js'

export var freezeFrames = 0;

export function rectangularCollision(object1, object2) {
	return (
		((object1.position.x+object1.size.width >= object2.position.x) &&
		(object1.position.y+object1.size.height >= object2.position.y))
		&&
		((object2.position.x+object2.size.width >= object1.position.x) &&
		(object2.position.y+object2.size.height >= object1.position.y))
	)
}

export function freezeFrame(duration=40, shake=true, shakeDuration=1200) {
	freezeFrames = duration;
	if (shake) screenShake(shakeDuration);
}

export function freezeFrameReduce() {
	freezeFrames--;
}

export function screenShake(duration, strength=16) {
	let ran1;
	let ran2;

	let shake = setInterval( () => {
		ran1 = Math.random()*strength - strength/2;
		ran2 = Math.random()*strength - strength/2;
		c.translate(ran1, ran2);
	}, 10)
	let unshake = setInterval( () => {
		c.setTransform(1, 0, 0, 1, 0, 0);
	}, 11)
	setTimeout( () => {
		clearInterval(shake);
		clearInterval(unshake);
		c.setTransform(1, 0, 0, 1, 0, 0);
	}, duration);
}

export function getDistance(object1, object2) {
	return ((object1.position.x-object2.position.x)**2 + (object1.position.y-object2.position.y)**2)**0.5;
}

export function ultimateFreeze(player) {
	let side;
	let sideX;
	if (player.player === 1) {
		side = 1;
		sideX = -canvas_width*1.5;
	}
	else if (player.player === 2) {
		side = -1;
		sideX = canvas_width;
	}
	

	let square = new Menu(ultInitial, {width: canvas_width*1.5, height: canvas_height*0.4, radius: 0});
	square.position = {
		x: sideX,
		y: 200,
		rotation: 0
	}
	square.velocity.x = 80*side;
	setTimeout( () => {
		square.velocity.x = 5*side;
	}, 100)
	setTimeout( () => {
		square.velocity.x = 100*side;
	}, 1000)
	setTimeout( () => {
		square.isDestroyed = true;
		square.isIrrelevant = true;
	}, 2000)
}

export function pause() {
	let pause = new MainMenu(0, pauseMenu);
	return mainMenu.indexOf(pause);
}

export function changeSkill() {
	print('gay');
}
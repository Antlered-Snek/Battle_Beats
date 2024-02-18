



import print from './main.js'
import { player1, player2 } from './players.js'

export const keys = {
	// Global
	f1: {pressed: true},
	f3: {pressed: true},
	escp: {pressed: true},

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
	t: {pressed: false},
	y: {pressed: false},
		// Ultimate
	x: {pressed: false},
		// Aim
	axis1_p1: 0,
	axis2_p1: 0,
	

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
	semiColon: {pressed: false},
	l: {pressed: false},
	k: {pressed: false},
		// Ultimate
	p: {pressed: false},
		// Aim
	axis1_p2: 0,
	axis2_p2: 0
};






// Input
document.addEventListener('keydown', (e) => {
	e.preventDefault();
	// Global
	if (e.code == 'F1') keys.f1.pressed = !keys.f1.pressed;
	if (e.code == 'F3') keys.f3.pressed = !keys.f3.pressed;
	if (e.code == 'Escape') keys.escp.pressed = !keys.escp.pressed;

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
	if (e.code == 'KeyT') keys.t.pressed = true;
	if (e.code == 'KeyY') keys.y.pressed = true;
		// Ultimate
	if (e.code == 'KeyX') keys.x.pressed = true;
	

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
	if (e.code == 'KeyL') keys.l.pressed = true;
	if (e.code == 'KeyK') keys.k.pressed = true;
		// Ultimate
	if (e.code == 'KeyP') keys.p.pressed = true;
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
	if (e.code == 'KeyT') keys.t.pressed = false;
	if (e.code == 'KeyY') keys.y.pressed = false;
		// Ultimate
	if (e.code == 'KeyX') keys.x.pressed = false;

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
	if (e.code == 'KeyL') keys.l.pressed = false;
	if (e.code == 'KeyK') keys.k.pressed = false;
		// Ultimate
	if (e.code == 'KeyP') keys.p.pressed = false;
});

// Controller
const controllerUser = 'player2';
var controllerIndex1 = null;
var controllerIndex2 = null;

export function gamepadHandler() {
	if ((controllerIndex1 != null && controllerUser == 'player1') || (controllerIndex2 != null && controllerUser == 'player2')) {
		let index;
		if (controllerIndex1 != null && controllerUser == 'player1') index = controllerIndex1;
		else if (controllerIndex2 != null && controllerUser == 'player2') index = controllerIndex2;

		const gamepad = navigator.getGamepads()[index];
		const buttons = gamepad.buttons;

		if (gamepad.axes[1] < -0.5) keys.w.pressed = true;
		else keys.w.pressed = false;
		if (gamepad.axes[1] > 0.5) keys.s.pressed = true;
		else keys.s.pressed = false;

		if (gamepad.axes[0] < -0.8) {
			keys.a.pressed = true;
			player1.lastkey = 'a';
		}
		else keys.a.pressed = false;
		if (gamepad.axes[0] > 0.8) {
			keys.d.pressed = true;
			player1.lastkey = 'd';
		}
		else keys.d.pressed = false;

		keys.shiftL.pressed = buttons[10].pressed;
		keys.f.pressed = buttons[6].pressed;
		keys.g.pressed = buttons[4].pressed;
		keys.tab.pressed = buttons[7].pressed;

		keys.e.pressed = buttons[3].pressed;
		keys.r.pressed = buttons[1].pressed;
		keys.t.pressed = buttons[0].pressed;
		keys.y.pressed = buttons[2].pressed;

		keys.x.pressed = buttons[5].pressed;

		keys.axis1_p1 = gamepad.axes[3];
		keys.axis2_p1 = gamepad.axes[2];

		for (let i in buttons) {
			if (buttons[i].pressed) print('player1 : ', i);
		}
	}
	else if ((controllerIndex1 != null && controllerUser == 'player2') || (controllerIndex2 != null && controllerUser == 'player1')) {
		let index;
		if (controllerIndex1 != null && controllerUser == 'player2') index = controllerIndex1;
		else if (controllerIndex2 != null && controllerUser == 'player1') index = controllerIndex2;

		const gamepad = navigator.getGamepads()[index];
		const buttons = gamepad.buttons;

		if (gamepad.axes[1] < -0.5) keys.up.pressed = true;
		else keys.up.pressed = false;
		if (gamepad.axes[1] > 0.5) keys.down.pressed = true;
		else keys.down.pressed = false;

		if (gamepad.axes[0] < -0.8) {
			keys.left.pressed = true;
			player2.lastkey = 'left';
		}
		else keys.left.pressed = false;
		if (gamepad.axes[0] > 0.8) {
			keys.right.pressed = true;
			player2.lastkey = 'right';
		}
		else keys.right.pressed = false;

		keys.shiftR.pressed = buttons[10].pressed;
		keys.slash.pressed = buttons[6].pressed;
		keys.period.pressed = buttons[4].pressed;
		keys.enter.pressed = buttons[7].pressed;

		keys.quote.pressed= buttons[3].pressed;
		keys.semiColon.pressed = buttons[1].pressed;
		keys.l.pressed = buttons[0].pressed;
		keys.k.pressed = buttons[2].pressed;

		keys.p.pressed = buttons[5].pressed;

		keys.axis1_p2 = gamepad.axes[3];
		keys.axis2_p2 = gamepad.axes[2];

		for (let i in buttons) {
			if (buttons[i].pressed) print('player2 : ', i);
		}
		print(keys.axis2_p2);
	}
}

addEventListener("gamepadconnected", (e) => {
	if (controllerIndex1 === null) {
		controllerIndex1 = e.gamepad.index;
		if (controllerUser === "player1") player1.usingController = true;
		else if (controllerUser === "player2") player2.usingController = true;
	}
	else {
		controllerIndex2 = e.gamepad.index;
		if (controllerUser === "player1") player2.usingController = true;
		else if (controllerUser === "player2") player1.usingController = true;
	}
	
	
})

addEventListener("gamepaddisconnected", (e) => {
	if (controllerIndex1 === null) {
		controllerIndex2 = null;
		if (controllerUser === "player1") player1.usingController = false;
		else if (controllerUser === "player2") player2.usingController = false;
	}
	else {
		controllerIndex1 = null;
		if (controllerUser === "player1") player2.usingController = false;
		else if (controllerUser === "player2") player1.usingController = false;
	}
})

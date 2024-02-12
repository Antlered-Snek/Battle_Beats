

// Imports
	// functions.js
import { c, c2, canvas_height, canvas_width, gravity, dashTime, drag, gameFrame, mapFrame, frameUpdate} from './universalVar.js'
import { keys, gamepadHandler } from './inputHandler.js'
import { freezeFrames, rectangularCollision, freezeFrame, freezeFrameReduce, screenShake, getDistance } from './functions.js'
import { player1, player2 } from './players.js'
import { minions } from './minions.js'
import { projectiles } from './projectiles.js'
import { map, platforms } from './platforms.js'
import { effects } from './effects.js'
import { menuUI } from './menu.js'






export default function print(...data) {
	console.log(...data);
}



function animate() {
	window.requestAnimationFrame(animate);
	frameUpdate();

	c2.clearRect(0, 0, canvas_width+50, canvas_height+50);
	for (let i in menuUI) menuUI[i].update();

	if (freezeFrames === 0) {
		c.clearRect(0, 0, canvas_width, canvas_height);
		if (map != null) {
			c.drawImage(map, 0, (mapFrame%8-1)*1440, 2560, 1440, 0, 0, canvas_width, canvas_height);
		}
		else {
			c.fillStyle = "black";
			c.fillRect(0, 0, canvas_width, canvas_height);
		}



		gamepadHandler();

		for (let i in platforms) platforms[i].update();
		for (let i in projectiles) projectiles[i].update();
		player1.update();
		player2.update();
		for (let i in effects) effects[i].update();
		for (let i in minions) minions[i].update();

		

		

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
		if (keys.t.pressed) setTimeout(player1.skill3(), 10);
		if (keys.y.pressed) setTimeout(player1.skill4(), 10);
		if (keys.x.pressed) {
			if (keys.s.pressed) setTimeout(player1.ult(), 10);
			else setTimeout(player1.comboBreaker(), 10);
		}


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
		if (keys.l.pressed) setTimeout(player2.skill3(), 10);
		if (keys.k.pressed) setTimeout(player2.skill4(), 10);
		if (keys.p.pressed) {
			if (keys.down.pressed) setTimeout(player2.ult(), 10);
			else setTimeout(player2.comboBreaker(), 10);
		}
	}
	else freezeFrameReduce();
}
animate();

















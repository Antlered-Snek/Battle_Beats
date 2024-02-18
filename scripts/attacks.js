



import print from './main.js'
import { c, canvas_height, canvas_width, gravity, dashTime, drag, gameFrame } from './universalVar.js'
import { rectangularCollision, freezeFrame, screenShake, getDistance, ultimateFreeze } from './functions.js'
import { keys } from './inputHandler.js'
import { player1, player2 } from './players.js'
import Minion, { minions, greenCat_minions, rileyRoulette_minions } from './minions.js'
import Projectile, { projectiles, greenCat_projectiles, rileyRoulette_projectiles } from './projectiles.js'
import Effect, { effects, targetPath, force, slash } from './effects.js'






// Green Cat
const greenCat_catSlash = {
					damage: 90,
					size: {
						width: 180,
						height: 60,
						radius: 0
					},
					offset: {
						x: -100,
						y: 20,
						rotation: 0
					},
					shape: 'rectangle',
					staminaCost: 10,
					energyCost: 0,
					cooldown: 0,
					cooldownDuration: 50,
					count: 6,
					countMax: 6,
					countRegen: 2,
					function: (self, isAttacking) => {
							let skill = greenCat_catSlash;
							let enemies = self.enemies;
		if (skill.cooldown < 45 && (self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && self.canMove && !self.isChargeAttacking) {
			let enemy;
			skill.cooldown = skill.cooldownDuration;
			self.directionUpdate();
			self.velocityResetFrames = 10;
			self.stamina -= skill.staminaCost;
			self.energy -= skill.energyCost;
			self.staminaRegenDelay = 80;
			skill.count -= 1;
			if (self.direction == 'right') {
				self.position.x += 5;
				let attackBox = {
					position: {
						x: self.position.x + self.size.width + skill.offset.x,
						y: self.position.y + skill.offset.y,
						rotation: skill.offset.rotation
					},
					size: skill.size
				}
				for (let i in enemies) {
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
							enemy.tookDamage(skill.damage, 'right');
							self.energyGain(skill.damage);
						}
					}
				}	
			}
			else if (self.direction == 'left') {
				self.position.x -= 5;
				let attackBox = {
					position: {
						x: self.position.x - skill.size.width - skill.offset.x,
						y: self.position.y + skill.offset.y,
						rotation: skill.offset.rotation
					},
					size: skill.size
				}
				for (let i in enemies) {
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
							enemy.tookDamage(skill.damage, 'left');
							self.energyGain(skill.damage);
						}
					}
				}
						
			}

			isAttacking.value = true;
			setTimeout(() => {
				isAttacking.value = false;
			}, 160);
		}
	}
};


const greenCat_catTheBatSmash = {
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
					countRegen: 1,
					function: (self, isAttacking) => {
							let skill = greenCat_catTheBatSmash;
							let enemies = self.enemies;
		if ((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && self.canMove && !self.isChargeAttacking) {
			let enemy;
			if (skill.cooldown === 0) skill.cooldown = skill.cooldownDuration;
			self.directionUpdate();
			self.velocityResetFrames = 10;
			self.stamina -= skill.staminaCost;
			self.energy -= skill.energyCost;
			self.staminaRegenDelay = 80;
			skill.count -= 1; 
			if (self.direction == 'right') {
				self.position.x += 5;
				let attackBox = {
					position: {
						x: self.position.x + self.size.width + skill.offset.x,
						y: self.position.y + skill.offset.y,
						rotation: skill.offset.rotation
					},
					size: skill.size
				}
				for (let i in enemies) {
					if (rectangularCollision(attackBox, enemies[i])) {
						enemy = enemies[i];
						if (rectangularCollision(attackBox, enemy)) {
							enemy.tookDamage(skill.damage, 'right', false, 2, 20);
							self.energyGain(skill.damage);
						}
					}
				}	
			}
			else if (self.direction == 'left') {
				self.position.x -= 5;
				let attackBox = {
					position: {
						x: self.position.x - skill.size.width - skill.offset.x,
						y: self.position.y + skill.offset.y,
						rotation: skill.offset.rotation
					},
					size: skill.size
				}
				for (let i in enemies) {
					if (rectangularCollision(attackBox, enemies[i])) {
						enemy = enemies[i];
						if (rectangularCollision(attackBox, enemy)) {
							enemy.tookDamage(skill.damage, 'left', false, 2, 20);
							self.energyGain(skill.damage);
						}
					}
				}		
			}

			isAttacking.value = true;
			setTimeout(() => {
				isAttacking.value = false;
			}, 100);
		}
	}
};


const greenCat_explosiveGodSlam = {
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
					cooldownDuration: 350,
					count: 1,
					countMax: 1,
					countRegen: 1,
					function: (self, isAttacking) => {
							let skill = greenCat_explosiveGodSlam;
							let enemies = self.enemies;
		if ((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && self.canMove && !self.isChargeAttacking && !self.isGrounded) {
			let enemy;
			if (skill.cooldown === 0) skill.cooldown = skill.cooldownDuration;
			self.velocityResetFrames = 5;
			self.stamina -= skill.staminaCost;
			self.energy -= skill.energyCost;
			self.staminaRegenDelay = 80;
			skill.count -= 1; 

			let s = setInterval( () => {
				self.velocity.x = 0;
				self.velocity.y = 50;
				self.canMove = false;

				if (self.isGrounded) {
					let attackBox = {
						position: {
							x: self.position.x + skill.offset.x + self.size.width,
							y: self.position.y + skill.offset.y,
							rotation: skill.offset.rotation
						},
						size: skill.size
					}
					isAttacking.value = true;
					for (let i in enemies) {
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
								enemy.tookDamage(skill.damage, direction, true, 2, 20, true);
								self.energyGain(skill.damage);
							}
						}
					}
					setTimeout( () => {
						isAttacking.value = false;
						self.velocity.y = 0;
					}, 100)
					clearInterval(s);
				}
			}, 100)
		}
	}
};


const greenCat_assaultArmor = {
					damage: 800,
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
					countRegen: 1,
					function: (self, isAttacking) => {
							let skill = greenCat_assaultArmor;
							let enemies = self.enemies;
		if ((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && self.canMove || self.isChargeAttacking) {
			if (!self.isChargeAttacking) {
				if (skill.cooldown === 0) skill.cooldown = skill.cooldownDuration;
				self.stamina -= skill.staminaCost;
				self.energy -= skill.energyCost;
				self.staminaRegenDelay = 80;
				skill.count -= 1;
				self.chargeAttackDelay = 100;
				self.isChargeAttacking = true;
			}

			let charge = setInterval( () => {

				if (self.isChargeAttacking && self.chargeAttackDelay <= 0) {
					self.velocityResetFrames = 20;
					let enemy;
					let enemyBubble;
					let direction;
					let knockbackPower = 30;
					let bubble = {
						position: {
							x: self.position.x + self.size.width/2,
							y: self.position.y + self.size.height/2,
							rotation: 0
						}
					}
					let radius = skill.size.radius;
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
							else if (enemyBubble.position.x > bubble.position.x) direction = 'right';
							else {
								if (enemyBubble.position.x < canvas_width/2) direction = 'right';
								else if (enemyBubble.position.x > canvas_width/2) direction = 'left';
							}
							let angle;
							angle = Math.atan((enemyBubble.position.y - bubble.position.y)/(enemyBubble.position.x - bubble.position.x));
							if (enemyBubble.position.x - bubble.position.x === 0) angle = Math.PI/4;
							enemy.tookDamage(skill.damage, direction, true, Math.cos(angle)*knockbackPower+10,Math.sin(angle+Math.PI/6)*knockbackPower, true);
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
					for (let i in effects) {
						enemy = effects[i];
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

					isAttacking.value = true;
					self.isMoving = false;
					self.canMove = false;

					let shield = setInterval( () => {
						if (self.player === 1) keys.tab.pressed = true;
						else if (self.player === 2) keys.enter.pressed = true;
					}, 10)
					screenShake(800);
					setTimeout( () => {
						isAttacking.value = false;
						clearInterval(shield);
						if (self.player === 1) keys.tab.pressed = false;
						else if (self.player === 2) keys.enter.pressed = false;
					}, 400)
					clearInterval(charge);
				}

			}, 10) //
				
		}
	}
};


const greenCat_antiGravityFish = {
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
					staminaCost: 1.0,
					energyCost: 2.5,
					cooldown: 0,
					cooldownDuration: 4.20,
					count: 1,
					countMax: 1,
					countRegen: 1,
					function: (self, isAttacking) => {
							let skill = greenCat_antiGravityFish;
							let enemies = self.enemies;
		if ((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && self.canMove && !self.isChargeAttacking) {
			let bullet = greenCat_projectiles.tuna;
			if (skill.cooldown === 0) skill.cooldown = skill.cooldownDuration;
			self.stamina -= skill.staminaCost;
			self.staminaRegenDelay = 80;
			self.energy -= skill.energyCost;
			skill.count -= 1;
			
			bullet.direction = self.direction;
			
			let shots = setInterval( () => {
				let result;
				bullet.position = {
					x: self.position.x,
					y: self.position.y + skill.offset.y,
					rotation: -90
				}
				result = new Projectile(self.player, bullet);
				result.velocity = {
					x: 0,
					y: 0
				};
			}, 80)
			setTimeout( () => {
				clearInterval(shots);
			}, 250)
			self.dash(false);
		}
	}
};


const greenCat_multiSlash = {
					damage: 0,
					size: {
						width: 0,
						height: 0,
						radius: 0
					},
					offset: {
						x: 0,
						y: 0,
						rotation: 0
					},
					shape: 'none',
					staminaCost: 10,
					energyCost: 25,
					cooldown: 0,
					cooldownDuration: 450,
					count: 1,
					countMax: 1,
					countRegen: 1,
					function: (self, isAttacking) => {
							let skill = greenCat_multiSlash;
							let enemies = self.enemies;
		if ((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && self.canMove && !self.isChargeAttacking) {
			if (skill.cooldown === 0) skill.cooldown = skill.cooldownDuration;
			self.stamina -= skill.staminaCost;
			self.staminaRegenDelay = 80;
			self.energy -= skill.energyCost;
			skill.count -= 1;

			let slasher = new Minion(self.player, greenCat_minions.slasher);
			slasher.position = {
				x: self.position.x + 25,
				y: self.position.y + self.size.height - greenCat_minions.slasher.size.height,
				rotation: 0
			}
			slasher.velocity = {
				x: 0,
				y: 0
			}
			slasher.extra.counter = 2;
			slasher.direction = self.direction;
			self.dash(false)
		}
	}
};


const greenCat_chorusJutsu = {
					damage: 0,
					size: {
						width: 0,
						height: 0,
						radius: 0
					},
					offset: {
						x: 0,
						y: 0,
						rotation: 0
					},
					shape: 'none',
					staminaCost: 10,
					energyCost: 10,
					cooldown: 0,
					cooldownDuration: 450,
					count: 1,
					countMax: 1,
					countRegen: 1,
					function: (self, isAttacking) => {
							let skill = greenCat_chorusJutsu;
							let enemies = self.enemies;
		if ((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && self.canMove && !self.isChargeAttacking) {
			if (skill.cooldown === 0) skill.cooldown = skill.cooldownDuration;
			self.stamina -= skill.staminaCost;
			self.staminaRegenDelay = 80;
			self.energy -= skill.energyCost;
			skill.count -= 1;

			let speed = 30;
			let enemy;
			if (self.player === 1) enemy = player2;
			else if (self.player === 2) enemy = player1;

			let centerX = (self.position.x - self.size.width/2) - (enemy.position.x - enemy.size.width/2);
			let centerY = (self.position.y - self.size.height/2) - (enemy.position.y - enemy.size.height/2);
			let rot = Math.atan(centerY/centerX);

			let velocityX = Math.cos(rot) * speed;
			let velocityY = Math.sin(rot) * speed;
			if (centerX >= 0) {
				velocityX *= -1;
				velocityY *= -1;
			}
			velocityY -= getDistance(self, enemy)*0.015;

			let pearl = new Projectile(self.player, greenCat_projectiles.pearl);
			pearl.position = {
				x: self.position.x + (self.size.width - pearl.size.width)/2,
				y: self.position.y + (self.size.height - pearl.size.height)/2,
				rotation: 0
			}
			pearl.velocity = {
				x: velocityX,
				y: velocityY,
			}
		}
	}
};


const greenCat_primalArmor = {
					damage: 0,
					size: {
						width: 0,
						height: 0,
						radius: 80
					},
					offset: {
						x: 0,
						y: 20,
						rotation: 0
					},
					shape: 'circle',
					staminaCost: 20,
					energyCost: 20,
					cooldown: 0,
					cooldownDuration: 1200,
					count: 0,
					countMax: 1,
					countRegen: 1,
					function: (self, isAttacking) => {
						let skill = greenCat_primalArmor;
						let attacks = greenCat_primalArmor;
		if ((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && !self.isChargeAttacking && !self.isAttacking.ult.value) {
			attacks.cooldown = attacks.cooldownDuration;
			self.stamina = 100;
			self.staminaRegenDelay = 80;
			self.energy -= attacks.energyCost;
			attacks.count -= 1;
			self.velocityResetFrames = 10;

			isAttacking.value = true;
			self.damageTakenMultiplier -= 0.4;
			self.speedMultiplier += 0.5;
			self.canBeStaggered = false;
			self.staminaRegen += 1;


			setTimeout( () => {
				isAttacking.value = false;
				self.damageTakenMultiplier += 0.4;
				self.speedMultiplier -= 0.5;
				self.staminaRegen -= 1;
				self.canBeStaggered = true;
			}, 3500)
		}
	}
};

	// Ultimate
const greenCat_theThousandPawStrike = {
					damage: 0,
					size: {
						width: 0,
						height: 0,
						radius: 0
					},
					offset: {
						x: 0,
						y: 0,
						rotation: 0
					},
					shape: 'none',
					staminaCost: 0,
					energyCost: 0,
					cooldown: 0,
					cooldownDuration: 1000,
					count: 1,
					countMax: 1,
					countRegen: 1,
					function: (self) => {
		// self.attacks.ult.count--;
		ultimateFreeze(self);
		freezeFrame(80);

		self.dash(false);
		let enemy = self.enemies[0];
		let stillDashing = true;
		
		setTimeout( () => {
			if (self.isDashing) {
				self.isDashing = false;
				self.velocity.x *= 0.5;
				self.acceleration.x = 0;
				self.velocity.y = 0;
			}

			if (stillDashing) clearInterval(collide);
		}, 1650);

		let collide = setInterval( () => {
			if (rectangularCollision(self, enemy)) {
				stillDashing = false;
				self.canMove = false;
				self.isMoving = false;
				self.canBeStaggered = false;
				self.isUsingPhysics = false;
				clearInterval(collide);

				self.isAttacking.ult = true;
				let nyoom = new Minion(self.player, greenCat_minions.striker);
				nyoom.position = self.position;
				setTimeout( () => {
					nyoom.isDestroyed = true;
					nyoom.isIrrelevant = true;
					self.canMove = true;
					self.canBeStaggered = true;
					self.isUsingPhysics = true;
				}, 5000)
			}
		}, 10)
	}
}

export const greenCat_moveset = {
	catSlash: greenCat_catSlash,
	catTheBatSmash: greenCat_catTheBatSmash,
	explosiveGodSlam: greenCat_explosiveGodSlam,
	antiGravityFish: greenCat_antiGravityFish,
	assaultArmor: greenCat_assaultArmor,
	primalArmor: greenCat_primalArmor,
	multiSlash: greenCat_multiSlash,
	chorusJutsu: greenCat_chorusJutsu,
	theThousandPawStrike: greenCat_theThousandPawStrike // Ultimate
}




























































































// Riley Roulette
const rileyRoulette_tommyGun = {
						damage: 0,
						size: {
							width: 0,
							height: 0,
							radius: 0
						},
						offset: {
							x: 0,
							y: 0,
							rotation: 0
						},
						shape: 'none',
						staminaCost: 2,
						energyCost: 0,
						cooldown: 0,
						cooldownDuration: 10,
						count: 60,
						countMax: 60,
						countRegen: 1,
						function: (self, isAttacking) => {
							let skill = rileyRoulette_tommyGun;
							let enemies = self.enemies;
		let enemy = self.enemies[0];
		let recoil = 10;
		let centerX = (self.position.x + self.size.width/2) - (enemy.position.x + enemy.size.width/2);
		let centerY = (self.position.y + self.size.height/2) - (enemy.position.y + enemy.size.height/2);
		let rot = Math.atan(centerY/centerX) * 180/Math.PI;
		if (centerX === 0) rot *= -1;
		if ((enemy.position.x + enemy.size.width/2) < (self.position.x + self.size.width/2)) self.directionUpdate(true, 'left'); 
		else self.directionUpdate(true, 'right');
		self.position.rotation = rot;
		rot += Math.floor(Math.random()*recoil - recoil/2);
		
		if (skill.cooldown < 6 && (self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && self.canMove && !self.isChargeAttacking) {
			skill.cooldown = skill.cooldownDuration;
			self.stamina -= skill.staminaCost;
			self.energy -= skill.energyCost;
			self.staminaRegenDelay = 80;
			skill.count -= 1;
			isAttacking.value = true;
			self.rotationUpdateDelay = 16;
			
			let bullet = rileyRoulette_projectiles.rifleShot;
			let speed = 30;
			

			let velocityX = Math.cos(rot * Math.PI/180) * speed;
			let velocityY = Math.sin(rot * Math.PI/180) * speed;
			skill.offset.rotation = rot;

			if (bullet.velocity.x > 0) bullet.direction = 'right';
			else if (bullet.velocity.x < 0) bullet.direction = 'left';
			else {
				if (self.position.x < canvas_width/2) bullet.direction = 'right';
				else if (self.position.x > canvas_width/2) bullet.direction = 'left';
			}
			if ((enemy.position.x + enemy.size.width/2) < (self.position.x + self.size.width/2)) {
				velocityX *= -1;
				velocityY *= -1;
			}
				

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
};


const rileyRoulette_theTouch = {
						damage: 0,
						size: {
							width: 0,
							height: 0,
							radius: 0
						},
						offset: {
							x: 25,
							y: 25,
							rotation: 0
						},
						shape: 'none',
						staminaCost: 5,
						energyCost: 10,
						cooldown: 0,
						cooldownDuration: 6000,
						count: 6,
						countMax: 6,
						countRegen: 6,
						function: (self, isAttacking) => {
							let skill = rileyRoulette_theTouch;
							let enemies = self.enemies;
		if ((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && self.canMove && !isAttacking.value && !self.isChargeAttacking) {
			if (skill.cooldown === 0) skill.cooldown = skill.cooldownDuration;
			self.directionUpdate();
			self.stamina -= skill.staminaCost;
			self.energy -= skill.energyCost;
			self.staminaRegenDelay = 80;
			skill.count -= 1;
			isAttacking.value = true;
			self.rotationUpdateDelay = 40;
			let enemy = self.enemies[0];
			let bullet = rileyRoulette_projectiles.revolverShot;
			let speed = 45;
			let sideX;
			let side;
			let velocityX;
			let velocityY;
			let rot;
			let limit = 45 * Math.PI/180;
			

			setTimeout( () => {
				rot = Math.atan((self.position.y-enemy.position.y)/(self.position.x-enemy.position.x));
				if (rot > limit) rot = limit;
				else if (rot < -limit) rot = -limit;

				if (self.direction == "right") {
					velocityX = speed*Math.cos(rot);
					sideX = self.size.width;
				}
				else if (self.direction == "left") {
					velocityX = -speed*Math.cos(rot);
					sideX = -rileyRoulette_projectiles.revolverShot.size.width;
				}
				if (self.position.x >= enemy.position.x) rot *= -1;
				velocityY = speed*Math.sin(rot);
				bullet.direction = self.direction;

				bullet.position = {
					x: self.position.x + sideX,
					y: self.position.y + skill.offset.y,
					rotation: 0
				}
				if (self.direction == "right") bullet.position.rotation = rot * 180/Math.PI;
				else if (self.direction == "left") bullet.position.rotation = -rot * 180/Math.PI;
					bullet = new Projectile(self.player, bullet);
					bullet.velocity = {
						x: velocityX,
						y: velocityY
					};
				self.velocity.y = -5;
				let recoil = setInterval( () => {
					if (self.direction == 'right') self.velocity.x = -10;
					else if (self.direction == 'left') self.velocity.x = 10;
				}, 1);
				setTimeout(() => {
					clearInterval(recoil);
				}, 200);
			}, 240)

			let stop = setInterval( () => {
				self.canMove = false;
				self.isMoving = false;
				rot = Math.atan((self.position.y-enemy.position.y)/(self.position.x-enemy.position.x));
				if (rot > Math.PI*0.25) rot = Math.PI*0.25;
				else if (rot < -Math.PI*0.25) rot = -Math.PI*0.25;
				if (self.position.x >= enemy.position.x) rot *= -1;

				if (self.direction == 'right') self.position.rotation = rot * 180/Math.PI;
				else if (self.direction == 'left') self.position.rotation = -rot * 180/Math.PI;
			}, 1)
			setTimeout(() => {
				clearInterval(stop);
				isAttacking.value = false;
			}, 1400);
		}
	}
};


const rileyRoulette_joyride = {
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
						countRegen: 1,
						function: (self, isAttacking) => {
							let skill = rileyRoulette_joyride;
							let enemies = self.enemies;
		if ((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && self.canMove && !self.isGrounded && !self.isChargeAttacking) {
			if (skill.cooldown === 0) skill.cooldown = skill.cooldownDuration;
			self.stamina -= skill.staminaCost;
			self.energy -= skill.energyCost;
			self.staminaRegenDelay = 80;
			skill.count -= 1;
			let enemies = self.enemies;
			let enemy;
			let velocityX = self.velocity.x;
			isAttacking.value = true;

			let shots = setInterval( () => {
				self.velocity.y = -5;
				self.velocity.x = velocityX;
				for (let i in enemies) {
					let attackBox = {
						position: {
							x: self.position.x + 10,
							y: self.position.y + self.size.height
						},
						size: skill.size
					}
					if (rectangularCollision(attackBox, enemies[i])) {
						enemy = enemies[i];
						enemy.tookDamage(skill.damage, self.direction);
						self.energyGain(skill.damage);
						if (self.direction == 'right') enemy.velocity.x = 10;
						else if (self.direction == 'left') enemy.velocity.x = -10;
					}
				}
			}, 50);
			setTimeout(() => {
				clearInterval(shots);
				isAttacking.value = false;
			}, 400);
		}
	}
};

const rileyRoulette_heavyArms = {
						damage: 0,
						size: {
							width: 0,
							height: 0,
							radius: 0
						},
						offset: {
							x: 40,
							y: 40,
							rotation: 0
						},
						shape: 'rectangle',
						staminaCost: 2.0,
						energyCost: 3.0,
						cooldown: 0,
						cooldownDuration: 40.0,
						count: 1,
						countMax: 1,
						countRegen: 1,
						function: (self, isAttacking) => {
							let skill = rileyRoulette_heavyArms;
							let enemies = self.enemies;
		if ((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && self.canMove && !self.isChargeAttacking) {
			if (skill.cooldown === 0) skill.cooldown = skill.cooldownDuration;
			self.stamina -= skill.staminaCost;
			self.energy -= skill.energyCost;
			self.staminaRegenDelay = 80;
			skill.count -= 1;
			self.directionUpdate();

			let enemy = self.enemies[0];
			isAttacking.value = true;
			self.isMoving = true;
			self.chargeAttackDelay = 35;


			let side;
			let rot
			if (self.direction == "right") {
				side = 1;
				rot = -90;
			}
			else if (self.direction == "left") {
				side = -1;
				rot = -90;
			}
			self.velocity.y = -25;

			let bullet = rileyRoulette_projectiles.missile;
			bullet.direction = self.direction;
			rot -= 15*side;
			let shots = setInterval( () => {
				let result;
				rot += 105*side;
				rot %= 360;
				bullet.position = {
					x: self.position.x + skill.offset.x,
					y: self.position.y + skill.offset.y,
					rotation: rot
				}
				result = new Projectile(self.player, bullet);
				result.velocity = {
					x: 0,
					y: 0
				};
				if (self.isStaggered) {
					clearInterval(shots);
					clearInterval(stop);
					self.chargeAttackDelay = 0;
				}
			}, 60)

			let stop = setInterval( () => {
				self.velocity.x = -4 * side;
			}, 10);
			setTimeout( () => {
				clearInterval(stop);
				clearInterval(shots);
			}, 600);
		}
	}
};

const rileyRoulette_rainingBombs = {
					damage: 0,
					size: {
						width: 0,
						height: 0,
						radius: 0
					},
					offset: {
						x: 0,
						y: 0,
						rotation: 0
					},
					shape: 'none',
					staminaCost: 1.0,
					energyCost: 1.0,
					cooldown: 0,
					cooldownDuration: 45.0,
					count: 1,
					countMax: 1,
					countRegen: 1,
					function: (self, isAttacking) => {
							let skill = rileyRoulette_rainingBombs;
							let enemies = self.enemies;
		if ((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && self.canMove && !self.isChargeAttacking) {
			if (skill.cooldown === 0) skill.cooldown = skill.cooldownDuration;
			self.stamina -= skill.staminaCost;
			self.staminaRegenDelay = 80;
			self.energy -= skill.energyCost;
			skill.count -= 1;
			self.directionUpdateDelay = 20;
			isAttacking.value = true;



			let speed = 10;
			let enemy;
			if (self.player === 1) enemy = player2;
			else if (self.player === 2) enemy = player1;

			let throws = setInterval( () => {
				let centerX = (self.position.x - self.size.width/2) - (enemy.position.x - enemy.size.width/2);
				let centerY = (self.position.y - self.size.height/2) - (enemy.position.y - enemy.size.height/2);
				let rot = Math.atan(centerY/centerX) + Math.floor(Math.random()*30 - 15)*Math.PI/180;

				let velocityX = Math.cos(rot) * speed;
				let velocityY = Math.sin(rot) * speed;
				if (centerX >= 0) {
					velocityX *= -1;
					velocityY *= -1;
					self.direction = 'left';
				}
				else self.direction = 'right';
				velocityY -= getDistance(self, enemy)*0.04;

				let grenade = new Projectile(self.player, rileyRoulette_projectiles.grenade);
				grenade.position = {
					x: self.position.x + (self.size.width - grenade.size.width)/2,
					y: self.position.y + (self.size.height - grenade.size.height)/2,
					rotation: 0
				}
				grenade.velocity = {
					x: velocityX,
					y: velocityY,
				}
			}, 50)


			setTimeout( () => {
				isAttacking.value = false;
				clearInterval(throws);
			}, 320)
		}
	}
};

const rileyRoulette_angelWithAShotgun = {
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
						staminaCost: 20,
						energyCost: 30,
						cooldown: 0,
						cooldownDuration: 300,
						count: 1,
						countMax: 1,
						countRegen: 1,
						function: (self, isAttacking) => {
							let skill = rileyRoulette_angelWithAShotgun;
							let enemies = self.enemies;
		if ((((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0)) && self.canMove) && !self.isChargeAttacking) {
			if (!self.isChargeAttacking) {
				self.isChargeAttacking = true;
				self.chargeAttackDelay = 40;
				skill.cooldown = skill.cooldownDuration;
				self.stamina -= skill.staminaCost;
				self.energy -= skill.energyCost;
				skill.count -= 1;
			}
			self.staminaRegenDelay = 80;
			let enemy;
			let sideX;
			let knockbackPower = 10;

			let charge = setInterval( () => {

				if (self.isChargeAttacking && self.chargeAttackDelay <= 0) {
					self.isChargeAttacking = false;
					let stop = setInterval( () => {
						self.canMove = false;
						self.isMoving = false;

						if (self.direction == 'right') self.velocity.x = -knockbackPower;
						else if (self.direction == 'left') self.velocity.x = knockbackPower;
					}, 1)

					self.directionUpdate();
					isAttacking.value = true;
					self.velocity.y = -knockbackPower;

					if (self.direction == 'right') sideX = self.size.width + skill.offset.x;
					else if (self.direction == 'left') sideX = -skill.size.width - skill.offset.x;

					for (let i in enemies) {
						let attackBox = {
							position: {
								x: self.position.x + sideX,
								y: self.position.y + skill.offset.y
							},
							size: skill.size
						}
						if (rectangularCollision(attackBox, enemies[i])) {
							enemy = enemies[i];
							if (self.direction == 'right') sideX = 10;
							else if (self.direction == 'left') sideX = -10;

							enemy.tookDamage(skill.damage, self.direction, false, 10, 10, true);
							self.energyGain(skill.damage);
						}
					}
					setTimeout( () => {
						isAttacking.value = false;
						clearInterval(stop)
					}, 50)

					setTimeout( () => {
						let stop = setInterval( () => {
							self.canMove = false;
							self.isMoving = false;

							if (self.direction == 'right') self.velocity.x = -knockbackPower;
							else if (self.direction == 'left') self.velocity.x = knockbackPower;
						}, 1)

						self.directionUpdate();
						isAttacking.value = true;
						self.velocity.y = -knockbackPower;

						if (self.direction == 'right')	sideX = self.size.width + skill.offset.x;
						else if (self.direction == 'left') sideX = -skill.size.width - skill.offset.x;

						for (let i in enemies) {
							let attackBox = {
								position: {
									x: self.position.x + sideX,
									y: self.position.y + skill.offset.y
								},
								size: skill.size
							}
							if (rectangularCollision(attackBox, enemies[i])) {
								enemy = enemies[i];
								if (self.direction == 'right') sideX = 10;
								else if (self.direction == 'left') sideX = -10;

								enemy.tookDamage(skill.damage, self.direction, false, 10, 10);
								self.energyGain(skill.damage);
							}
						}
						setTimeout( () => {
							isAttacking.value = false;
							clearInterval(stop);
						}, 50)
						clearInterval(charge);
					}, 300);
				}

			}, 10) //	
		}
	}
};


const rileyRoulette_bulletHell = {
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
						countRegen: 1,
						function: (self, isAttacking) => {
							let skill = rileyRoulette_bulletHell;
							let enemies = self.enemies;
		if (skill.cooldown < 480 && (self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && !self.isChargeAttacking && self.canMove) {
			if (skill.cooldown === 0) skill.cooldown = skill.cooldownDuration;
			self.stamina -= skill.staminaCost;
			self.energy -= skill.energyCost;
			self.staminaRegenDelay = 80;
			skill.count -= 1;

			let gun = rileyRoulette_minions.bulletOrbit;
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
				y: self.position.y + skill.offset.y,
				rotation: 0
			}
			gun = new Minion(self.player, gun);
		}
	}
};


const rileyRoulette_gottschreck = {
						damage: 0,
						size: {
							width: 0,
							height: 0,
							radius: 0
						},
						offset: {
							x: 0,
							y: 0,
							rotation: 0
						},
						shape: 'none',
						staminaCost: 0,
						energyCost: 20,
						cooldown: 0,
						cooldownDuration: 680,
						count: 2,
						countMax: 2,
						countRegen: 2,
						function: (self, isAttacking) => {
							let skill = rileyRoulette_gottschreck;
							let enemies = self.enemies;
		if ((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && !self.isChargeAttacking && self.canMove) {
			if (skill.cooldown === 0 && skill.count === 2) {
				skill.cooldown = 1000;
				skill.count -= 1;
				self.stamina -= skill.staminaCost;
				self.energy -= skill.energyCost;

				isAttacking.value = true;
				self.index = minions.length;
				let bazooka = rileyRoulette_minions.bazookaOrbit;
				bazooka.extra.fire = false;
				bazooka.extra.hasExisted = false;
				bazooka.attackMode = 1;
				bazooka = new Minion(self.player, rileyRoulette_minions.bazookaOrbit);
			}
			else if (isAttacking.value && skill.cooldown < 990 && skill.count === 1) {
				skill.cooldown = skill.cooldownDuration;
				self.stamina -= skill.staminaCost;
				self.energy -= skill.energyCost;
				self.staminaRegenDelay = 80;
				skill.count -= 1;

				let bazooka = minions[self.index];
				isAttacking.value = false;
				self.index = null;

				bazooka.extra.fire = true;
			}
		}
	}
};


const rileyRoulette_voidScythe = {
						damage: 0,
						size: {
							width: 0,
							height: 0,
							radius: 0
						},
						offset: {
							x: 0,
							y: 0,
							rotation: 0
						},
						shape: 'none',
						staminaCost: 10,
						energyCost: 10,
						cooldown: 0,
						cooldownDuration: 900,
						count: 0,
						countMax: 1,
						countRegen: 1,
						function: (self, isAttacking) => {
							let skill = rileyRoulette_voidScythe;
							let enemies = self.enemies;
		if ((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0)) {
			skill.cooldown = skill.cooldownDuration;
			self.stamina -= skill.staminaCost;
			self.energy -= skill.energyCost;
			skill.count -= 1;

			let scythe = rileyRoulette_minions.scythe;
			scythe.position = {
				x: self.position.x + (self.size.width - scythe.size.width)/2,
				y: self.position.y + (self.size.height + scythe.size.height)/2,
				rotation: 0
			}
			scythe.extra.counter = 0;
			scythe.direction = self.direction;
			if (self.direction == 'right') scythe.velocity.x = 10;
			else if (self.direction == 'left') scythe.velocity.x = -10;
			scythe = new Minion(self.player, scythe);
			setTimeout( () => {
				scythe.isDestroyed = true;
				scythe.isIrrelevant = true;
			}, 800)
		}
	}
};

const rileyRoulette_macrossMissileMassacre = {
					damage: 0,
					size: {
						width: 0,
						height: 0,
						radius: 0
					},
					offset: {
						x: 50,
						y: 20,
						rotation: 0
					},
					shape: 'none',
					staminaCost: 1.0,
					energyCost: 2.5,
					cooldown: 0,
					cooldownDuration: 42.0,
					count: 1,
					countMax: 1,
					countRegen: 1,
					function: (self, isAttacking) => {
							let skill = rileyRoulette_macrossMissileMassacre;
							let enemies = self.enemies;
		if ((self.stamina - skill.staminaCost >= 0) && (self.energy - skill.energyCost >= 0) && self.canMove && !self.isChargeAttacking) {
			let bullet = rileyRoulette_projectiles.missile;
			if (skill.cooldown === 0) skill.cooldown = skill.cooldownDuration;
			self.stamina -= skill.staminaCost;
			self.staminaRegenDelay = 80;
			self.energy -= skill.energyCost;
			skill.count -= 1;
			self.directionUpdate();

			self.isChargeAttacking = true;
			self.chargeAttackDelay = 110;
			
			setTimeout( () => {
				self.velocityResetFrames = 100;
				bullet.direction = self.direction;
				let side;
				let rot;
				if (self.direction == "right") {
					side = 1;
					rot = -90;
				}
				else if (self.direction == "left") {
					side = -1;
					rot = -90;
				}
				rot -= 15*side;

				
				let shots = setInterval( () => {
					let result;
					rot += 105*side;
					rot %= 360;
					bullet.position = {
						x: self.position.x + skill.offset.x,
						y: self.position.y + skill.offset.y,
						rotation: rot
					}
					result = new Projectile(self.player, bullet);
					result.velocity = {
						x: 0,
						y: 0
					};
					if (self.isStaggered) {
						clearInterval(shots);
						self.isChargeAttacking = false;
					}
				}, 30)
				setTimeout( () => {
					clearInterval(shots);
					self.isChargeAttacking = false;
				}, 1500)
			}, 160)
		}
	}
};

	// Ultimate
const rileyRoulette_armedBattalion = {
					damage: 0,
					size: {
						width: 0,
						height: 0,
						radius: 0
					},
					offset: {
						x: 0,
						y: 50,
						rotation: 0
					},
					shape: 'none',
					staminaCost: 0,
					energyCost: 15,
					cooldown: 0,
					cooldownDuration: 500,
					count: 2,
					countMax: 2,
					countRegen: 1,
					function: (self) => {
		//self.attacks.ult.count--;
		ultimateFreeze(self);
		freezeFrame(80);


		let side;
		if (self.direction == 'right') side = 1;
		else if (self.direction == 'left') side = -1;
		self.velocity.x = -25*side;
		self.velocity.y = -15;

		let speed = 40;
		let bullet = new Projectile(self.player, rileyRoulette_projectiles.ultimateShot);
		bullet.position = {
			x: self.position.x + self.attacks.ult.offset.x * side,
			y: self.position.y + self.attacks.ult.offset.y,
			rotation: 0
		}
		bullet.velocity.x = speed * side;
		bullet.direction = self.direction;
	}
}

export const rileyRoulette_moveset = {
	tommyGun: rileyRoulette_tommyGun,
	theTouch: rileyRoulette_theTouch,
	joyride: rileyRoulette_joyride,
	heavyArms: rileyRoulette_heavyArms,
	rainingBombs: rileyRoulette_rainingBombs,
	angelWithAShotgun: rileyRoulette_angelWithAShotgun,
	bulletHell: rileyRoulette_bulletHell,
	gottschreck: rileyRoulette_gottschreck,
	voidScythe: rileyRoulette_voidScythe,
	macrossMissileMassacre: rileyRoulette_macrossMissileMassacre,
	armedBattalion: rileyRoulette_armedBattalion // Ultimate
};

























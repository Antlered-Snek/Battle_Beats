



import print from './main.js'
import { c2, canvas_height, canvas_width, gravity, dashTime, drag, gameFrame } from './universalVar.js'
import { rectangularCollision, freezeFrame, screenShake, getDistance } from './functions.js'
import { keys } from './inputHandler.js'
import { player1, player2 } from './players.js'
import Minion, { minions, greenCat_minions, rileyRoulette_minions } from './minions.js'
import Projectile, { projectiles, greenCat_projectiles, rileyRoulette_projectiles } from './projectiles.js'
import Platform, { platforms } from './platforms.js'
import { force_sprite, slash_sprite } from './sprites.js'

export var mainMenu = [];

export default class MainMenu {
	constructor(player=0, {position, sizePerGrid, action, section, color='white', spriteInfo=null}) {

		// Variable Attributes
		this.player = player;
		this.position = position;
		this.sizePerGrid = sizePerGrid;
		this.gridSize = {
			col: section[0].length,
			row: section.length
		}
		this.section = section;
		this.color = color;
		this.spriteInfo = spriteInfo;

		// State Attributes
		this.isIrrelevant = false;
		mainMenu.push(this);
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
			c2.translate(this.position.x, this.position.y);
			c2.rotate(this.position.rotation * Math.PI / 180);
			c2.fillRect(0, 0, this.sizePerGrid.width * this.gridSize.col, this.sizePerGrid.height * this.gridSize.row);
			c2.translate(0, 0);
			c2.setTransform(1, 0, 0, 1, 0, 0);

			for (let i=0; i<this.gridSize.row; i++) {
				for (let j=0; j<this.gridSize.col; j++) {

					let sect;
					if (this.section[i][j] != null) sect = this.section[i][j];
					else continue;

					c2.fillStyle = sect.color;
					c2.translate((this.position.x+j*this.sizePerGrid.width) + (this.sizePerGrid.width-sect.size.width)*0.5, (this.position.y+i*this.sizePerGrid.height) + (this.sizePerGrid.height-sect.size.height)*0.5);
					c2.rotate(this.position.rotation * Math.PI / 180);
					c2.fillRect(0, 0, sect.size.width, sect.size.height);
					c2.translate(0, 0);
					c2.setTransform(1, 0, 0, 1, 0, 0);

				}
			}
		}
	}

	action() {
		this.action();
	}

	update() {
		if (!this.isIrrelevant) this.draw();
	}
}


















// Objects
export const pauseMenu = {
	position: {
		x: (canvas_width-300)/2,
		y: (canvas_height-300)/2,
		rotation: 0
	},
	sizePerGrid: {
		width: 300,
		height: 100,
	},
	actions: () => {

	},
	section: [
		[
			{
				size: {
					width: 150,
					height: 50
				},
				event: () => {
					
				},
				color: "red"
			}
		],
		[
			{
				size: {
					width: 150,
					height: 50
				},
				event: () => {

				},
				color: "red"
			}
		],
		[
			{
				size: {
					width: 150,
					height: 50
				},
				event: () => {

				},
				color: "red"
			}
		],
	]
}

export const skillSelection = { //player=0, {position, sizePerGrid, gridSize, section, color='white', spriteInfo=null}
	position: {
		x: 400,
		y: 100,
		rotation: 0
	},
	sizePerGrid: {
		width: 200,
		height: 150,
	},
	actions: () => {

	},
	section: [
		[
			{
				size: {
					width: 150,
					height: 120
				},
				event: () => {

				},
				color: "red"
			},
			{
				size: {
					width: 150,
					height: 120
				},
				event: () => {

				},
				color: "red"
			}
		],
		[
			{
				size: {
					width: 150,
					height: 120
				},
				event: () => {

				},
				color: "red"
			},
			{
				size: {
					width: 150,
					height: 120
				},
				event: () => {

				},
				color: "red"
			}
		],
		[
			{
				size: {
					width: 150,
					height: 120
				},
				event: () => {

				},
				color: "red"
			}
		],
	]
}










//const test = new MainMenu(0, skillSelection);
































// Essentials
const canvas = document.querySelector("#action");
export const c = canvas.getContext('2d');

const canvas2 = document.querySelector("#menu");
export const c2 = canvas2.getContext('2d');

// const canvas_stack = new CanvasStack("arena");;

// const arena_layer = canvas_stack.createLayer();
// export const c = document.getElementById(arena_layer).getContext('2d');

// const menu_layer = canvas_stack.createLayer();
// export const c2 = document.getElementById(menu_layer).getContext('2d');



// export const canvas_height = window.innerHeight;
// export const canvas_width = window.innerWidth;

export const canvas_height = 576;
export const canvas_width = 1024;

canvas.height = canvas_height;
canvas.width = canvas_width;
canvas2.height = canvas_height;
canvas2.width = canvas_width;

export var gameFrame = 1;
export var mapFrame = 1;
export function frameUpdate() {
	gameFrame++;
	if (mapFrame >= 7) mapFrame = 1;
	if (gameFrame%20 === 0) mapFrame++;
}



// Universal Variables
export const gravity = 800;
export const dashTime = 50;
export const drag = 10;








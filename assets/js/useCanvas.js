import {arrayElements} from "./elements-storage";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d'); //context

canvas.width = window.innerWidth;     // equals window dimension
canvas.height = window.innerHeight;

document.body.appendChild(canvas);

export {
	ctx,
	canvas
}


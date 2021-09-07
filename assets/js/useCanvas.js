const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d'); //context

canvas.width = window.innerWidth;     // equals window dimension
canvas.height = window.innerHeight;

document.body.appendChild(canvas);

document.body.style.backgroundColor = "rgba(29,28,28,0.86)";

export {
	ctx,
	canvas
}


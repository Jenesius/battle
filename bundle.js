class Unit{
	x;
	y;
	id;

	static _id = 0;

	height;
	width ;

	constructor(width, height) {
		this.height = height;
		this.width  = width;

		this.id = Unit._id++;
	}

	move({x,y}) {
		this.x = x;
		this.y = y;
	}

	select(ctx){
		ctx.strokeStyle = 'rgba(255,0,0,0.43)';
		ctx.lineWidth = 1;

		const margin = 2;

		// draw a red line
		ctx.beginPath();
		ctx.moveTo(this.x - margin, this.y - margin);
		ctx.lineTo(this.x - margin, this.y + this.height + margin);
		ctx.lineTo(this.x + this.width + margin, this.y + this.height + margin);
		ctx.lineTo(this.x + this.width + margin, this.y - margin);
		ctx.lineTo(this.x - margin, this.y - margin);

		ctx.stroke();
	}

	render(ctx){

		ctx.fillStyle = 'blue';
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

}

const arrayElements = [];

function add(element){
	if (!(element instanceof Unit)) return console.warn("Each Element of canvas's structure should be a child of Unit class");

	arrayElements.push(element);
}

const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d'); //context

canvas.width = window.innerWidth;     // equals window dimension
canvas.height = window.innerHeight;

document.body.appendChild(canvas);

const arraySelectedElements = [];

function select(array = []){
	arraySelectedElements.splice(0, arraySelectedElements.length);

	if (!Array.isArray(array)) return console.warn("Select function get only Array type. Provided: ", array);

	arraySelectedElements.push(...array);
}


/**
 * Checking that element stay inside selected area
 * @return Boolean
 * */
function checkSelectedElement(element, cordStart, cordEnd){
	/**
	 * Function check if number is between start's and end's values
	 * @return Boolean
	 * */
	function between(v, start, end) {
		let min = Math.min(start, end);
		let max = Math.max(start, end);

		return (v <= max && v >=min);
	}

	return (between(element.x, cordStart.x, cordEnd.x) && between(element.y, cordStart.y, cordEnd.y));
}

class Cord{
	x;
	y;
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

}

const item1 = new Unit(5, 10);
const item2 = new Unit(3, 3);
const item3 = new Unit(2, 2);
const item4 = new Unit(2, 2);
const item5 = new Unit(2, 2);


add(item1);
add(item2);
add(item3);
add(item4);
add(item5);


item1.move({x: 40, y: 20});
item2.move({x: 30, y: 10});
item3.move({x: 130, y: 100});
item4.move({x: 130, y: 120});
item5.move({x: 130, y: 140});

const fps = 30;
setInterval(() => {

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	arrayElements.forEach(element => {
		element.render(ctx);
	});

	arraySelectedElements.forEach(element => {
		element.select(ctx);
	});

}, 1000 / fps);




canvas.addEventListener("mousedown", e => {

	const startCord = new Cord(e.x, e.y);
	let   endCord 	= null;


	function onEnd(e){
		endCord = new Cord(e.x, e.y);

		let arraySelect = arrayElements.filter(element => checkSelectedElement(element, startCord, endCord));

		select(arraySelect);

		canvas.removeEventListener("mouseup", onEnd);
	}

	canvas.addEventListener("mouseup", onEnd);


});

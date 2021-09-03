var config = {
	fps: 30
};

class Unit{
	x;
	y;
	id;

	static _id = 0;

	height;
	width ;
	speed;



	constructor(width, height, speed) {
		this.height = height;
		this.width  = width;
		this.speed  = speed;

		this.id = Unit._id++;
	}

	set position({x,y}){
		this.x = x;
		this.y = y;

		this.moveX = x;
		this.moveY = y;
	}


	moveStep(){

		if (this.moveX === this.x && this.moveY === this.y) return;



		let sizeX = Math.abs(this.moveX - this.x);
		let sizeY = Math.abs(this.moveY - this.y);

		console.log("SizeX and SizeY:", sizeX, sizeY);

		//Гипотенуза
		let sizeC = Math.sqrt(Math.pow(sizeX, 2) + Math.pow(sizeY, 2));
		console.log("SizeC:", sizeC);

		/*SIN
		* Синус угла, который смотрит на сторону sizeY
		* */
		const angel = sizeX / sizeC;

		console.log("Angel",angel);


		/**
		 * Дистанция, которую пройдёт юнит за один такт
		 * В итоге, это новая гипотенуза
		 * */
		let distance = this.speed / (config.fps);

		if (distance > sizeC) {
			this.x = this.moveX;
			this.y = this.moveY;
			return;
		}

		console.log("Distance", distance);


		let newSizeX = distance * angel ;
		let newSizeY = Math.sqrt(Math.pow(distance, 2) - Math.pow(newSizeX, 2)) ;

		if (this.moveX < this.x) newSizeX *= -1;

		if (this.moveY < this.y) newSizeY *= -1;

		this.x += newSizeX;
		this.y += newSizeY;

		return;

	}
	move(cord = null) {
		if (cord === null) {
			return;
		}

		this.moveX = cord.x;
		this.moveY = cord.y;



		/*
		this.x = x;
		this.y = y;*/
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

const item1 = new Unit(5, 10, 50);
const item2 = new Unit(3, 3, 34);
const item3 = new Unit(2, 2, 30);
const item4 = new Unit(2, 2, 20);
const itemFast = new Unit(6, 6, 250);


add(item1);
add(item2);
add(item3);
add(item4);
add(itemFast);


item1.position = ({x: 40, y: 20});
item2.position = ({x: 100, y: 100});
item3.position = ({x: 130, y: 100});
item4.position = ({x: 130, y: 120});
itemFast.position = ({x: 130, y: 140});

window.test = () => {
	itemFast.move({x: 150, y: 200});
};


setInterval(() => {

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	arrayElements.forEach(element => {
		element.moveStep();
		element.render(ctx);
	});

	arraySelectedElements.forEach(element => {
		element.select(ctx);
	});


	if (startCord){
		ctx.fillStyle = 'rgba(213,213,213,0.27)';
		ctx.fillRect(Math.min(startCord.x, endCord.x),Math.min(startCord.y, endCord.y),Math.abs(startCord.x - endCord.x), Math.abs(startCord.y - endCord.y) );
	}


}, 1000 / config.fps);



let startCord   = null;
let   endCord 	= null;



canvas.addEventListener("mousedown", e => {

	if (e.button === 2) {

		e.preventDefault();

		return testMoveSelected(e);

	}

	startCord = new Cord(e.x, e.y);
	endCord = new Cord(e.x, e.y);

	function onMove(e){
		endCord = new Cord(e.x, e.y);
	}



	function onEnd(e){
		endCord = new Cord(e.x, e.y);

		let arraySelect = arrayElements.filter(element => checkSelectedElement(element, startCord, endCord));

		select(arraySelect);

		canvas.removeEventListener("mouseup", onEnd);
		canvas.removeEventListener("mousemove", onMove);

		startCord = null;
		endCord = null;

	}

	canvas.addEventListener("mousemove", onMove);
	canvas.addEventListener("mouseup", onEnd);


});


canvas.addEventListener('contextmenu', e => {
	e.preventDefault();
});

function testMoveSelected(e) {
	if (arraySelectedElements.length === 0) return;

	let item = arraySelectedElements[0];


	let cord = new Cord(e.x, e.y);


	item.move(cord);
}

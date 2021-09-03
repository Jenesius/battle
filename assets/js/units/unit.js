import config from "../config";

export default class Unit{
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

/*
		//На сколько сместится объект по Y
		let newSizeY = distance * angel * (this.moveY < this.y)?(-1):1;

		//На сколько сместится объект по X
		let newSizeX = Math.sqrt(Math.pow(distance,2) - Math.pow(newSizeY, 2)) * (this.moveX < this.x)?(-1):1;

		this.x += newSizeX;
		this.y += newSizeY;

		return;
*/




		let changeX = c;

		if (Math.abs(this.moveX - this.x) < changeX) changeX = Math.abs(this.moveX - this.x);
		if (this.moveX < this.x) changeX *= -1;
		this.x += changeX;

		let changeY = c;

		if (Math.abs(this.moveY - this.y) < changeY) changeY = Math.abs(this.moveY - this.y);
		if (this.moveY < this.y) changeY *= -1;
		this.y += changeY;

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
export default class Unit{
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
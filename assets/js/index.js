import {add, arrayElements} from "./elements-storage";
import Unit from "./units/unit";
import {ctx, canvas} from "./useCanvas";
import {arraySelectedElements, checkSelectedElement, select} from "./useSelect";
import Cord from "./cord";


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
	})

	arraySelectedElements.forEach(element => {
		element.select(ctx);
	})


	if (startCord){
		ctx.fillStyle = 'rgba(213,213,213,0.27)';
		ctx.fillRect(Math.min(startCord.x, endCord.x),Math.min(startCord.y, endCord.y),Math.abs(startCord.x - endCord.x), Math.abs(startCord.y - endCord.y) );
	}


}, 1000 / fps)



let startCord   = null;
let   endCord 	= null;

canvas.addEventListener("mousedown", e => {
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

	canvas.addEventListener("mousemove", onMove)
	canvas.addEventListener("mouseup", onEnd);


})


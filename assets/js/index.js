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

}, 1000 / fps)




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


})


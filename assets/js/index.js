import {add, arrayElements} from "./elements-storage";
import Unit from "./units/unit";
import {ctx, canvas} from "./useCanvas";
import {arraySelectedElements, checkSelectedElement, select} from "./useSelect";
import Cord from "./cord";
import config from "./config";


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
}


setInterval(() => {

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	arrayElements.forEach(element => {
		element.moveStep();
		element.render(ctx);
	})

	arraySelectedElements.forEach(element => {
		element.select(ctx);
	})


	if (startCord){
		ctx.fillStyle = 'rgba(213,213,213,0.27)';
		ctx.fillRect(Math.min(startCord.x, endCord.x),Math.min(startCord.y, endCord.y),Math.abs(startCord.x - endCord.x), Math.abs(startCord.y - endCord.y) );
	}


}, 1000 / config.fps)



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

	canvas.addEventListener("mousemove", onMove)
	canvas.addEventListener("mouseup", onEnd);


})


canvas.addEventListener('contextmenu', e => {
	e.preventDefault();
});

function testMoveSelected(e) {
	if (arraySelectedElements.length === 0) return;

	let item = arraySelectedElements[0];


	let cord = new Cord(e.x, e.y);


	item.move(cord)
}





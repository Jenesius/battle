import {add, arrayElements} from "./elements-storage";
import Unit from "./units/unit";
import {ctx, canvas} from "./useCanvas";
import {arraySelectedElements, checkSelectedElement, select} from "./useSelect";
import Cord from "./cord";
import config from "./config";
import gameStorage from "./gameStorage";

import Interface from "./interface/index";

/**
 * IMPORTING STYLES
 * */
import "./../css/index.css";



import Map from "./map/index";
import Render from "./render/index";

const map = new Map();

gameStorage.map = map;


const item1 = new Unit(5, 5, 50, 13, 13);
const item2 = new Unit(3, 3, 34, 100, 100);
const item3 = new Unit(2, 2, 30, 130, 100);
const item4 = new Unit(2, 2, 20, 130, 120);
const itemFast = new Unit(6, 6, 750, 130, 140);


add(item1);
add(item2);
add(item3);

add(item4);
add(itemFast);



let startCord   = null;
let   endCord 	= null;



 for(let i = 5; i < 30; i ++){
 	map.state[i + 160] = true;
 }


setInterval(() => {

	ctx.clearRect(0, 0, canvas.width, canvas.height);



	/**DRAW MAP LINEs**/
	ctx.fillStyle = '#e9e9e9';
	ctx.fillRect(0,0, map.width, map.height);

	for(let i = 0; i < map.countVertical; i++){
		ctx.strokeStyle = `#bcbcbc`;
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.moveTo(i * config.mapBlock, 0);
		ctx.lineTo(i * config.mapBlock, map.height);
		ctx.closePath();
		ctx.stroke();
	}
	for(let i = 0; i < map.countHoriorizontal; i++){
		ctx.strokeStyle = `#bcbcbc`;
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.moveTo(0, i * config.mapBlock);
		ctx.lineTo(map.width,i * config.mapBlock);
		ctx.closePath();
		ctx.stroke();
	}

	for(let cell in map.state) {
		const cellObject = map.state[cell];
		if (!cellObject) continue;
		
		const {x,y} = Map.translateCell(cell);
		
		
		ctx.fillStyle = 'rgba(255,204,0,0.15)';

		if (typeof cellObject === "object" && "type" in cellObject) {
			
			switch (cellObject.type) {
				case "mountain": ctx.fillStyle = 'rgba(92,91,91,0.15)'; break;
			}
			
		}

		

		ctx.fillRect(x , y , config.mapBlock, config.mapBlock);
	}

	/*
	for(let key in map.state) {
		const nY = Math.floor(key / (map.countHoriorizontal));
		const nX = key % map.countHoriorizontal;

		arrayElements.forEach(itemm => {
			let pos = {
				x: itemm.x,
				y: itemm.y
			};

			let keyPos = {
				x: (key % map.countHoriorizontal) * config.mapBlock + 8,
				y: Math.floor(key / (map.countHoriorizontal)) * config.mapBlock + 8
			};

			let vector = {
				x: keyPos.x - pos.x,
				y: keyPos.y - pos.y
			};

			let length = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));

			let unitV = {
				x: vector.x / length,
				y: vector.y / length
			}

			let edgeKey = Math.max(Math.floor((pos.x + unitV.x * itemm.speed) / config.mapBlock), 0) +
				Math.max(0, Math.floor((pos.y + unitV.y * itemm.speed) / config.mapBlock) * map.countHoriorizontal);

			if (edgeKey == key) {
				console.log(key);
				ctx.fillStyle = '#00ff00';
				ctx.fillRect((nX - 0) * config.mapBlock, (nY - 0) * config.mapBlock, config.mapBlock, config.mapBlock);
			}
		});

		// if (Math.sqrt(Math.pow(pos.x - (key % map.countHoriorizontal) * config.mapBlock, 2) +
		// 	Math.pow(pos.y - Math.floor(key / map.countHoriorizontal) * config.mapBlock, 2)) <= item1.speed) {
		// 	ctx.fillStyle = '#00ff00';
		// 	ctx.fillRect((nX - 0) * config.mapBlock, (nY - 0) * config.mapBlock,config.mapBlock,config.mapBlock);
		// }

		const item = map.state[key];

		if (!item) continue;

		ctx.fillStyle = '#ffd000';
		ctx.fillRect((nX - 0) * config.mapBlock, (nY - 0) * config.mapBlock,config.mapBlock,config.mapBlock);
	}


	 */

	if (startCord && !Interface.construction){
		ctx.fillStyle = '#ff000';
		ctx.fillRect(Math.min(startCord.x, endCord.x),Math.min(startCord.y, endCord.y),Math.abs(startCord.x - endCord.x), Math.abs(startCord.y - endCord.y) );
	}




	arrayElements.forEach(unit => {
		unit.moveStep();
		Render(unit).draw();
	})

	arraySelectedElements.forEach(unit => Render(unit).select())




	function divDestination(cord1, cord2){
		const maxV = 60;

		const v = Math.sqrt(Math.pow(cord1.x - cord2.x, 2) + Math.pow(cord1.y - cord2.y, 2));

		return  Math.min(v / maxV, 1);
	}



	for(let i = 0; i < arrayElements.length; i++ ) {
		for(let j = 0; j < arrayElements.length; j++) {
			if (i === j) continue;


			let itemI = arrayElements[i];
			let itemJ = arrayElements[j];


			ctx.strokeStyle = `rgba(255,0,0, ${1 - divDestination(itemI, itemJ)})`;
			ctx.beginPath();
			ctx.moveTo(itemI.x, itemI.y);
			ctx.lineTo(itemJ.x, itemJ.y);
			ctx.closePath();
			ctx.stroke();

		}
	}


	/**
	* Drawing move path
	* */
	arraySelectedElements.forEach(unit => {
		if (!unit.moveConfig) return;
		
		Render(unit).path();
		Render(unit).pathEndPoint();
		
	})


}, 1000 / config.fps)







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

	let cord = new Cord(e.x, e.y);


	function t({x,y}) {
		return Math.floor(y / config.mapBlock) * map.countHoriorizontal + Math.floor(x / config.mapBlock);
	}

	arraySelectedElements.forEach(item => item.move(cord))

}





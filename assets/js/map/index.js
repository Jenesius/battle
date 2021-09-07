import config from "./../config";
import Coordinate from "../class/cord-class";

let countVertical = null;
let countHoriorizontal = null;

export default class Map{

	//Size of global map
	height;
	width;

	map; // two-dimensional array

	constructor(height = 800, width = 800) {
		this.height = height;
		this.width  = width;
		this.map = {};

		countVertical = Math.ceil(this.height / config.mapBlock)
		countHoriorizontal = Math.ceil(this.width / config.mapBlock)

		console.log("Ver: ", countVertical, ". Hor:", countHoriorizontal)

		this.initialize();

	}

	get state(){
		return this.map;
	}

	get countVertical(){
		return countVertical;
	}
	get countHoriorizontal(){
		return countHoriorizontal;
	}
	initialize(){

		for (let i = 0; i < countVertical; i++) {
			for(let j = 0; j < Math.ceil(this.width / config.mapBlock); j++) {
				this.map[i * countVertical + j] = false;
			}
		}

	}

	/**
	 * Занимает ячейку
	 * */
	take(cord, v = true){
		this.map[Map.translateCoordinate(cord)] = v;
	}

	takeByCord(cell) {
		this.map[cord] = true;
	}

	/**
	 * Освобождает ячейку
	 * */
	free(cord){
		this.map[Map.translateCoordinate(cord)] = false;
	}

	/**
	 * Проверяет ячейку
	 *
	 * @return false - если ячейка занята
	 * Иначе вернёт номер ячейки
	 * */

	getCeil({x,y }){
		return  Math.floor(y / config.mapBlock) * countHoriorizontal + Math.floor(x / config.mapBlock);
	}

	check({x,y}){

		const numberCeil = this.getCeil({x,y});

		if (this.map[numberCeil] === true) return null;

		return numberCeil;

	}

	static translateCell(cell){
		let y = Math.floor(cell / countHoriorizontal);
		let x = cell - y * countHoriorizontal;

		return {x: x * config.mapBlock,y: y * config.mapBlock};
	}
	static translateCoordinate(xCoordinate,yCoordinate = null) {

		let x = xCoordinate;
		let y = yCoordinate;

		if (yCoordinate === null) {
			y = xCoordinate.y;
			x = xCoordinate.x;
		}

		return Math.floor(y / config.mapBlock) * countHoriorizontal + Math.floor(x / config.mapBlock);
	}
}
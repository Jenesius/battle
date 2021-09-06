import config from "../config";
import gameStorage from "../gameStorage";
import Size from "../class/size-class";
import Coordinate from "../class/cord-class";
import searchPath from "../map/search-path";
import Map from "../map/index";
import distanceBetweenCoordinate from "../utils/distanceBetweenCoordinate";

import pointBetweenCoordinate from "../utils/pointBetweenCoordinate";

export default class Unit{

	size;
	coordinate;

	x;
	y;
	id;

	static _id = 0;

	height;
	width ;
	speed;


	moveConfig;

	constructor(width, height, speed, x, y) {

		this.size = new Size(width, height);

		this.height = height;
		this.width  = width;
		this.speed  = speed;

		this.id = Unit._id++;

		this.position = {x,y};

		this.moveConfig = {
			x: x,
			y: y,
			path: []
		}
	}

	set position({x,y}){
		if (this.coordinate)
		gameStorage.map.free(this.coordinate);

		this.coordinate = new Coordinate(x,y);

		
		this.x = x;
		this.y = y;

		gameStorage.map.take(this.coordinate);

	}


	moveStep(){

		
		if (this.moveConfig === null) return;
		
		//Юнит уже находится в нужных координатах
		if (this.moveConfig.x === this.x && this.moveConfig.y === this.y) return this.moveConfig = null;

		
		//1. Найти сколько мы проходим за один такт tactDistance

		const tactDistance = this.speed / config.fps;
		let currentPosition = new Coordinate(this.coordinate); //Cope object
		let remainDistance = tactDistance;


		//2. Найти растояние до следующией картовой ячейки nextCellDistance

		/**
		 * !!!!!!
		 * Растояние нужно учитывать где находится точка
		 * Нам не всегда выгодно идти в левый верхний угол!
		 * */


		while(remainDistance > 0) {
			
			/**
			 * Получение следующих координат:
			 * Если мы не дошли до точки, то идём до неё
			 * Если новых точек нет - идём до конечной координаты(значит, то, что мы уже в конечной точке)
			 * */

			let nextPosition = null;

			//Если есть ячейки, куда двигаться
			if (this.moveConfig.path.length) nextPosition = Map.translateCell(this.moveConfig.path[this.moveConfig.path.length - 1]);
			//Иначе двигаемся в центр
			/**
			 * ОПТИМИЗИРОВАТЬ #1
			 * */
			//Координаты точки, куда следуем
			else nextPosition = new Coordinate(this.moveConfig);
			
			//Растояние до точки, куда следуем
			const moveDistance = distanceBetweenCoordinate(currentPosition, nextPosition);

			
			//Мы пришли до точки.
			if (moveDistance === 0) {
				if (this.moveConfig.path.length === 0) break; //Мы дошли до конечной точки
				else {
					this.moveConfig.path.pop();
					continue;
				}
			}

			//3. Если remainDistance > nextCellDistance -> передвигаем в ту сторону
			const exp = 0.000005;
			// Если путь, который мы всиле пройти больше, чем до следующей точки
			// Или эти путь +- равны
			if (remainDistance > moveDistance || (remainDistance - moveDistance) > exp) {
				currentPosition = nextPosition;
				this.moveConfig.path.pop();
				remainDistance -= moveDistance;
			}
			else {
				currentPosition = pointBetweenCoordinate(currentPosition, nextPosition, remainDistance);
				remainDistance = 0;
			}
		}
		
		return this.position = currentPosition;
	}
	move(cord = null) {
		if (cord === null) return console.warn("Parameter cord is required.");

		this.moveConfig = new Coordinate(cord);
		this.moveConfig.path = searchPath(Map.translateCoordinate(this.coordinate), Map.translateCoordinate(cord))
		this.moveConfig.cell = Map.translateCoordinate(this.moveConfig);

	}

}
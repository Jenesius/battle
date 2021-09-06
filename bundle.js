var config = {
	fps: 30,

	mapBlock: 15,
	marginSelectSize: 2,

	/**
	 * Стили для выделенных объектов
	 * */
	selectUnit: {
		margin: 3,
		color : 'rgba(255,0,0,0.43)',
		width : 1
	}
};

const storage = {

};

class Size{
    w;
    h;
    constructor(w,h) {

        if (w < 0 || h < 0) console.warn(`Width or height can't be negative. Width ${w}, Height ${h}`);

        this.w = w;
        this.h = h;
    }

}

class Coordinate{
    x;
    y;
    constructor(x,y = null) {

        if (y === null) {

            this.x = x.x;
            this.y = x.y;

            return;
        }

        this.x = x;
        this.y = y;
    }

}

function parse(mapCord){
	const map = storage.map;

	const y = Math.floor(mapCord / map.countVertical);
	const x = mapCord - y * map.countVertical;

	return {x,y};
}

function decode({x,y}) {
	return y * storage.map.countVertical + x;
}

function h(start, end) {
	const startCord = parse(start);
	const endCord   = parse(end);

	return Math.sqrt(Math.pow(startCord.x - endCord.x, 2) + Math.pow(startCord.y - endCord.y, 2))
}



function searchPath(start, end){


	function restorePath(){
		const path = [];

		let curr = end;


		while(curr !== start) {
			path.push(curr);
			curr = from[curr];
		}

		return path;
	}

	function minF(){

		let min = f[opened[0]];
		let v = opened[0];

		for(let i = 1; i < opened.length; i++) {
			if (f[opened[i]] < min) {
				min = f[opened[i]];
				v = opened[i];
			}
		}

		return v;
	}

	function getNeighbour(v){
		storage.map.countVertical;

		const maxValue = storage.map.countVertical * storage.map.countHoriorizontal;

		const current = parse(v);



		const array = [
			{x: current.x, y: current.y - 1}, // TOP

			{x: current.x - 1, y: current.y}, // LEFT
			{x: current.x + 1, y: current.y}, // RIGHT
			
			{x: current.x, y: current.y + 1}, // BOTTOM
		];

		return array.filter(elem => elem.x >= 0 && elem.x <= maxValue && elem.y >= 0 && elem.y <= maxValue).map(item => decode(item)).filter(item => storage.map.state[item] !== true);
	}

	const closed = []; //Массив прошедших вершин
	const opened = [start]; //Массив вершин, до которых мы дошли, но ещё не просмотрели

	const from = [];

	const g = [];
	const f = [];
	g[start] = 0;
	f[start] = g[start] + h(start, end);




	while(opened.length) {



		const curr = minF();


		if (curr === end) {
			console.log("finish");
			console.log("Start", start, ". End", end);

			return restorePath();
		}


		/**Remove from opened*/
		opened.splice(opened.indexOf(curr), 1);

		closed.push(curr);


		const arrayN = getNeighbour(curr);

		arrayN.filter(item => !closed.includes(item)).forEach(item => {

			const tempG = g[curr] + 1; // 1 - DIST

			if (!opened.includes(item) || tempG < g[item]) {

				from[item] = curr;

				g[item] = tempG;

				f[item] = g[item] + h(item, end);
			}

			if (!opened.includes(item)) opened.push(item);

		});





	}




}

let countVertical = null;
let countHoriorizontal = null;

class Map{

	//Size of global map
	height;
	width;

	map; // two-dimensional array

	constructor(height = 800, width = 800) {
		this.height = height;
		this.width  = width;
		this.map = {};

		countVertical = Math.ceil(this.height / config.mapBlock);
		countHoriorizontal = Math.ceil(this.width / config.mapBlock);

		console.log("Ver: ", countVertical, ". Hor:", countHoriorizontal);

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
	take(cord){
		this.map[Map.translateCoordinate(cord)] = true;
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

var distanceBetweenCoordinate = (cordStart, cordEnd) => Math.sqrt(Math.pow(cordStart.x - cordEnd.x, 2) + Math.pow(cordStart.y - cordEnd.y, 2));

var pointBetweenCoordinate = (cordStart, cordEnd, distance) => {
    //Гипотенуза, путь от start до end
    let L = distanceBetweenCoordinate(cordStart, cordEnd);
    
    let vector = {
        x: cordEnd.x - cordStart.x,
        y: cordEnd.y - cordStart.y
    };
    
    const lambda = distance / L;
    
    vector.x *= lambda;
    vector.y *= lambda;
    
    return {
        x: cordStart.x + vector.x,
        y: cordStart.y + vector.y
    };

};

class Unit{

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
		};
	}

	set position({x,y}){
		if (this.coordinate)
		storage.map.free(this.coordinate);

		this.coordinate = new Coordinate(x,y);

		
		this.x = x;
		this.y = y;

		storage.map.take(this.coordinate);

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
		this.moveConfig.path = searchPath(Map.translateCoordinate(this.coordinate), Map.translateCoordinate(cord));
		this.moveConfig.cell = Map.translateCoordinate(this.moveConfig);

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

document.body.style.backgroundColor = "rgba(29,28,28,0.86)";

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

const functionArray = [
    {
        title: "mountain",
        src: "https://st3.depositphotos.com/9461386/36064/v/600/depositphotos_360646636-stock-illustration-pixel-fuji-mountain-at-sunset.jpg",
        

        activate: () => {
            
            
            
            canvas.addEventListener("mousedown", e => {
    
                function addMountain(e){
                    storage.map.take(e, {
                        type: "mountain"
                    });
                }
                
                canvas.addEventListener("mousemove", addMountain);
                

                
                canvas.addEventListener("mouseup", () => {
    
                    canvas.removeEventListener("mousemove", addMountain);
                    
                });
                
            });
            
        }
    }
];


function initialize(){
    
    const container = document.getElementById("function-panel");
    
    functionArray.forEach(elem => {
        
        const div = document.createElement("div");
        const image = document.createElement("img");
        image.src = elem.src;
        image.alt = elem.title;
        div.appendChild(image);
        
        div.addEventListener("click", elem.activate);
        
        container.append(div);
    });
    
}

function Render(unit) {

    const size = unit.size;
    const coordinate = unit.coordinate;

    /**
     * Function returns coordinates of the upper left corner
     * @param cord
     * @param size
     */
    function getStartCoordinate(cord, size) {
        return {
            x: cord.x - size.w / 2,
            y: cord.y - size.h / 2
        }
    }

    /**
     * Function draws the object unit. Object includes two fields: coordinate(x,y) and size(w,h).
     * */
    function draw(){
        const tmpCoordinate = getStartCoordinate(coordinate, size);

        ctx.fillStyle = 'blue';
        ctx.fillRect(tmpCoordinate.x, tmpCoordinate.y, size.w, size.h);
    }


    /**
     * Function draws select stroke around the unit
     * */
    function select(){
        const selectSize = new Size(size.w + config.selectUnit.margin * 2, size.h + config.selectUnit.margin * 2);

        const tmpCoordinate = getStartCoordinate(coordinate, selectSize);

        ctx.strokeStyle = config.selectUnit.color;
        ctx.lineWidth   = config.selectUnit.width;
        ctx.strokeRect(tmpCoordinate.x, tmpCoordinate.y, selectSize.w, selectSize.h);

    }
    
    /**
     *
     * */
    function path(){
        if (!unit.moveConfig) return;
    
        const path = unit.moveConfig.path;
        path.forEach(cell => {
            ctx.fillStyle = 'rgba(134,163,212,0.55)';
        
            const {x,y} = Map.translateCell(cell);
        
            ctx.fillRect(x,y, config.mapBlock, config.mapBlock );
        });
    }
    
    function pathEndPoint(){
        if (!unit.moveConfig) return;
    
        const path = unit.moveConfig.path;
        if (path.length) {
            const lastCellCoordinate = Map.translateCell(path[0]);
            ctx.strokeStyle = "#ffcf00";
            ctx.strokeRect(lastCellCoordinate.x, lastCellCoordinate.y, config.mapBlock, config.mapBlock);
        }
    }

    return {
        draw,
        select,
        pathEndPoint,
        path
    }

}

initialize();

const map = new Map();

storage.map = map;


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

	for(let key in map.state) {
		const item = map.state[key];
		if (!item) continue;

		const nY = Math.floor(key / map.countHoriorizontal);
		const nX = key - nY * map.countHoriorizontal;

		ctx.fillStyle = 'rgba(255,204,0,0.15)';
		ctx.fillRect(nX * config.mapBlock, nY * config.mapBlock,config.mapBlock,config.mapBlock);
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

	if (startCord){
		ctx.fillStyle = '#ff000';
		ctx.fillRect(Math.min(startCord.x, endCord.x),Math.min(startCord.y, endCord.y),Math.abs(startCord.x - endCord.x), Math.abs(startCord.y - endCord.y) );
	}




	arrayElements.forEach(unit => {
		unit.moveStep();
		Render(unit).draw();
	});

	arraySelectedElements.forEach(unit => Render(unit).select());




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
		
	});


}, 1000 / config.fps);







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

	let cord = new Cord(e.x, e.y);

	arraySelectedElements.forEach(item => item.move(cord));

}

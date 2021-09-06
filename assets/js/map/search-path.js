
import gameStorage from "./../gameStorage.js";

function parse(mapCord){
	const map = gameStorage.map;

	const y = Math.floor(mapCord / map.countVertical);
	const x = mapCord - y * map.countVertical;

	return {x,y};
}

function decode({x,y}) {
	return y * gameStorage.map.countVertical + x;
}

function h(start, end) {
	const startCord = parse(start);
	const endCord   = parse(end);

	return Math.sqrt(Math.pow(startCord.x - endCord.x, 2) + Math.pow(startCord.y - endCord.y, 2))
}



export default function searchPath(start, end){


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
		let v = opened[0]

		for(let i = 1; i < opened.length; i++) {
			if (f[opened[i]] < min) {
				min = f[opened[i]]
				v = opened[i];
			}
		}

		return v;
	}

	function getNeighbour(v){
		const ver = gameStorage.map.countVertical;

		const maxValue = gameStorage.map.countVertical * gameStorage.map.countHoriorizontal;

		const current = parse(v);



		const array = [
			{x: current.x, y: current.y - 1}, // TOP

			{x: current.x - 1, y: current.y}, // LEFT
			{x: current.x + 1, y: current.y}, // RIGHT
			
			{x: current.x, y: current.y + 1}, // BOTTOM
		];

		return array.filter(elem => elem.x >= 0 && elem.x <= maxValue && elem.y >= 0 && elem.y <= maxValue).map(item => decode(item)).filter(item => gameStorage.map.state[item] !== true);
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
			console.log("finish")
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

		})





	}




}